---
title: "OnionCall's security model: defense in depth with a shared secret"
date: "2026-08-15"
excerpt: "AES-256-CBC, PBKDF2, HMAC-SHA256, replay protection, constant-time comparison, and a zero-knowledge relay — the layer-by-layer security architecture of an encrypted voice app with no server to trust."
tags: ["Security", "Cryptography", "Go", "Tor"]
---

# OnionCall's security model: defense in depth with a shared secret

Most security writeups are theater — a checklist of algorithms pasted over an architecture that was decided for other reasons. This one is the opposite: **every layer exists because the layer above it has a specific failure mode**, and the design was built from the bottom up to make those failures survivable.

[Last post](onioncall-architecture) covered the system shape: two peers, each running a Tor hidden service, talking over a plaintext protocol that carries ciphertext. This post goes one level down — the exact crypto decisions, why they're shaped the way they are, and which ones I'd defend in a review.

## The threat model, stated plainly

OnionCall protects against a specific set of adversaries:

- **The Tor network** — sees that *some* traffic is flowing, and can correlate timing. It must never see content.
- **The relay operator** (group mode) — can observe volume and timing. Must never read content or learn identities.
- **A network eavesdropper** on either side — same position as the Tor network, minus the onion.
- **A file thief** — the shared secret at rest must resist offline brute force.

The model does **not** protect against: a peer who has the secret recording you (impossible to prevent without attestation), or a future compromise of the secret decrypting past recordings (no forward secrecy — documented, accepted). Being explicit about what you *don't* protect against is the first real security decision.

## Layer 1: content — AES-256-CBC with PBKDF2

Every audio frame and text message is encrypted with **AES-256-CBC**, key derived from a **shared secret** via **PBKDF2-SHA256**. The parameters:

| Parameter | Value |
|---|---|
| Cipher | AES-256-CBC (FIPS 197, SP 800-38A) |
| Key size | 256 bits |
| Per-message KDF | PBKDF2, HMAC-SHA256, 1,000 iterations, random 8-byte salt |
| Secret-at-rest KDF | PBKDF2, 100,000 iterations |
| Padding | PKCS#7 |
| Output format | OpenSSL-compatible (`Salted__` prefix) |

Two iteration counts, deliberately different:

- **1,000 per message** because audio runs at **50 frames/second** — 50 PBKDF2 runs per second of speech. The free-tier of the CPU budget is real.
- **100,000 for the secret file** because that file gets one key derivation per unlock, and it's the thing a thief actually steals. Brute-forcing a passphrase through 100,000 SHA-256 iterations is the difference between days and centuries.

The `Salted__` format is the compatibility tax that makes the whole project possible: the original Bash script used `openssl enc`, so the Go version speaks the same format. You can decrypt a captured frame with:

```bash
openssl enc -d -aes-256-cbc -pbkdf2 -iter 1000 -pass pass:<secret>
```

The OpenSSL compatibility is a *constraint*, and it explains the biggest crypto decision: **CBC instead of an authenticated mode**. AES-GCM or ChaCha20-Poly1305 would be the modern choice, and the docs say so explicitly. But wire compatibility with existing peers is worth more than purity — which is why HMAC exists as a bolt-on (next section).

## Layer 2: integrity — HMAC-SHA256, constant-time

Encryption gives confidentiality. CBC alone gives you *nothing* about integrity — a bit flip in the ciphertext corrupts the decrypted block, and an attacker who knows the format can flip specific plaintext bits. That's why every protocol message is signed with **HMAC-SHA256** (RFC 2104 / FIPS 198-1):

```go
func GenerateHMAC(message, secret []byte) []byte {
    h := hmac.New(sha256.New, secret)
    h.Write(message)
    return h.Sum(nil)
}
```

The verification is the part that matters:

```go
// constant-time — no early exit on the first mismatched byte
subtle.ConstantTimeCompare(sig, expected)
```

This is the bug class the Bash script couldn't fix. Shell string comparison short-circuits on the first differing byte, leaking timing information about the secret's prefix byte-by-byte. Go's `crypto/subtle` is the whole point of the rewrite in one function call.

## Layer 3: freshness — nonce tracking against replay

An attacker who can't decrypt can still *replay*: record a valid `AUDIO:` frame and inject it later. The defense is a **NonceTracker** — every message carries a random nonce, the tracker remembers seen nonces for 10 minutes, and duplicates are rejected:

