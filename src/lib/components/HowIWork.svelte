<script lang="ts">
	import SectionHeadline from './SectionHeadline.svelte';
	import NumberedStep from './NumberedStep.svelte';
	import ScrollReveal from './ScrollReveal.svelte';

	const steps = [
		{
			number: '01',
			title: 'Understand the problem',
			description: 'I start by understanding the domain, the users, and the constraints — because the best code starts with the right questions.'
		},
		{
			number: '02',
			title: 'Design the architecture',
			description: 'Clean APIs, type-safe contracts, and scalable infrastructure. I design systems that are easy to reason about and hard to break.'
		},
		{
			number: '03',
			title: 'Build & test',
			description: 'Iterative development with a focus on reliability. Idempotent operations, concurrency safety, and comprehensive testing from day one.'
		},
		{
			number: '04',
			title: 'Deploy & iterate',
			description: 'Shipping to production with confidence using CI/CD, monitoring, and gradual rollouts. Real feedback drives the next cycle.'
		}
	];
</script>

<section id="how-i-work" class="section section--alt section-anchor">
	<div class="container">
		<SectionHeadline
			eyebrow="How I Work"
			headline="A structured approach to building software that's reliable and scalable."
			italicWords={['reliable', 'scalable']}
		>
			<p class="section-sub">Four principles guide how I approach every project, from planning to production.</p>
		</SectionHeadline>

		<div class="steps-grid">
			{#each steps as step, i}
				<ScrollReveal delay={i * 0.1}>
					<NumberedStep {...step} />
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
		max-width: 480px;
		margin-top: 1rem;
	}

	.steps-grid {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		gap: 2.5rem;
	}

	@media (max-width: 900px) {
		.steps-grid {
			grid-template-columns: repeat(2, 1fr);
			gap: 2rem;
		}
	}

	@media (max-width: 600px) {
		.steps-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
