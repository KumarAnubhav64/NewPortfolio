---
title: "Latency is the product: why OnionCall is push-to-talk, not VoIP"
date: "2026-08-16"
excerpt: "Tor adds hundreds of milliseconds by design. Voice calls either engineer around it or die. The ITU-T G.114 budget, Opus's 26.5ms algorithmic delay, and the audio pipeline that makes half-duplex voice actually work."
tags: ["Latency", "Audio", "Networking", "Go", "Tor"]
---

# Latency is the product: why OnionCall is push-to-talk, not VoIP

The hardest problem in OnionCall was never the cryptography. It's that **voice has a latency budget and Tor blows through it by design**.

A Tor circuit through three relays adds on the order of a *second* end-to-end in the worst case, and hidden services add a rendezvous round-trip on top. Full-duplex VoIP — both parties talking simultaneously, like a phone call — is essentially impossible over that. If you've ever been on a video call with 400 ms of delay, you know what the failure looks like: people talk over each other, stop-start, apologize, hang up.

So the product decision is the engineering decision: **push-to-talk, half-duplex, built around the ITU-T G.114 latency budget.**

## The budget that rules everything

ITU-T G.114 sets the classic one-way transmission time guidelines:

| One-way delay | Experience |
|---|---|
| ≤ 150 ms | Acceptable for most applications |
| 150 – 400 ms | Noticeable, conversation still works |
| > 400 ms | Unacceptable for conversational speech |

OnionCall can't move the network delay — that's Tor's contribution and it's the point of the app. What it *can* do is make sure **everything OnionCall controls adds almost nothing**, so the entire budget belongs to the network path.

## Opus: the codec that fits the budget

