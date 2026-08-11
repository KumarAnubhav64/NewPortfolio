<script lang="ts">
	import SectionHeadline from './SectionHeadline.svelte';
	import FactBox from './FactBox.svelte';
	import ScrollReveal from './ScrollReveal.svelte';
	import HandDrawnAccent from './HandDrawnAccent.svelte';

	const funFacts = [
		'Pursuing B.Tech in Computer Science at IIIT Ranchi (2023–2027)',
		'Full Stack Development Intern at DAaranya.ai building AI-powered platforms',
		'Lead the IoT & Robotics Club at IIIT Ranchi',
		'Shipped encrypted personal projects, including a peer-to-peer voice app and a steganography vault',
		'Obsessed with clean architecture, reliable systems, and great developer experiences'
	];
</script>

<section id="about" class="section section-anchor">
	<div class="container">
		<SectionHeadline
			eyebrow="About"
			headline="A developer who cares about systems, architecture, and the details that make software reliable and private."
			italicWords={['systems', 'architecture', 'reliable', 'private']}
		/>

		<div class="about-grid">
			<div class="about-text">
				<ScrollReveal>
					<p class="about-paragraph">
						I'm a full-stack developer and CSE undergraduate at IIIT Ranchi with experience
						building production-grade applications from the ground up. I've worked on
						AI-powered platforms, privacy and security tools, and multi-tenant cloud
						architectures.
					</p>
				</ScrollReveal>
				<ScrollReveal delay={0.15}>
					<p class="about-paragraph">
						My approach to building software is rooted in first principles. I care deeply about
						type safety, clean APIs, and systems that fail gracefully. From encrypted
						peer-to-peer apps to React frontends deployed on GCP, I enjoy owning the
						full stack and shipping with confidence.
					</p>
				</ScrollReveal>
			</div>

			<div class="about-sidebar">
				<ScrollReveal delay={0.2}>
					<div class="about-fact-wrapper">
						<HandDrawnAccent variant="star" class="about-star" />
						<FactBox
							title="Interesting Facts"
							items={funFacts}
							closingQuote="Good code is not just what the machine reads. Good code is what another human can understand."
						/>
						<img
							src="/peep-sitting.svg"
							alt=""
							class="about-peep"
							width="80"
							height="80"
							aria-hidden="true"
						/>
					</div>
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

	.about-fact-wrapper {
		position: relative;
	}

	:global(.about-star) {
		position: absolute;
		top: -8px;
		right: -8px;
		z-index: 1;
	}

	.about-peep {
		position: absolute;
		bottom: -24px;
		left: -24px;
		width: 64px;
		height: auto;
		opacity: 0.2;
		pointer-events: none;
	}

	@media (max-width: 600px) {
		.about-peep {
			display: none;
		}
	}

	@media (max-width: 768px) {
		.about-grid {
			grid-template-columns: 1fr;
		}
	}
</style>
