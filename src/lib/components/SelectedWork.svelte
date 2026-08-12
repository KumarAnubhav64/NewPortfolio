<script lang="ts">
	import { tick } from 'svelte';
	import SectionHeadline from './SectionHeadline.svelte';
	import ProjectCard from './ProjectCard.svelte';
	import ProjectModal from './ProjectModal.svelte';
	import ScrollReveal from './ScrollReveal.svelte';
	import Eyebrow from './Eyebrow.svelte';

	import onioncallImg from '$lib/assets/project-onioncall.svg';
	import luminaImg from '$lib/assets/project-lumina.svg';
	import stegovaultImg from '$lib/assets/project-stegovault.svg';
	import pulseragImg from '$lib/assets/project-pulserag.svg';
	import peekabooImg from '$lib/assets/project-peekaboo.svg';
	import aiAscentImg from '$lib/assets/project-ai-ascent.svg';
	import intelliCoachImg from '$lib/assets/project-intellicoach.svg';
	import intelliBizImg from '$lib/assets/project-intellibiz.svg';
	import maplesImg from '$lib/assets/project-maples.svg';
	import pineImg from '$lib/assets/project-pine.svg';

	const personalProjects = [
		{
			number: '№ 001',
			title: 'OnionCall',
			description:
				'Peer-to-peer, end-to-end encrypted push-to-talk voice and text chat that routes every call through Tor hidden services — no servers, no accounts, no phone numbers.',
			tag: 'Security · Go',
			imageUrl: onioncallImg,
			whatIDid: [
				'Rewrote a Bash prototype into a single self-contained Go binary with a REST API, Svelte 5 web UI, and native Linux desktop app',
				'Built end-to-end encryption: AES-256-CBC with PBKDF2-derived keys, HMAC-SHA256 signing, and replay protection',
				'Implemented Opus-codec push-to-talk voice with mic gain, high-pass filtering, and PTT chime',
				'Added group calls over a zero-knowledge relay bridge and Snowflake bridges for censorship circumvention',
				'Set up automated CI/CD publishing Linux & Windows binaries, installers, and desktop bundles to GitLab Releases'
			],
			stack: 'Go · Tor · Opus · Svelte 5 · Next.js 16',
			links: [
				{ label: 'Code on GitLab', href: 'https://gitlab.com/kumaranubhav20026/terminalphone' },
				{ label: 'Landing page on GitHub', href: 'https://github.com/KumarAnubhav64/OnionCall' }
			]
		},
		{
			number: '№ 002',
			title: 'Lumina',
			description:
				'A Telegram bot that watches your timetable and negotiates your free time — attendance cliffs, scheduled goals, and nudges before it\u2019s too late.',
			tag: 'AI · Product',
			imageUrl: luminaImg,
			whatIDid: [
				'Built a deterministic core for every number (attendance risk, gap detection, scheduling) so the LLM only phrases results — it never guesses a metric or decides for you',
				'Designed an 11-command surface including the Brain idea inbox, /vault Obsidian export, and /recommend agentic command picker',
				'Shipped /scan timetable-from-photo vision pipeline and /ask conversational Q&A with memory',
				'Made it resilient with a durable send-retry queue on serverless Redis — no nudge is ever lost to a rate-limit or cold start',
				'Wrote 705 tests with 86% coverage and deployed it for $0/month on free tiers'
			],
			stack: 'Python · FastAPI · Telegram · LangChain + Groq · Neon Postgres · Upstash Redis',
			links: [{ label: 'View on GitHub', href: 'https://github.com/KumarAnubhav64/Lumina' }]
		},
		{
			number: '№ 003',
			title: 'StegoVault',
			description:
				'A password vault that hides secrets inside images — LSB steganography + AES-256 with AI-generated cover images that look completely natural.',
			tag: 'Security · CLI',
			imageUrl: stegovaultImg,
			whatIDid: [
				'Implemented LSB steganography to hide encrypted vault data inside image pixels',
				'Secured everything with AES-256 so extracted data stays unreadable without the key',
				'Added AI-generated cover images so every vault is unique and harder to trace',
				'Kept output images natural-looking so they can be stored or shared without raising suspicion'
			],
			stack: 'Python · Rust · AES-256 · Steganography',
			links: [{ label: 'View on GitHub', href: 'https://github.com/KumarAnubhav64/StegoVault' }]
		},
		{
			number: '№ 004',
			title: 'PulseRAG',
			description:
				'Audio in, grounded answers out — transcribes conversations, labels who said what, and answers questions citing the exact transcript chunks they came from.',
			tag: 'AI · RAG',
			imageUrl: pulseragImg,
			whatIDid: [
				'Built speech-to-text with Groq Whisper producing timestamped transcript segments',
				'Created zero-dependency speaker labeling — one LLM call tags each turn, and single-narrator audio stays unlabeled (nothing fabricated)',
				'Implemented grounded RAG with FAISS retrieval, source-chunk citations, and relevance scores',
				'Kept boot RAM at ~80MB so it runs on Render\u2019s free 512MB tier; demo mode works with zero API keys',
				'Wrote 72 passing tests and a web UI with mic recording and light/dark themes'
			],
			stack: 'Python · FastAPI · FAISS · Groq Whisper · Redis · Docker',
			links: [{ label: 'View on GitHub', href: 'https://github.com/KumarAnubhav64/PulseRAG' }]
		},
		{
			number: '№ 005',
			title: 'Peekaboo',
			description:
				'A face-recognition photo library that runs for $0 — upload a photo, every person gets a private link, and after a selfie challenge each person sees every photo containing them.',
			tag: 'Fun · AI · Full Stack',
			imageUrl: peekabooImg,
			whatIDid: [
				'Built a production-grade face pipeline: SCRFD detection + ArcFace 512-d embeddings, clustered into people, stored in pgvector with an HNSW index',
				'Added the selfie challenge — a 128-bit claim token per face, cosine-similarity verification, then a KNN search that shows only your photos',
				'Enriched every upload with COCO object tags (SSD MobileNet) and Places365 scenes, plus EXIF GPS clustering into places',
				'Made it multi-tenant like Google Photos with email/password + Google SSO auth and tenant-scoped libraries',
				'Kept it at literally $0: open-source on-device models, Neon Postgres + S3, and a one-command Docker self-host suite for your own NAS or external drive'
			],
			stack: 'FastAPI · React + TypeScript · InsightFace · ONNX · pgvector · Neon · Docker',
			links: [{ label: 'View on GitHub', href: 'https://github.com/KumarAnubhav64/peekaboo' }]
		}
	];

	const internshipProjects = [
		{
			number: '№ 006',
			title: 'AI Ascent',
			description:
				'Daaranya.ai\u2019s AI learning platform — course catalog with gamification, interactive vision labs (MediaPipe), and an in-browser code editor, built on React 19 + FastAPI.',
			tag: 'Internship · Full Stack',
			imageUrl: aiAscentImg,
			whatIDid: [
				'Shipped the learning platform frontend (React 19 + Vite): course catalog, curriculum, lessons, and admin flows',
				'Built the FastAPI backend with course, enrollment, gamification, and content-admin APIs plus Alembic migrations',
				'Integrated MediaPipe vision labs and an in-browser code editor (Monaco) into lessons',
				'Worked across the shared repo with provisioning and test-generation workers'
			],
			stack: 'React 19 · FastAPI · MediaPipe · Monaco · Alembic',
			links: []
		},
		{
			number: '№ 007',
			title: 'IntelliCoach',
			description:
				'An AI coaching platform with OMR answer-sheet checking, PDF-based question generation, tests & evaluation, class management, and teacher analytics.',
			tag: 'Internship · Full Stack',
			imageUrl: intelliCoachImg,
			whatIDid: [
				'Built the OMR answer-sheet checking pipeline and PDF-based question generation',
				'Shipped the student test-taking flow (interface, results, review) and an admin app for blogs, plans, and invitations',
				'Worked across 20+ backend route modules: classes, evaluations, question bank, subscriptions, and teacher analytics',
				'Integrated Google Calendar and email flows for contact & invitations'
			],
			stack: 'FastAPI · React 19 · OMR · PDF · Firebase · Google Cloud',
			links: []
		},
		{
			number: '№ 008',
			title: 'IntelliBiz',
			description:
				'An enterprise AI chatbot agent on LangGraph — Gemini with tool calling, org-scoped RAG search, topic alerts, and conversation-summary memory.',
			tag: 'Internship · Full Stack',
			imageUrl: intelliBizImg,
			whatIDid: [
				'Built a LangGraph state-graph agent on Gemini with Search and TopicAlert tools',
				'Implemented org-scoped RAG retrieval with conversation-summary memory for efficient context',
				'Added follow-up suggestion generation and structured agent state',
				'Shipped the product landing frontend'
			],
			stack: 'LangGraph · Gemini · FastAPI · RAG · React',
			links: []
		},
		{
			number: '№ 009',
			title: 'Maples',
			description:
				'Aweelo — a senior-care discovery platform with PostGIS radius search, multi-tenant auth, and verified facility onboarding for families.',
			tag: 'Internship · Full Stack',
			imageUrl: maplesImg,
			whatIDid: [
				'Designed the complete Prisma schema (User, Organization, OrgMembership, Facility…) on Neon Postgres with PostGIS geo search',
				'Built auth & multi-tenancy: custom JWT, bcryptjs hashing, 8 API endpoints, proxy-based route protection, and tenant data isolation',
				'Integrated Resend email verification and built the Apple-style auth frontend with owner registration',
				'Documented the build with an SRS, traceability matrix, and migration guide'
			],
			stack: 'Next.js 14 · Prisma · Neon Postgres · PostGIS · Resend',
			links: []
		},
		{
			number: '№ 010',
			title: 'Pine',
			description:
				'Healthcare task automation and notifications — bulk SMS/email campaigns with async workers, hardened through a production-readiness audit.',
			tag: 'Internship · Full Stack',
			imageUrl: pineImg,
			whatIDid: [
				'Built the FastAPI backend: auth, campaign management, async email & SMS job workers, GCS + Pub/Sub integrations',
				'Shipped the React 19 + Vite frontend with protected routing, a notification wizard, and shared error monitoring',
				'Hardened it through a production-readiness audit — error boundaries, clean lint/build, Cypress component & E2E coverage'
			],
			stack: 'FastAPI · React 19 · GCS · Pub/Sub · Cypress',
			links: []
		}
	];

	let selectedProject = $state<(typeof personalProjects)[number] | (typeof internshipProjects)[number] | null>(
		null
	);
	let triggerEl = $state<HTMLElement | null>(null);

	function openProject(
		project: (typeof personalProjects)[number] | (typeof internshipProjects)[number]
	) {
		triggerEl = document.activeElement instanceof HTMLElement ? document.activeElement : null;
		selectedProject = project;
	}

	function closeProject() {
		selectedProject = null;
		// Let the modal's out-transition finish, then hand focus back to the card
		setTimeout(() => triggerEl?.focus(), 300);
	}
