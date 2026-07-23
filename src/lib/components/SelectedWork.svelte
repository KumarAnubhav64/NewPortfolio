<script lang="ts">
	import SectionHeadline from './SectionHeadline.svelte';
	import ProjectCard from './ProjectCard.svelte';
	import ScrollReveal from './ScrollReveal.svelte';

	import designSystemImg from '$lib/assets/project-design-system.svg';
	import aiWorkflowImg from '$lib/assets/project-ai-workflow.svg';
	import dashboardImg from '$lib/assets/project-dashboard.svg';

	const projects = [
		{
			number: '№ 001',
			title: 'TransactSafe',
			description: 'Go-based idempotent transaction processing service with PostgreSQL for concurrency-safe account balances and atomic batch transfers.',
			tag: 'Backend',
			href: 'https://github.com/KumarAnubhav64',
			imageUrl: dashboardImg
		},
		{
			number: '№ 002',
			title: 'AI Ascent',
			description: 'Interactive platform built with React 19, FastAPI, and TensorFlow.js featuring a browser-based Python IDE via Pyodide and live AI vision labs.',
			tag: 'AI / Full Stack',
			href: 'https://github.com/KumarAnubhav64',
			imageUrl: aiWorkflowImg
		},
		{
			number: '№ 003',
			title: 'DAaranya.ai Platform',
			description: 'Built responsive interfaces, integrated Stripe & Razorpay payments with idempotent webhooks, and managed multi-tenant architecture on GCP.',
			tag: 'Full Stack',
			href: 'https://github.com/KumarAnubhav64',
			imageUrl: designSystemImg
		}
	];
</script>

<section id="work" class="section">
	<div class="container">
		<SectionHeadline
			eyebrow="Selected Work"
			headline="Projects I've built from the ground up — from idea to production."
			italicWords={['built']}
		>
			<p class="section-sub">A selection of projects spanning payment systems, AI platforms, and full-stack applications.</p>
		</SectionHeadline>

		<div class="projects-grid">
			{#each projects as project, i}
				<ScrollReveal delay={i * 0.12}>
					<ProjectCard {...project} />
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>

<style>
	.section-sub {
		font-family: var(--font-body);
		font-size: var(--text-base);
		line-height: 1.6;
		color: var(--color-muted);
		max-width: 520px;
		margin-top: 1rem;
	}

	.projects-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	@media (max-width: 900px) {
		.projects-grid {
			grid-template-columns: 1fr;
		}
	}

	@media (min-width: 901px) and (max-width: 1200px) {
		.projects-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}
</style>
