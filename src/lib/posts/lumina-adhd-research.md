---
title: "What ADHD research actually says about the bot I built for it"
date: "2026-08-16"
excerpt: "Lumina's design — one-tap logging, nudge discipline, chunked goals, an idea inbox — isn't a vibe. Every feature maps to a mechanism with published evidence. And the honest part is what the evidence does NOT support."
tags: ["ADHD", "Research", "Product Design", "Telegram", "LLM Patterns"]
---

# What ADHD research actually says about the bot I built for it

[Lumina](https://github.com/KumarAnubhav64/Lumina) started with a question I couldn't answer from product instinct alone: **does a Telegram bot that negotiates your timetable actually help someone with ADHD, or does it just feel like it should?**

So I did what I do when I can't trust my instinct — I read the literature. What follows is the audit that resulted: each ADHD-facing feature mapped to its evidence, with verdicts. It's the most honest design document I've written, because the headline finding is inconvenient: **the mechanisms are evidence-backed, but the product as a whole has no clinical study — and it shouldn't pretend otherwise.**

## The one-sentence verdict first

Lumina is best understood as an **external scaffolding tool** — and the mechanisms it uses (externalized memory, self-monitoring, task decomposition, cue-triggered action, notification restraint) are the *same mechanisms* with real evidence in adult-ADHD behavioral treatment. What it is **not** is a treatment. No app in its category has blinded RCT evidence, and claiming otherwise would be dishonest (Sonuga-Barke et al., 2013; Păsărelu et al., 2020).

## The findings that actually shaped the design

**1. ADHD is an executive-function disorder, not a laziness problem.**
Barkley (1997) locates the core deficit in behavioral inhibition, which cascades into working memory, self-regulation, and "behavior by future consequences." The consequence for a tool: it must *compensate for* these systems, not motivate around them. You don't need a cheerleader; you need scaffolding.

**2. Working-memory deficits are large and robust.**
Martinussen et al. (2005) and Kasper et al. (2012) report spatial working-memory deficits with effect sizes of d ≈ 0.85–1.06 — enormous by social-science standards. The standard compensation is to **externalize information**: write it down, don't hold it in your head. This is the entire premise of the Brain (Lumina's idea inbox): capture now, organize later, at the moment of capture, when working memory is under load.

**3. Time perception is impaired.**
Noreika, Falter & Rubia (2013) document timing deficits spanning milliseconds to delay discounting. The consequence: **external clocks, "now" status, and countdowns are compensations, not conveniences.** Lumina's TIMEZONE wall clock, its `/status` "now" readout, and its exact "classes left before the 75% cliff" math all exist because time is the thing the disorder makes fuzzy.

**4. Future rewards are discounted more steeply.**
Jackson & MacKillop (2016): d = 0.43 — people with ADHD discount future rewards more steeply. "The class you can skip today" will always beat "the degree you want in 2028" unless the future consequence is made **immediate and concrete**. The attendance-cliff math does exactly this: it turns a distant risk ("keep up attendance") into a today-number ("you have exactly 3 free cuts left").

**5. If-then plans work.**
Gollwitzer (1999) and the Gollwitzer & Sheeran (2006) meta-analysis: implementation intentions ("when X, I do Y") improve goal pursuit with d = 0.65 across 94 tests. This is the mechanism behind gap nudges — the bot doesn't say "study more," it says "your next gap is 14:00–16:30, start now."

**6. Notifications cost attention.**
Ohly & Bastin (2023) ran a field experiment (N = 247) where disabling notifications *improved task performance*. Fewer, well-timed prompts beat a noisy bot. This is the empirical backbone of Lumina's nudge discipline: a daily proactive budget of 2, nothing after 21:00, a `/silent` mode, and dedupe keys so a nudge fires once.

## The feature-by-feature audit