</script>

<section id="work" class="section section-anchor">
	<div class="container">
		<SectionHeadline
			eyebrow="Selected Work"
			headline="Projects I've built from the ground up — from idea to production."
			italicWords={['built']}
		>
			<p class="section-sub">
				A selection of projects spanning privacy &amp; security, AI systems, and full-stack platforms. Click
				any card to see what I did.
			</p>
		</SectionHeadline>

		<div class="projects-grid">
			{#each personalProjects as project, i}
				<ScrollReveal delay={(i % 3) * 0.1}>
					<ProjectCard {...project} onSelect={() => openProject(project)} />
				</ScrollReveal>
			{/each}
		</div>

		<div class="internship-block">
			<div class="internship-header">
				<Eyebrow>Internship · Daaranya.ai</Eyebrow>
				<h3 class="internship-title">
					Shipped across Daaranya.ai's <em class="internship-em">product suite</em>
				</h3>
				<p class="internship-sub">
					Built across the Humpback monorepo — three products, five frontends, three FastAPI backends,
					and async workers.
				</p>
			</div>

			<div class="internship-grid">
				{#each internshipProjects as project, i}
					<ScrollReveal delay={(i % 3) * 0.1}>
						<ProjectCard {...project} onSelect={() => openProject(project)} />
					</ScrollReveal>
				{/each}

			</div>
		</div>
	</div>
</section>

{#if selectedProject}
	<ProjectModal project={selectedProject} onClose={closeProject} />
{/if}

<style>
	.section-sub {
		font-family: var(--font-body);
		font-size: var(--text-base);
		line-height: 1.6;
		color: var(--color-muted);
		max-width: 560px;
		margin-top: 1rem;
	}

	.projects-grid,
	.internship-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		grid-auto-rows: 1fr;
		gap: 1.5rem;
	}

	.internship-block {
		margin-top: 5rem;
		padding-top: 3.5rem;
		border-top: 1px solid var(--color-border);
	}

	.internship-header {
		margin-bottom: 2.25rem;
	}

	.internship-title {
		font-family: var(--font-display);
		font-size: clamp(var(--text-2xl), 3vw, var(--text-4xl));
		font-weight: 300;
		line-height: 1.2;
		color: var(--color-ink);
		max-width: 640px;
		margin-top: 0.75rem;
	}

	.internship-em {
		font-style: italic;
		color: var(--color-accent);
	}

	.internship-sub {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--color-muted);
		max-width: 520px;
		margin-top: 0.75rem;
	}

	@media (max-width: 900px) {
		.projects-grid,
		.internship-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
