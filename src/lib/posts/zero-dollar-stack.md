---
title: "The $0 stack: shipping production software on free tiers, on purpose"
date: "2026-08-13"
excerpt: "Free tiers aren't a hack for side projects — they're a forcing function. Three production projects, zero monthly bill, and the constraints that made them better."
tags: ["$0 Stack", "Deployment", "Serverless", "Architecture"]
---

# The $0 stack: shipping production software on free tiers, on purpose

Three of my projects run in production right now. Their combined infrastructure bill is **$0/month** — and that isn't an accident or a corner cut. It's a deliberate architectural stance: **treat free-tier limits as requirements, and let them shape the design.**

The projects: **[Lumina](lumina-deterministic-core)** (a Telegram bot on Render free + Neon + Upstash), **[PulseRAG](https://github.com/KumarAnubhav64/PulseRAG)** (audio → grounded RAG, boots in ~80MB RAM for the 512MB free tier), and **[Peekaboo](peekaboo-zero-dollar-face-recognition)** (face recognition on HF Spaces + Vercel + Neon).

## Free tiers are the real spec

The most productive constraint I've ever worked with is a 512MB memory cap. PulseRAG had to run RAG on Render's free tier, so:

- No `langchain` — it alone would eat the budget. The RAG pipeline is hand-built: embeddings → FAISS index → retrieval → prompt assembly.
- No GPU, ever. Everything runs on CPU, everything is lazy-loaded, everything streams to disk instead of holding in memory.
- A **demo mode that works with zero API keys** — because the demo should never depend on the user's credentials.

The result isn't a worse product that happens to be free. It's a *faster, leaner* product. The memory cap forced me to know exactly what my stack loads, which is the kind of knowledge that pays off in every other context.

## The math that keeps it free

The trick is that the expensive parts get eliminated, not budgeted for:

| Usually costs money | The free replacement |
|---|---|
| Paid model APIs (per-call) | Open models running locally (InsightFace, ONNX) |
| Managed vector DB | `pgvector` inside the Postgres you already have |
| Big-memory ML frameworks | Hand-built pipelines, lazy loading, ~80MB boots |
| Sleepy server instances | Serverless + durable retry queues (cold starts become a non-issue) |

## The hidden win: it forces honesty about scope

A $200/month architecture can hide a lot of waste. A $0 architecture can't. You learn quickly:

- **What actually needs to be a service** vs. what can be a function.
- **What actually needs a database** vs. what a file would do.
- **What actually needs to be real-time** vs. what a queue fixes.

These are the same questions every senior engineer asks, except the free tier asks them *for you*, with a hard deadline.

## When it's the wrong call

To be fair: $0 is not always right. If I were building a product with real revenue and real SLAs, I'd pay for a managed queue, a bigger box, and support contracts. The free-tier stance is the right call for: portfolio projects, tools you want to exist for years without maintenance burden, and learning — because nothing teaches you about your stack like fitting it into 512MB.

## The throughline

Every one of these projects ended up more reliable because it had to be cheap:

- Lumina's send-retry queue exists *because* serverless Redis cold starts could drop messages — the constraint produced the reliability feature.
- Peekaboo runs models on-device *because* APIs cost money — the constraint produced the privacy story.
- PulseRAG hand-builds RAG *because* frameworks are heavy — the constraint produced a 10× faster boot.

Constraints aren't the enemy. They're the sharpest tool in the box.

Want to see how it plays out in practice? The [Peekaboo post](peekaboo-zero-dollar-face-recognition) walks through a full $0 production stack, end to end.
