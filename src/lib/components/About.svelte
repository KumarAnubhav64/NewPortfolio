<script lang="ts">
	import SectionHeadline from './SectionHeadline.svelte';
	import FactBox from './FactBox.svelte';
	import ScrollReveal from './ScrollReveal.svelte';

	const funFacts = [
		'Pursuing B.Tech in Computer Science at IIIT Ranchi (2023–2027)',
		'Full Stack Development Intern at DAaranya.ai building AI-powered platforms',
		'Lead the IoT & Robotics Club at IIIT Ranchi',
		'Built an idempotent transaction service in Go for concurrency-safe payments',
		'Obsessed with clean architecture, reliable systems, and great developer experiences'
	];
</script>

<section id="about" class="section">
	<div class="container">
		<SectionHeadline
			eyebrow="About"
			headline="A developer who cares about systems, architecture, and the details that make software reliable."
			italicWords={['systems', 'architecture', 'reliable']}
		/>

		<div class="about-grid">
			<div class="about-text">
				<ScrollReveal>
					<p class="about-paragraph">
						I'm a full-stack developer and CSE undergraduate at IIIT Ranchi with experience
						building production-grade applications from the ground up. I've worked on
						AI-powered platforms, payment systems with idempotent webhooks, and
						multi-tenant cloud architectures.
					</p>
				</ScrollReveal>
				<ScrollReveal delay={0.15}>
					<p class="about-paragraph">
						My approach to building software is rooted in first principles — I care deeply about
						type safety, clean APIs, and systems that fail gracefully. From Go-based
						transaction services to React frontends deployed on GCP, I enjoy owning
						the full stack and shipping with confidence.
					</p>
				</ScrollReveal>
			</div>

			<div class="about-sidebar">
				<ScrollReveal delay={0.2}>
					<FactBox
						title="Interesting Facts"
						items={funFacts}
						closingQuote="Good code is not just what the machine reads. Good code is what another human can understand."
					/>
				</ScrollReveal>
			</div>
		</div>
	</div>
</section>

<style>
	.about-grid {
		display: grid;
		grid-template-columns: 1.2fr 1fr;
		gap: 3rem;
		align-items: start;
	}

	.about-text {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.about-paragraph {
		font-family: var(--font-body);
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-ink);
		max-width: 540px;
	}

	@media (max-width: 768px) {
		.about-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