| Feature | Mechanism | Evidence | Verdict |
|---|---|---|---|
| One-tap attendance logging | Self-monitoring, minimal friction | Core CBT-ADHD component (Knouse et al., 2017; Safren et al., 2005) | ✅ Supported mechanism |
| Attendance-cliff `/report` | Makes delayed consequence immediate | Steeper delay discounting (Jackson & MacKillop, 2016) | ✅ Supported direction |
| **Nudge discipline** (≤2/day, no 21:00+, `/silent`) | Notification restraint | Interruptions cost performance (Ohly & Bastin, 2023) | ✅ **Most evidence-aligned feature** |
| Gap nudges + "Start now" | Cue-triggered action | Implementation intentions d = 0.65 (Gollwitzer & Sheeran, 2006) | ✅ Supported, one caveat |
| Daily goals + negotiation (floors, scaling) | Realistic goal-setting, no shame spiral | Organizational skills in CBT-ADHD (Safren et al., 2005) | ✅ Supported mechanism |
| `/inspire` — 5-minute steps | Task chunking, tiny first step | Named CBT skill (Safren et al., 2005); Zeigarnik effect (1927) | ✅ Supported |
| Brain (`/idea`, folders, `/vault`) | Externalized working memory | WM deficits d ≈ 0.85–1.06 (Martinussen et al., 2005) | ✅ Supported compensation |
| `/recommend` | Choice architecture | Nudges d ≈ 0.43 (Mertens et al., 2022) | 🟡 Mixed; dependency risk |
| `/ask`, `/why` | Psychoeducation | Part of CBT packages, weak alone | 🟡 Supporting |
| TIMEZONE clock, countdowns | External time anchors | Timing deficits (Noreika et al., 2013) | ✅ Supported |

The pattern is unmistakable: the strongest features are the ones that **externalize, structure, and restrain** — and the weakest are the ones that rely on the user's own executive function (open-ended chat) or on intrinsic motivation (anything gamified).

## The caveats that keep me honest

Three findings should temper any claim that Lumina (or any app) "helps ADHD":

1. **The blinded-evidence problem (Sonuga-Barke et al., 2013).** When outcomes are rated by people close to the intervention (often unblinded), behavioral treatments look effective. When "best probably blinded" ratings are used, the effects **largely disappear**. Consequence: Lumina should claim to support *functioning and strategy use*, never to reduce core ADHD symptoms.
2. **Apps are unproven (Păsărelu, Andersson & Dobrean, 2020).** A systematic review of 109 commercial ADHD apps found *none* with published efficacy evidence — and near-zero overlap between app-store offerings and the research literature. Lumina is in good company, and equally unproven as a product claim.
3. **Digital interventions for ADHD specifically: weak evidence (Powell et al., 2018; Hollis et al., 2017).** Tech-based self-management shows "emerging potential," but the studies are small, unblinded, and short. The strongest digital-intervention evidence is for anxiety and depression — not ADHD.

What this means in practice: **the mechanisms are evidence-aligned because they are the components of proven adult-ADHD CBT; the product as a whole has no clinical study, and the honest framing is "a compensation scaffold that practices evidence-based skills," not "a fix for ADHD."**

## What the literature says is missing — the roadmap

The audit isn't just a scorecard; it's a prioritized backlog. In order:

1. **Self-generated implementation intentions.** When the bot nudges a gap, it should first ask the user to state their own if-then ("when I get back from class, I will…"). Self-formulated plans are the strong effect; bot-supplied prompts are the weaker cousin. This is the single biggest evidence-based upgrade available.
2. **Distractibility management.** "Got distracted / back on track" is a named CBT-ADHD module (Safren et al., 2005) and completely absent from Lumina.
3. **Immediate visible progress.** Delay-discounting research says wins must be immediate and visible (Jackson & MacKillop, 2016). The ✅ Done buttons and `/docs` export do this; a small "win log" would do it more.
4. **Autonomy guardrails on `/recommend`.** Frame suggestions as options, never as commands. Lumina already "never acts" on the user's behalf — that is exactly right, keep it.
5. **Honest framing in the product.** A one-line "I'm a scaffolding tool, not a treatment — talk to a professional." Per the blinded-evidence and app-evidence findings, this isn't a liability; it's the only defensible position.

## The bottom line

**Does Lumina help an ADHD person?** Based on the literature:

- **Yes, in mechanism.** Everything it does translates components that have real evidence in adult-ADHD CBT: externalize memory, self-monitor with one tap, chunk tasks into startable steps, link action to cues, and *restrain the notifications*.
- **No, in treatment-claim.** No blinded trial supports any app in this category. The honest framing is a compensation scaffold that practices evidence-based skills.
- **The riskiest feature to add is the most popular one: gamification.** Evidence is weakest there, and shame spirals are real. Lumina's negotiation-first, streak-free design is the right instinct — keep it.

The design consequence that surprised me most: **the most ADHD-aligned feature in the whole product is the one that looks least like a product feature — saying "no."** A daily budget of two nudges, silence after 9 PM, dedupe keys, and a `/silent` mode. The research doesn't say "help more," it says "interrupt less." That single inversion — restraint as the core feature — is the whole product.

For the engineering side of how Lumina actually executes — 705 tests, deterministic core, $0 deployment — see [the post on building it without an LLM making decisions](lumina-deterministic-core). And for the full reference list behind this audit, the [project docs](https://github.com/KumarAnubhav64/Lumina) carry the complete verified bibliography.
