---
title: "OnionCall: how push-to-talk voice survives the Tor network"
date: "2026-08-14"
excerpt: "No server, no accounts, no phone numbers — your .onion address is your identity. The architecture that makes encrypted real-time voice plausible over a network designed for latency, not conversation."
tags: ["Go", "Tor", "Networking", "Architecture"]
---

# OnionCall: how push-to-talk voice survives the Tor network

**[OnionCall](https://gitlab.com/kumaranubhav20026/terminalphone)** is a peer-to-peer, end-to-end encrypted push-to-talk voice and text system that routes every call through Tor hidden services. No central server, no accounts, no phone numbers. Your `.onion` address **is** your identity.

That sentence contains three architectural bets that are each easy to get wrong, and one that's easy to get *impossible*. This post is about how the whole thing fits together — and which parts of the design exist purely to satisfy the constraints the other parts created.

## The core shape: every peer is a server

Most "peer-to-peer" apps quietly mean "peer-to-peer behind our relay." OnionCall doesn't have the option. The design is:

```
Peer A                              Peer B
┌──────────────────────┐            ┌──────────────────────┐
│ Svelte 5 UI          │            │ Svelte 5 UI          │
│ Go API (port 8080)   │            │ Go API (port 8080)   │
│ Session state machine│            │ Session state machine│
│ Crypto (AES-256+HMAC)│            │ Crypto (AES-256+HMAC)│
│ Audio pipeline (Opus)│            │ Audio pipeline (Opus)│
│ Tor hidden service   │◀── Tor ───▶│ Tor hidden service   │
└──────────────────────┘            └──────────────────────┘
```

Each peer runs its **own Tor hidden service**, bound to `127.0.0.1:7777`. The Tor process writes a `hostname` file containing the v3 `.onion` address — that address is what you share with a peer, out-of-band, before the first call. There is no account creation endpoint, because there's nothing to create an account *against*.

This is the Dingledine–Mathewson–Syverson model from *"Tor: The Second-Generation Onion Router"* (USENIX Security '04) taken to its logical end: if the anonymity layer is good enough that the *identity* is an unguessable address, then the "server" can be a personal device with no public IP. The rendezvous and introduction infrastructure of v3 onion services (specced in the Tor Rendezvous Spec v3) does the NAT-traversal work for you — your peer finds you through Tor's introduction points, and neither of you ever learns the other's IP.

## The one constraint that shapes everything: latency

Tor is built for *anonymous retrieval of web content*, not real-time conversation. A circuit through three relays adds hundreds of milliseconds, and the hidden-service path adds a rendezvous round-trip on top. Full-duplex VoIP over that is a recipe for broken audio — echo, clipping, overlapping speech.

The design response is **push-to-talk**. Voice is transmitted as 20 ms Opus frames **only while the PTT key is held**. Half-duplex by construction:

- One direction at a time, at 32 kbps — the bandwidth profile Tor can actually carry.
- No duplex echo cancellation needed, because you're never simultaneously sending and receiving.
- The mic gain, high-pass filter, and PTT chime in the UI are all there to make the half-duplex moment legible — you *know* you're transmitting because the spectroscope and level meters tell you.

The 20 ms frame size is not a coincidence. Opus's algorithmic delay is **26.5 ms total** (RFC 6716 §2.1) — the codec adds almost nothing; the dominant latency is the network path. With 20 ms frames at 50 fps, the encode/decode pipeline stays far below the ITU-T G.114 one-way budget of ≤150 ms, which means the *only* latency a user perceives is Tor's, and that's the constraint we can't remove, only design around. PTT is the design-around.

## The session state machine

Every call is a tiny state machine with exactly four states:

```
Idle ──▶ Listening ──▶ Connecting ──▶ Connected
  ▲                       │              │
  └───────────────────────┴──────────────┘
```

- **Listening** — your hidden service is up and waiting on port 7777.
- **Connecting** — you dialed a peer's `.onion` through Tor's SOCKS5 proxy (port 19050).
- **Connected** — the handshake completed: both sides exchanged `ID:<onion>` and `CIPHER:<cipher>`, and a 30-second `PING` keepalive is running to detect dead peers.

The state machine is guarded by mutexes (Go's `sync` package, per the memory model) because three goroutines touch it concurrently: the Tor output scanner, the audio capture loop, and the receive loop. This is the kind of code where a data race isn't a test failure — it's a dropped call in production.

## The wire protocol: plaintext lines carrying ciphertext

All messages are newline-delimited text: `TYPE:payload\n`. Binary payloads (audio, text) are base64. The protocol is deliberately **identical to the original Bash script** it replaces — the Go app can talk to the legacy script, and vice versa.

```
PTT_START            → "remote is recording"
AUDIO:<base64>       → encrypted 20ms Opus frame (50/sec while held)
AUDIO:<base64>
PTT_STOP
MSG:<base64>         → encrypted text message
PING                 → keepalive every 30s
HANGUP               → end the call
```

That `AUDIO:` message is the whole product in one line. The payload is:

```
PCM  →  Opus encode  →  AES-256-CBC encrypt (PBKDF2 key)  →  base64
```

Per-frame encryption means each 20 ms chunk is independently sealed — a corrupted frame corrupts only itself, and every frame gets a fresh random salt, so identical plaintexts produce different ciphertexts (NIST SP 800-38A's unique-IV requirement, applied per-message).

## The zero-knowledge relay (group calls)

Direct calls are the product. Group calls are a deliberate second shape: a **relay hub** that any peer can run with `POST /api/relay/start`.

The relay is a *zero-knowledge bridge*:

- It has **no shared secret** — it never holds encryption keys.
- It only forwards `AUDIO:`, `MSG:`, and `PING`; control messages (`HANGUP`, `PTT_*`, identity) are filtered out, so one caller leaving can't disconnect everyone.
- It stores nothing — data flows through kernel pipe buffers.
- `GROUP:<N>` broadcasts the live caller count.

The threat model is honest about what this means: **compromising the relay leaks that someone is communicating, but not what they're saying, and not who they are** (each client gets a random opaque ID from `crypto/rand`). The relay operator can neither read nor identify. That's the best a relay can do, and it's the entire security contract of the group mode.

## Why it had to be one binary

The Go rewrite exists because the Bash prototype taught an expensive lesson about operational security. The original script spawned `openssl`, `sox`, `socat`, and `tor` as separate processes, juggled temporary files, and compared secrets with shell string equality — constant-time comparison wasn't possible in Bash. The Go version is one static binary with the Svelte UI embedded via `go:embed`:

- `internal/tor` — Tor process management, torrc generation, `Bootstrapped N%` parsing from stdout, Snowflake bridge config.
- `internal/crypto` — PBKDF2 key derivation, AES-256-CBC, HMAC-SHA256 with constant-time compare, replay-protection nonce tracker.
- `internal/audio` — Opus codec (a CGo binding), capture/playback via `arecord`/`sox`, the frame pipeline.
- `internal/session` — the state machine and connection lifecycle.
- `internal/relay` — the zero-knowledge group bridge.

Three direct dependencies total (`go-sqlite3`, `x/crypto`, `opus.v2`). The UI lives inside the binary. The desktop app (Tauri v2) spawns the same backend and opens it in a native window. One binary, one security boundary, one thing to audit.

## What this buys, and what it costs

The architecture is a pure expression of its constraints:

| Constraint | Design response |
|---|---|
| Tor is slow | Push-to-talk, 20 ms Opus frames, half-duplex |
| No central infra | Every peer runs a hidden service |
| No accounts | The `.onion` address is the identity |
| Bash can't do crypto safely | One Go binary, constant-time everywhere |
| Group calls need a hub | Zero-knowledge relay, filtered forwarding |

The cost is real: no perfect forward secrecy (a compromised secret decrypts past traffic — the docs are upfront about it), no certificate-based identity, and Tor's latency is always there. But the *design* never pretends otherwise — it's the only honest way to ship a network app that says "no servers."

The result is a tool where the privacy story isn't a feature flag — it's the architecture. The next post digs into the security model layer by layer, including the exact crypto decisions and the papers behind them: [defense in depth with a shared secret](onioncall-security).
