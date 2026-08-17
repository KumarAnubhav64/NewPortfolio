---
title: "The right nudge at the right minute: making a $0 bot's core promise survive failure"
date: "2026-08-17"
excerpt: "Every message my Telegram bot sent was fire-and-forget — a 429, a network blip, or a 30-second cold start silently dropped the one thing the product exists for. Here's the durable retry queue that fixed it, for $0, on a free tier that sleeps."
tags: ["Redis", "Reliability", "Telegram", "Backoff", "Free Tier"]
---

# The right nudge at the right minute: making a $0 bot's core promise survive failure

[Lumina](https://github.com/KumarAnubhav64/Lumina) exists to deliver one thing: **the right nudge at the right minute**. An attendance prompt ten minutes after class ends. A gap nudge the moment a two-hour window opens. A risk alert at 8 AM. Everything else — the deterministic core, the exact attendance math, the vision pipeline — is in service of that promise.

So it was uncomfortable to discover, mid-audit, that the promise had a hole in it. Every send was **fire-and-forget**. The error handler printed the error and moved on:

```python
async def error_handler(update, context):
    print(f"ERROR in update {update}: {context.error}", flush=True)
```

There was **no retry anywhere**. A nudge that hit a 429, a network blip, or Telegram's API timing out during a cold start was *silently lost*. The 15-minute trigger loop might re-fire it later — but by then the class is over, the gap is gone. The product's core value is exactly what gets dropped.

## Why durability is hard on a $0 budget

The obvious fix — an in-process retry buffer — dies on Render's free tier: **the instance sleeps after ~15 idle minutes and cold-starts in ~30 seconds**. Any retry state held in Python memory is gone on sleep. Durability requires *external* state.

External state usually means money. But the constraint set was non-negotiable:

1. Total cost stays **$0** — every new service must have a free tier.
2. Everything degrades **gracefully** — no new failure mode is allowed.
3. **Tests never touch the network** — the suite stays hermetic.

The answer was **Upstash serverless Redis** — free tier (256 MB storage, 500K commands/month), and critically for a free Render instance: **REST over HTTPS, no open port needed**. A single-user bot does ~10–40 Redis ops/day. Even a bad day is under 1% of the free budget.

## The design: one connection, two layers

Both layers talk to the same Upstash client through a **tiny injected interface**, so tests use a dict-backed `FakeRedis`, local dev runs with no credentials, and production uses the real thing:

```python
class RedisLike:
    def get(self, key: str) -> str | None: ...
    def set(self, key: str, value: str, ex: int | None = None) -> None: ...
    def delete(self, key: str) -> None: ...
    def zadd(self, key: str, members: dict[str, float]) -> None: ...   # member -> score
    def zrangebyscore(self, key: str, min: float, max: float) -> list[str]: ...
    def zrem(self, key: str, *members: str) -> None: ...
```

Because the bot is async, the sync REST calls are wrapped in `asyncio.to_thread(...)` — a single HTTPS round-trip to Upstash's edge, cheap, and it never blocks the event loop.

### Layer A — the retry queue (the centerpiece)

The queue is a **Redis sorted set scored by next-due time** — a time-scheduled queue that needs no scheduler:

```
lumina:retry        → sorted set, score = next_due_unix
lumina:retry:dead   → list, envelopes that exhausted their attempts
```

Each member is a JSON envelope carrying everything needed to re-send, plus a **completion contract**:

```json
{
  "chat_id": 123456,
  "text": "...",
  "parse_mode": "HTML",
  "reply_markup": {"inline_keyboard": [...]},
  "attempts": 1,
  "next_due_unix": 1754550000.0,
  "completion": {"type": "attendance_prompt", "subject_code": "CS101", "day": "2026-08-08"}
}
```

**The classifier.** Not every failure deserves a retry. The wrapper classifies every `TelegramError` before enqueueing:

| Error | Verdict |
| --- | --- |
| `TimedOut`, `NetworkError`, `RetryAfter` (429) | ✅ retry — transient |
| 5xx, `Conflict` (webhook race) | ✅ retry |
| `Forbidden` (user blocked the bot) | ❌ **drop** — retrying is spam forever |
| `BadRequest` (malformed message) | ❌ **drop** — a bug, retrying won't fix it |

**Backoff.** `min(30s · 2^(attempts-1), 15m)` → 30 s, 60 s, 2 m, 4 m, capped at 15 m. A 429's `RetryAfter` overrides the schedule. After 4 attempts the envelope moves to the dead-letter list and logs loudly.

**The dedupe contract — the subtle part.** Lumina's nudges were already exactly-once via `mark_*_sent` dedupe rows. The queue had to *preserve* that, not break it:

```python
async def send_guarded(context, chat_id, *, text, reply_markup=None,
                       parse_mode=None, completion=None) -> None:
    try:
        await context.bot.send_message(chat_id, text, ...)
        await run_completion(completion)          # mark_*_sent etc.
    except TelegramError as exc:
        if is_retryable(exc):
            await enqueue(envelope(chat_id, text, ...))
        else:
            log_dropped(chat_id, exc)             # Forbidden/BadRequest
```

The `completion` runs **only on confirmed success** — never on enqueue — and the drainer runs the *same* completion after a successful re-send. Result: **no double-nudges, no lost marks**. The queue is a drop-in replacement for the send, not an extra fire. (At-least-once semantics under the hood are accepted: a rare duplicate nudge beats a lost one.)

**The drainer.** A 20-second repeating job pulls due envelopes (`score <= now`), and re-sends with a **zrem-before-send lease** so a slow drain can't double-process. On success: `zrem` + run completion. On retryable failure: re-add with the next backoff. On permanent failure: dead-letter + log.

### Layer B — the cache (validating a pre-designed seam)

The multi-user plan had designed a `cache.py` seam in advance — *"when we ever need shared state, Redis drops in behind the same interface."* This slice paid for that seam: a namespaced TTL cache with the **same interface, in-memory by default**:

| Data | TTL |
| --- | --- |
| Attendance risk report | 10 min |
| `/recommend` situation | 5 min |
| Today's plan | 1 min |
| Idea folder tree | 1 min |

One Render instance means an in-process cache is *correct* and costs zero Upstash commands — so the cache stays in memory, and only the durable queue touches Redis. That's the kind of decision that keeps a $0 system at $0.

## Production hardening (this is where the fun was)

Durability gets you "it eventually tries again." These make it *dependable*:

1. **Poison-pill guard** — each envelope is drained in its own try/except; a corrupt JSON member is removed and logged, never allowed to stall every nudge.
2. **Boot-time recovery** — right after webhook registration, sweep the queue for due items. A nudge queued 20 minutes ago while the instance slept fires *within seconds of waking*, not on the next 20-s tick.
3. **Circuit breaker** — after 5 consecutive send failures, pause 5 minutes. Per-message backoff protects one message; the breaker protects the API call budget when Telegram is having a bad minute.
4. **Dead-letter hygiene** — 7-day TTL on the dead list, 500-envelope cap on the live queue.
5. **`/healthz` tells the truth** — now reports `queue_depth`, `cache_backend`, `last_drain_unix`, so a single browser tab shows whether the fail-safe is actually armed.
6. **Redundant drain trigger** — the 20-s job is primary; calling the same `drain()` from the top of the webhook handler is a free backup, since webhook pushes are what keep the instance awake.

## Graceful degradation — the ground rule

If Redis is unconfigured, unreachable, or rate-limited: **log once, behave exactly like today**. The bot is never slower, never crashes, never blocks a send. A cache miss on Redis error means compute fresh — a cache is an optimization; correctness never depends on it. This is the free-tier discipline in its purest form: every new service must make the *failure* cheaper, not just the success path.

## What it cost

- One dependency: `upstash-redis` (sync client + `to_thread`).
- Two new files (`services/retry_queue.py`, `services/cache.py`) + a send wrapper.
- Two env vars in `render.yaml`.
- ~30 new offline tests against `FakeRedis` (classifier table, backoff math, enqueue→drain round-trip, max-attempts→dead-letter, poison-pill, circuit breaker, queue cap).

All 705 tests green, coverage gate still ≥80%, total running cost still **$0**.

## The lesson

The failure mode that scared me wasn't a crash — crashes are loud. It was the **quiet drop**: a nudge that was due at 09:55, failed at 09:55, and simply never happened, while the log line scrolled past unnoticed. Making the core promise durable wasn't about adding a retry loop; it was about recognizing that on a sleeping free instance, *in-memory state is not state*. The queue is the difference between "the bot tries its best" and "the bot keeps its promise."

For how the vision pipeline reads a timetable photo on the same free-tier budget, see [Reading a timetable photo with a $0 vision budget](lumina-photo-scan-pipeline). And for the deterministic core underneath all of it — 705 tests, the LLM never computes — see [Building a deterministic core: the LLM never computes, never writes](lumina-deterministic-core).