```go
type NonceTracker struct {
    nonces map[string]time.Time
}
```

10 minutes is the window that matters: long enough to catch replay of live traffic, short enough to keep the map bounded. Old nonces are pruned on access. Thread-safe via `sync.Mutex` because the receive loop and the keepalive goroutine both touch it.

## Authentication: implicit, and proud of it

There are no certificates and no public keys. Authentication is **implicit**: both parties must know the same secret to encrypt and decrypt. If the secrets don't match, decryption fails — garbage output plus a padding error.

This is a genuine simplification with a genuine cost. No key exchange, no revocation, no identity verification beyond the secret itself. The mitigation is operational: you share the secret **out-of-band** (in person, or over an already-secure channel) before the first call. For a tool whose entire premise is "no accounts, no phone numbers," a pre-shared secret is the smallest viable identity primitive — and the project documents the tradeoff in the security model rather than hiding it.

## Layer 4: transport — Tor, SOCKS5, Snowflake

Content security is OnionCall's job. Transport anonymity is Tor's:

- Each peer runs a v3 hidden service (Rendezvous Spec v3), reachable only at its `.onion` address.
- Outbound calls dial through Tor's SOCKS5 proxy (port 19050) with stream isolation.
- **Snowflake bridges** (USENIX Security '24, Bocovich et al.) provide an optional pluggable transport — when Tor itself is blocked, traffic is funneled through temporary browser-based WebRTC proxies via domain fronting.

The division of labor is clean: **Tor hides who you are; crypto hides what you say.** Neither layer trusts the other, which is the definition of defense in depth.

## The zero-knowledge relay: group calls without trust

Group mode runs through a relay that any peer can host. Its properties are load-bearing:

- **No shared secret** — the relay never holds the keys, so it cannot decrypt by design.
- **Filtered forwarding** — only `AUDIO:`, `MSG:`, `PING` pass; identity and control signals are dropped.
- **No persistence** — data flows through pipe buffers; nothing touches disk.
- **Random client IDs** — opaque, `crypto/rand`-generated, unlinkable.

The honest summary from the security doc: *compromising the relay only leaks that someone is communicating, not what they're saying.* That's the ceiling for any centralized component in this design, and the relay is built to sit exactly at it.

## Operational security: the part nobody sees

The crypto is only as good as the key handling around it:

- The shared secret lives in a `[]byte` in the crypto manager, **never logged, never exposed** — the API returns only `set: true/false`, `locked: true/false`, `loaded: true/false`.
- On shutdown, `ClearMemory()` zeroes the slice — the secret is wiped from RAM before the process exits.
- The secret never appears in any process command line.
- Tor runs as a separate child process; the Go backend talks to it only over TCP.
- Shutdown is a deliberate reverse-order sequence: hang up → stop audio → disconnect relay → **SIGTERM Tor** → drain HTTP → close SQLite → **clear the secret last**.

One rejected idea worth mentioning: the Bash script had an "overwrite-before-delete" feature that wiped temp files with `/dev/urandom`. The Go version dropped it — because the Go version uses in-memory buffers instead of temp files, and because overwrite doesn't guarantee erasure on SSDs anyway (wear leveling). **Full-disk encryption is the proper defense**, and pretending otherwise would be security theater.

## What I'd change, and what I wouldn't

If I were building this from scratch today with no legacy constraint, the one change I'd make is authenticated encryption — AES-GCM or ChaCha20-Poly1305 — to fold integrity into the cipher and drop the separate HMAC layer. It's simpler and stronger. The only reason OnionCall doesn't is the wire-compatibility requirement with the original script's OpenSSL format. That's a real constraint, not an excuse, but it's also the single clearest upgrade path.

What I wouldn't change: the implicit-auth model (it's the product), the constant-time verification (it's the non-negotiable), and the explicit non-goals (no forward secrecy, documented and accepted). **A security model that names its limits is one you can actually reason about.**

The research that grounds every decision in this post — from Dingledine et al. USENIX '04 through RFC 6716, FIPS 197, and the Snowflake paper — lives in the project's [technology research compendium](https://gitlab.com/kumaranubhav20026/terminalphone). If the crypto is the skeleton, that compendium is the bibliography of why.

Up next: the latency post — [making real-time voice work over a network built for web pages](onioncall-latency).
