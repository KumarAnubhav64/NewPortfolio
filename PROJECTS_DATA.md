# Portfolio Projects — Curated Writeups

> Final data for the portfolio (SoleAI excluded). Each project is articulated as a short, impact-first blurb — the kind that maps straight onto the website's project cards/sections.

---

## Personal Projects

### 1. OnionCall — Anonymous P2P Voice Over Tor 🧅

**One-liner:** Peer-to-peer, end-to-end encrypted push-to-talk voice and text chat that routes every call through Tor hidden services — no servers, no accounts, no phone numbers. Your `.onion` address is your identity.

**What I built:**
- Rewrote a Bash prototype into a single self-contained **Go binary** (REST API + Svelte 5 web UI + native Linux desktop app)
- **AES-256-CBC** encryption with PBKDF2-derived keys, HMAC-SHA256 signing, and replay protection
- **Opus-codec push-to-talk** (48 kHz / 32 kbps) with mic gain, high-pass filtering, and PTT chime
- Group calls over a zero-knowledge relay bridge + **Snowflake bridges** for censorship circumvention
- Automated CI/CD publishing Linux & Windows builds, installers, and desktop bundles to GitLab Releases

**Stack:** Go · Tor · Opus · Svelte 5 · Next.js 16 (landing page) · Tailwind v4 · shadcn/ui