The audio codec is [Opus](https://opus-codec.org/), specifically its voice mode. Two properties matter here:

1. **Algorithmic delay of 26.5 ms total** (RFC 6716 §2.1) — the codec itself adds almost nothing to the pipeline. This is the CELT low-delay transform coder (Valin et al., "A Full-Bandwidth Audio Codec With Low Complexity And Very Low Delay," EUSIPCO 2009) and the SILK speech coder (draft-vos-silk-02) working together: CELT for the music/full-band case, SILK for voice.
2. **20 ms frames** — the sweet spot where per-frame overhead stays negligible.

The concrete numbers in the codebase:

```go
SampleRate = 48000   // 48 kHz
Channels   = 1       // mono
FrameSize  = 960     // samples per 20 ms frame
FrameBytes = 1920    // bytes per 20 ms frame
Bitrate    = 32000   // 32 kbps
```

32 kbps is the *other* constraint: it's the highest bitrate that stays polite on a constrained link. Tor adds per-frame bandwidth overhead (the `Salted__` + salt + ciphertext + base64 inflation), so every bit above 32 kbps is bits competing with the network for throughput. Voice at 32 kbps is intelligible, and it's the number that keeps 50 frames/second from drowning the circuit.

## The pipeline: capture → encode → encrypt → send

The audio path is a straight line with no unnecessary hops:

```
Microphone → int16 PCM @48kHz, 20ms frames
          → Opus encode (AppVoIP, 32 kbps)
          → AES-256-CBC encrypt (PBKDF2, fresh salt per frame)
          → base64 → "AUDIO:<payload>"
          → TCP → Tor SOCKS5 → Tor network → peer's hidden service
```

And mirrored on receive:

```
peer's hidden service → TCP → session.receiveLoop()
          → base64 decode → AES decrypt → Opus decode → int16 PCM
          → playback subprocess (aplay / sox) → speakers
```

Two implementation details are worth stealing:

**The playback buffer is bounded.** `playCh chan []byte` has capacity 16 — about 320 ms of audio. Sends are non-blocking: if the buffer is full, the frame is *dropped*, not queued forever. This is a deliberate choice. Under network jitter, unbounded buffering grows latency without bound (the "buffer bloat" of VoIP); bounded buffering sacrifices a frame occasionally to keep *latency constant*. For push-to-talk voice, dropping a 20 ms frame is invisible. Growing delay is not.

**Frame capture uses 1920-byte reads from a subprocess.** Audio capture and playback run through `arecord`/`aplay` (Linux) or `sox` (macOS/Windows) — small system tools spawned by Go, read from stdout in exact 1920-byte chunks. No native audio libraries, no CGo audio dependencies, one less thing to break cross-platform. The audio I/O is dumb pipes; the intelligence is all in the Opus + crypto pipeline.

## Why half-duplex is a feature, not a compromise

The obvious objection: "push-to-talk is worse than normal calls." It is — in the same way a *walkie-talkie* is worse than a phone. But the trade is not symmetric:

**What you lose:** simultaneous speech. **What you gain:** the only voice modality that survives Tor.

- No echo cancellation needed — you're never sending and receiving at once, so the whole DSP problem disappears.
- No duplex management — the UI is honest about the moment: PTT held = transmitting, and the mic level meters + spectroscope make it visible.
- Lower bandwidth — one direction at a time at 32 kbps.
- Simpler state — the session machine only ever has one "active" audio direction to track.

There's a reason encrypted comms tools like Zello are push-to-talk, and it's the same reason: **on a constrained, high-latency channel, half-duplex is the difference between a working product and a demo that sounds broken.**

## Keepalive: the invisible requirement

A Tor circuit doesn't stay alive by itself, and a peer that's silently gone shouldn't hold your call open. Every 30 seconds during a call, both sides send `PING`. There's no response — if you receive a PING, you know the connection is alive. If *no* messages arrive for 30 seconds, the connection is dead and the session returns to Idle. Simple, no state to sync, no handshake to implement.

This matters more than it looks: on Tor, a "connection closed" signal can be delayed or swallowed entirely. The keepalive is the circuit's heartbeat, and it's the reason a dead peer doesn't hang the UI.

## The Bash → Go rewrite: latency lessons applied

The original TerminalPhone was a Bash script — `socat` + `openssl` + `sox` orchestrated with pipes. It worked, and its wire protocol was good enough to keep. But the Go rewrite fixed the places where shell orchestration *couldn't* meet the latency requirement:

- **Subprocess startup latency** — spawning `openssl` per message was the old approach's tax; Go does the crypto in-process with zero fork overhead.
- **Frame-level control** — 1920-byte chunk reads and bounded channels are only possible in a language with real concurrency primitives; Bash was assembling pipelines and hoping.
- **The 50 fps budget** — PBKDF2 at 1,000 iterations per frame is the number that fits 50 frames/second of real-time audio, and that's a *measured* choice, not a default.

The protocol stayed byte-compatible (the docs [document the migration](https://gitlab.com/kumaranubhav20026/terminalphone) in full), but the latency behavior is the thing the rewrite actually bought.

## The honest accounting

| Delay source | Contribution | Can we change it? |
|---|---|---|
| Opus algorithmic delay | 26.5 ms | No (spec) — but it's tiny |
| Capture + playback buffering | ~40 ms round-trip | Barely — bounded channels keep it flat |
| Encryption (PBKDF2 × 1,000, AES) | ~1–2 ms/frame | No (compat format) — negligible |
| **Tor circuit + rendezvous** | **hundreds of ms, variable** | **No — it's the product** |
| **Total** | **network-bound** | **yes, and that's the point** |

The architecture doesn't fight the network — it *yields* to it. Every component OnionCall owns contributes single-digit milliseconds; the budget is spent where it must be, on the anonymity network itself. Push-to-talk is the mechanism that makes the remaining budget survivable.

The [security model](onioncall-security) post covers the crypto layer that rides on top of this pipeline. And if you want the whole story from boot to call, the project's [architecture docs](https://gitlab.com/kumaranubhav20026/terminalphone) walk through it end to end.
