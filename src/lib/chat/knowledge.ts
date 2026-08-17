/**
 * Knowledge base for the "Ask me anything" chat.
 *
 * Everything here is compiled from the resume (static/resume.pdf), the
 * portfolio site data (components, PROJECTS_DATA.md) and social links.
 * It is injected into the system prompt so the LLM answers grounded in
 * this data instead of guessing.
 */
export const knowledgeBase = `
# Profile — Kumar Anubhav

## Identity & Contact
- Name: Kumar Anubhav
- Phone: +91-8400607807
- Email: kumaranubhav20026@gmail.com
- College email: kumar.2023ug1026@iiitranchi.ac.in
- LinkedIn: https://www.linkedin.com/in/kumar-anubhav-45b1aa29a/
- GitHub: https://github.com/KumarAnubhav64
- GitLab: https://gitlab.com/kumaranubhav20026
- Resume (PDF): /resume.pdf
- Title: Full Stack Developer · Python · Go · TypeScript

## Education
- Indian Institute of Information Technology (IIIT), Ranchi — B.Tech in Computer Science and Engineering, 2023–2027
- CGPA: 8.51

## Experience
### Full Stack Development Intern — DAaranya.ai (Early-Stage Startup), Remote, Jul 2025 – Jun 2026
- Developed responsive frontend applications with React.js, Next.js, TypeScript, and TailwindCSS, serving 1,000+ monthly active users
- Connected Stripe and Razorpay payment gateways, enabling 10+ paid subscriptions for the IntelliCoach product
- Created reliable Stripe webhook handlers that prevent duplicate charges during network retries
- Implemented JWT authentication to replace session-based login, enabling stateless scaling and secure protected routes
- Launched a multi-tenant serverless backend on Google Cloud Platform using Cloud Run, Cloud SQL, and Firestore, reducing publisher onboarding time
- Worked across the Humpback monorepo: three products (AI Ascent, IntelliCoach, IntelliBiz), five frontends, three FastAPI backends, and async workers
- Production integrations incl. Firebase Auth/Firestore, Google Cloud AI / Storage / Text-to-Speech, LangChain + LangGraph, pgvector, Redis, Stripe, RDKit

## Projects
### OnionCall — Anonymous P2P Voice Over Tor 🧅 (Security / Systems, released)
Peer-to-peer, end-to-end encrypted push-to-talk voice and text chat that routes every call through Tor hidden services — no servers, no accounts, no phone numbers. Your .onion address is your identity.
- Rewrote a Bash prototype into a single self-contained Go binary (REST API + Svelte 5 web UI + native Linux desktop app)
- AES-256-CBC encryption with PBKDF2-derived keys, HMAC-SHA256 signing, and replay protection
- Opus-codec push-to-talk (48 kHz / 32 kbps) with mic gain, high-pass filtering, and PTT chime
- Group calls over a zero-knowledge relay bridge + Snowflake bridges for censorship circumvention
- Automated CI/CD publishing Linux & Windows builds, installers, and desktop bundles to GitLab Releases
- Stack: Go · Tor · Opus · Svelte 5 · Next.js 16 · Tailwind v4 · shadcn/ui
- Links: https://gitlab.com/kumaranubhav20026/terminalphone · https://github.com/KumarAnubhav64/OnionCall

### Lumina — The Agentic Academic OS 🎓 (AI / Product, deployed)
A Telegram bot that watches your college timetable and negotiates your free time — 1-tap attendance logging, exact "classes left before the 75% cliff" math, daily goals scheduled into your free gaps, and nudges before it's too late.
- Deterministic core for every number, LLM only for phrasing — the bot never guesses a metric or decides for you
- 11 umbrella commands (/today, /goal, /timetable, /academic, /idea…) plus the Brain ADHD idea inbox (Obsidian-style folders & tags, /vault export, /recommend agentic command picker)
- /scan — timetable-from-photo vision pipeline; /ask — conversational Q&A with memory; exam countdowns, weekly digest, CSV export
- Fail-safe messaging: durable send-retry queue on serverless Redis — no nudge lost to a rate-limit or cold start
- 705 tests · 86% coverage · deployed for $0/month on Render free tier + Neon Postgres
- Stack: Python 3.11 · FastAPI · SQLAlchemy + Alembic · Neon Postgres · python-telegram-bot · LangChain + Groq · Upstash Redis
- Link: https://github.com/KumarAnubhav64/Lumina

### StegoVault — Secrets Hidden in Plain Sight 🔐 (Security)
A secure password vault that hides your secrets inside images using LSB steganography + AES-256 encryption — with AI-generated cover images so every vault looks unique and is harder to trace.
- LSB steganography embedding encrypted data into the least-significant bits of an image
- AES-256 encryption — extracted data stays unreadable without the key
- AI-generated stego-carriers reduce predictability and watermark detection; output images look completely natural
- Lightweight CLI tool; Electron.js GUI in the works
- Stack: Python CLI · Rust component · Shell scripts
- Link: https://github.com/KumarAnubhav64/StegoVault

### PulseRAG — Audio In, Grounded Answers Out 🔊 (AI / RAG, done)
Upload or record a conversation, and PulseRAG transcribes it, labels who said what, indexes the transcript in FAISS, and answers questions with grounded RAG — every answer citing the exact transcript chunks it's based on.
- Speech-to-text via Groq Whisper (whisper-large-v3-turbo) with timestamped segments
- Speaker labeling with zero dependencies — one LLM call labels [Agent] / [Customer] turns; single-narrator audio stays unlabeled, nothing is ever fabricated
- Grounded RAG with source chunks + relevance scores; optional Redis answer cache
- Async uploads (stream-to-disk + background jobs keep memory out of the request path)
- Boots in ~80MB RAM — no langchain, no GPU — runs on Render's free 512MB tier; demo mode works with zero API keys
- 72 passing tests, web UI with mic recording and light/dark themes
- Stack: Python 3.12 · FastAPI · FAISS · Groq (Whisper + LLM) · sentence-transformers / Mistral embeddings · Redis · Docker
- Link: https://github.com/KumarAnubhav64/PulseRAG

### Peekaboo — Face-Recognition Photo Library 🫣 (Fun · AI / Full stack, deployed)
Upload a photo, every person in it gets a private link, and after a selfie challenge each person sees every photo containing them — a Google-Photos-style library that costs $0 to run.
- Production-grade face pipeline — SCRFD detection + ArcFace 512-d embeddings, clustered into people, stored in pgvector with an HNSW index
- The classification challenge — a 128-bit claim token per face, selfie verification by cosine similarity (≥0.42), then a KNN search that shows only your photos
- Auto-enrichment on every upload — COCO object tags (SSD MobileNet ONNX), Places365 scenes, and EXIF GPS clustering into places
- Multi-tenant like Google Photos — email/password + Google SSO, JWT in httpOnly cookies, every query tenant-scoped
- Actually $0 forever — open-source on-device models (no API fees), Neon Postgres + Neon S3, HF Spaces + Vercel free tiers, plus a one-command Docker self-host suite
- Stack: FastAPI · React + TypeScript · Tailwind v4 + shadcn/ui · InsightFace · ONNX · pgvector · Neon · Docker Compose
- Link: https://github.com/KumarAnubhav64/peekaboo

### Humpback — Daaranya.ai's Monorepo: Three Products 🐋 (Internship · Full stack, shipped)
The Daaranya.ai monorepo housing three products — AI Ascent, IntelliCoach, and IntelliBiz.
1. AI Ascent — AI-powered learning platform: course catalog & curriculum, gamification (points/badges), content admin, and interactive labs (MediaPipe vision labs + Monaco editor). Backend: ai_ascent_backend. Frontend: frontend/ai-ascent.
2. IntelliCoach — AI coaching/test-prep platform: OMR answer-sheet checking, PDF-based question generation, tests & evaluation, class management, teacher analytics, question bank, blog, subscriptions. Backend: intelli_coach_backend (20+ route modules). Frontends: student-frontend + admin-frontend.
3. IntelliBiz — AI chatbot agent for enterprises: a LangGraph state-graph agent (Gemini + tool calling) with Search + TopicAlert tools, org-scoped RAG, conversation-summary memory. Backend: intellibiz_backend/modules/chatbot + intellibiz-frontend (landing).
- Also in the repo: main-frontend (the daanyaa marketing site), provisioning & test-generation workers, and shared_lib (pdf generator, repository layer, utils)
- Stack: FastAPI · React 19 · Vite · Firebase · GCP · LangGraph · pgvector · Stripe · RDKit
- Link: https://github.com/HumpBack-2025/Humpback

### Maples — "Aweelo" Senior Care Discovery 🏥 (Internship · Full stack, in progress)
A platform for finding senior care that inspires awe — connecting families with verified facilities through owner registration, facility claiming, and radius-based search.
- Complete Prisma schema (User, Organization, OrgMembership, Facility…) on Neon Postgres with PostGIS + pg_trgm for geo search
- Auth & multi-tenancy: custom JWT (15-min access / 7-day refresh via jose), bcryptjs hashing, 8 API endpoints, proxy-based route protection, tenant data isolation
- Resend-powered email verification + Apple-like frontend (login, register, verification pages) with full owner registration incl. HHSC license numbers
- Documentation-driven: SRS, traceability matrix, migration & handover guides
- Stack: Next.js 14 · TypeScript · Prisma · Neon Postgres · PostGIS · Tailwind + shadcn/ui · Resend
- Link: https://github.com/HumpBack-2025/Maples

### Pine — Healthcare Task Automation & Notifications 🩺 (Internship · Full stack, near-prod)
A healthcare operations platform for task-automation workflows and bulk SMS/email notification campaigns, hardened through a production-readiness audit.
- FastAPI backend: auth, campaign management, async email & SMS job workers, GCS + Pub/Sub integrations, header mapping, templates, org management
- React 19 + Vite 7 frontend: protected routing, task workflows, bulk notification + notification-wizard flows, shared error-monitoring layer
- Production hardening: app-level error boundaries, lint/build clean, Cypress component + E2E coverage, structured audit doc (PRODUCTION_READINESS_AUDIT.md)
- Stack: FastAPI · SQLAlchemy · GCS · Pub/Sub · React 19 · Vite 7 · React Router 7 · Cypress
- Link: https://github.com/HumpBack-2025/Pine

## Technical Skills
- Languages: JavaScript, TypeScript, Python, SQL, C, C++, Go, Bash
- Frontend: React.js, Next.js, Svelte, TailwindCSS, HTML, CSS, Responsive Design
- Backend & APIs: FastAPI, Django, Flask, Express.js, RESTful APIs, Webhooks
- AI and ML: LangChain, LangGraph, FAISS, Sentence Transformers, ONNX, Groq APIs, Gemini
- Cloud and DevOps: Google Cloud Platform (Cloud Run, Pub/Sub, Cloud SQL), Serverless Architecture, Render, Linux, Git, Docker, Firebase, Firestore
- Databases: PostgreSQL, MongoDB, Firestore, Cloud SQL, Redis, Neon DB (pgvector)
- Payments and APIs: Stripe API, Razorpay API, REST APIs, Webhooks
- Relevant Coursework: Data Structure and Algorithm, Database Management System, Networking, OOPS, Computer Architecture

## Achievements and Leadership
- Organizing team member for Quasar 2024 Hackathon and Competitive Programming Contest at IIIT Ranchi
- Lead, IoT and Robotics Club, IIIT Ranchi

## Hobbies
- Learning Japanese — kanji drills, immersion listening, slowly levelling up toward JLPT fluency
- Loves Music — J-pop, K-pop, ghazals, Bollywood, English — everything, depending on the mood
- Robotics — building bots as head of the IoT & Robotics Club — sensors, motors, and motion
- Repairing Broken Things — soldering, reviving dead boards, and fixing what everyone else gave up on

## How I Work
1. Understand the problem — start by understanding the domain, the users, and the constraints
2. Design the architecture — clean APIs, type-safe contracts, and scalable infrastructure
3. Build & test — iterative development focused on reliability: idempotent operations, concurrency safety, comprehensive testing from day one
4. Deploy & iterate — shipping to production with confidence using CI/CD, monitoring, and gradual rollouts

## About / Fun Facts
- Pursuing B.Tech in Computer Science at IIIT Ranchi (2023–2027)
- Full Stack Development Intern at DAaranya.ai building AI-powered platforms
- Lead the IoT & Robotics Club at IIIT Ranchi
- Shipped encrypted personal projects, including a peer-to-peer voice app and a steganography vault
- Obsessed with clean architecture, reliable systems, and great developer experiences
- Approach rooted in first principles: type safety, clean APIs, systems that fail gracefully
- Quote: "Good code is not just what the machine reads. Good code is what another human can understand."
`;

export const systemPrompt = `You are the assistant for Kumar Anubhav's portfolio website. You answer questions about Kumar Anubhav — his background, skills, projects, education, experience, hobbies, and contact details — using ONLY the knowledge base provided below. Be warm, concise, and helpful. Answer in plain, well-structured text (short paragraphs or short bullet lists are fine). If the question is not about Kumar or cannot be answered from the knowledge base, say so honestly instead of guessing. Where relevant, point people to his GitHub (https://github.com/KumarAnubhav64), GitLab (https://gitlab.com/kumaranubhav20026), LinkedIn (https://www.linkedin.com/in/kumar-anubhav-45b1aa29a/), email (kumaranubhav20026@gmail.com), or resume (/resume.pdf). Refer to him by name. Keep answers reasonably short (under ~180 words unless the question genuinely needs more).

KNOWLEDGE BASE:
${knowledgeBase}`;