**Links:** [Code on GitLab](https://gitlab.com/kumaranubhav20026/terminalphone) · [Landing page repo](https://github.com/KumarAnubhav64/OnionCall)

---

### 2. Lumina — The Agentic Academic OS 🎓

**One-liner:** A Telegram bot that watches your college timetable and negotiates your free time — 1-tap attendance logging, exact "classes left before the 75% cliff" math, daily goals scheduled into your free gaps, and nudges before it's too late.

**What I built:**
- **Deterministic core for every number, LLM only for phrasing** — the bot never guesses a metric or decides for you
- 11 umbrella commands (`/today`, `/goal`, `/timetable`, `/academic`, `/idea`…) plus the **Brain** ADHD idea inbox (Obsidian-style folders & tags, `/vault` export, `/recommend` agentic command picker)
- `/scan` — timetable-from-photo vision pipeline; `/ask` — conversational Q&A with memory; exam countdowns, weekly digest, CSV export
- Fail-safe messaging: durable send-retry queue on serverless Redis — no nudge lost to a rate-limit or cold start
- **705 tests · 86% coverage · deployed for $0/month** on Render free tier + Neon Postgres

**Stack:** Python 3.11 · FastAPI · SQLAlchemy + Alembic · Neon Postgres · python-telegram-bot · LangChain + Groq · Upstash Redis

**Link:** [github.com/KumarAnubhav64/Lumina](https://github.com/KumarAnubhav64/Lumina)

---

### 3. StegoVault — Secrets Hidden in Plain Sight 🔐

**One-liner:** A secure password vault that hides your secrets inside images using LSB steganography + AES-256 encryption — with AI-generated cover images so every vault looks unique and is harder to trace.

**What I built:**
- **LSB steganography** embedding encrypted data into the least-significant bits of an image
- **AES-256 encryption** — extracted data stays unreadable without the key
- **AI-generated stego-carriers** reduce predictability and watermark detection; output images look completely natural
- Lightweight CLI tool; Electron.js GUI in the works

**Stack:** Python CLI · Rust component · Shell scripts

**Link:** [github.com/KumarAnubhav64/StegoVault](https://github.com/KumarAnubhav64/StegoVault)

---

### 4. PulseRAG — Audio In, Grounded Answers Out 🔊

**One-liner:** Upload or record a conversation, and PulseRAG transcribes it, labels who said what, indexes the transcript in FAISS, and answers questions with grounded RAG — every answer citing the exact transcript chunks it's based on.

**What I built:**
- Speech-to-text via **Groq Whisper** (`whisper-large-v3-turbo`) with timestamped segments
- **Speaker labeling with zero dependencies** — one LLM call labels `[Agent]` / `[Customer]` turns; single-narrator audio stays unlabeled, nothing is ever fabricated
- Grounded RAG with source chunks + relevance scores; optional Redis answer cache
- Async uploads (stream-to-disk + background jobs keep memory out of the request path)
- **Boots in ~80MB RAM** — no langchain, no GPU — runs on Render's free 512MB tier; demo mode works with zero API keys
- **72 passing tests**, web UI with mic recording and light/dark themes

**Stack:** Python 3.12 · FastAPI · FAISS · Groq (Whisper + LLM) · sentence-transformers / Mistral embeddings · Redis · Docker

**Link:** [github.com/KumarAnubhav64/PulseRAG](https://github.com/KumarAnubhav64/PulseRAG)

---

### 5. Peekaboo — Face-Recognition Photo Library 🫣

**One-liner:** Upload a photo, every person in it gets a private link, and after a selfie challenge each person sees every photo containing them — a Google-Photos-style library that costs $0 to run.

**What I built:**
- **Production-grade face pipeline** — SCRFD detection + ArcFace 512-d embeddings, clustered into people, stored in `pgvector` with an HNSW index
- **The classification challenge** — a 128-bit claim token per face, selfie verification by cosine similarity (≥0.42), then a KNN search that shows only your photos
- **Auto-enrichment on every upload** — COCO object tags (SSD MobileNet ONNX), Places365 scenes, and EXIF GPS clustering into places
- **Multi-tenant like Google Photos** — email/password + Google SSO, JWT in httpOnly cookies, every query tenant-scoped
- **Actually $0 forever** — open-source on-device models (no API fees), Neon Postgres + Neon S3, HF Spaces + Vercel free tiers, plus a **one-command Docker self-host suite** for your own NAS or external hard drive

**Stack:** FastAPI · React + TypeScript · Tailwind v4 + shadcn/ui · InsightFace · ONNX · pgvector · Neon · Docker Compose

**Link:** [github.com/KumarAnubhav64/peekaboo](https://github.com/KumarAnubhav64/peekaboo)

---

## Internship — Daaranya.ai (GitHub org: `HumpBack-2025`)

> **Daaranya.ai** — AI-native edtech + enterprise AI platform ("The AI engine powering modern enterprises"). I built across its core product suite as a full-stack intern.

### 6. Humpback — Daaranya.ai's Monorepo: Three Products 🐋

**One-liner:** The Daaranya.ai monorepo housing **three products** — AI Ascent, IntelliCoach, and IntelliBiz — which I helped ship across frontends, FastAPI backends, and async workers.

**The three products:**
1. **AI Ascent** — AI-powered learning platform: course catalog & curriculum, gamification (points/badges), content admin, and **interactive labs** (MediaPipe vision labs + Monaco editor). Backend: `ai_ascent_backend` (courses, enrollment, gamification, auth, Alembic migrations). Frontend: `frontend/ai-ascent`.
2. **IntelliCoach** — AI coaching/test-prep platform: **OMR answer-sheet checking**, **PDF-based question generation**, tests & evaluation, class management, teacher analytics, question bank, blog, subscriptions. Backend: `intelli_coach_backend` (20+ route modules). Frontends: `student-frontend` (test interface, results, review) + `admin-frontend` (blog editor, plans, invites).
3. **IntelliBiz** — AI chatbot agent for enterprises: a **LangGraph state-graph agent** (Gemini + tool calling) with Search + TopicAlert tools, org-scoped RAG, conversation-summary memory. Backend: `intellibiz_backend/modules/chatbot` + `intellibiz-frontend` (landing).

**Also in the repo:** `main-frontend` (the `daanyaa` marketing site with product pages for all three), provisioning & test-generation **workers**, and `shared_lib` (pdf generator, repository layer, utils).

**What I built (intern role):** shipped across all three products — frontends, FastAPI backends, async workers; production integrations incl. **Firebase Auth/Firestore, Google Cloud AI / Storage / Text-to-Speech, LangChain + LangGraph, pgvector, Redis, Stripe, RDKit**.

**Stack:** FastAPI · React 19 · Vite · Firebase · GCP · LangGraph · pgvector · Stripe · RDKit

**Link:** [github.com/HumpBack-2025/Humpback](https://github.com/HumpBack-2025/Humpback)

---

### 7. Maples — "Aweelo" Senior Care Discovery 🏥

**One-liner:** A platform for finding senior care that inspires awe — connecting families with verified facilities through owner registration, facility claiming, and radius-based search.

**What I built:**
- Complete **Prisma schema** (User, Organization, OrgMembership, Facility…) on **Neon Postgres with PostGIS + pg_trgm** for geo search
- **Auth & multi-tenancy**: custom JWT (15-min access / 7-day refresh via `jose`), bcryptjs hashing, 8 API endpoints, proxy-based route protection, tenant data isolation
- Resend-powered email verification + Apple-like frontend (login, register, verification pages) with full owner registration incl. HHSC license numbers
- Documentation-driven: SRS, traceability matrix, migration & handover guides

**Stack:** Next.js 14 · TypeScript · Prisma · Neon Postgres · PostGIS · Tailwind + shadcn/ui · Resend

**Link:** [github.com/HumpBack-2025/Maples](https://github.com/HumpBack-2025/Maples)

---

### 8. Pine — Healthcare Task Automation & Notifications 🩺

**One-liner:** A healthcare operations platform for task-automation workflows and bulk SMS/email notification campaigns, hardened through a production-readiness audit.

**What I built:**
- **FastAPI backend**: auth, campaign management, async **email & SMS job workers**, GCS + Pub/Sub integrations, header mapping, templates, org management
- **React 19 + Vite 7 frontend**: protected routing, task workflows, bulk notification + notification-wizard flows, shared error-monitoring layer
- **Production hardening**: app-level error boundaries, lint/build clean, Cypress component + E2E coverage, structured audit doc (PRODUCTION_READINESS_AUDIT.md)

**Stack:** FastAPI · SQLAlchemy · GCS · Pub/Sub · React 19 · Vite 7 · React Router 7 · Cypress

**Link:** [github.com/HumpBack-2025/Pine](https://github.com/HumpBack-2025/Pine)

---

## Quick Reference

| # | Project | Category | Status | One-liner | Link |
|---|---|---|---|---|---|
| 1 | OnionCall | Security / Systems | ✅ Released | Anonymous P2P voice & text over Tor hidden services | GitLab + GitHub |
| 2 | Lumina | AI / Product | ✅ Deployed | Telegram bot that negotiates your timetable & free time | GitHub |
| 3 | StegoVault | Security | ✅ Done | Password vault hidden inside images (stego + AES) | GitHub |
| 4 | PulseRAG | AI / RAG | ✅ Done | Audio → grounded, cited answers (Whisper + FAISS) | GitHub |
| 5 | Peekaboo | Fun · AI / Full stack | ✅ Deployed | Face-recognition photo library that costs $0 (selfie challenge, places, things) | GitHub |
| 6 | Humpback | Internship · Full stack | ✅ Shipped | Daaranya.ai monorepo: 3 products (AI Ascent, IntelliCoach, IntelliBiz) | GitHub org |
| 7 | Maples | Internship · Full stack | 🚧 In progress | Senior-care discovery platform (Next.js + PostGIS) | GitHub org |
| 8 | Pine | Internship · Full stack | ✅ Near-prod | Healthcare task automation & bulk notifications | GitHub org |
