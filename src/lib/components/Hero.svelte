<script lang="ts">
	import Button from './Button.svelte';
	import ScrollReveal from './ScrollReveal.svelte';
	import ParallaxTilt from './ParallaxTilt.svelte';
	import HandDrawnAccent from './HandDrawnAccent.svelte';
</script>

<section class="hero section">
	<div class="container">
		<div class="hero-grid">
			<div class="hero-content">
				<ScrollReveal>
					<span class="hero-eyebrow">Full Stack Developer · Python · Go · TypeScript</span>
				</ScrollReveal>

				<ScrollReveal delay={0.15}>
					<h1 class="hero-headline">
						I write <em class="headline-em">code</em> that's
type-safe, <em class="headline-em">tested</em>, and ready for production.
					</h1>
					<HandDrawnAccent variant="squiggle" class="hero-underline"/>
				</ScrollReveal>

				<ScrollReveal delay={0.3}>
					<p class="hero-description">
						Full-stack developer working across Python, Go, TypeScript, and cloud-native
						infrastructure. I build payment systems, AI platforms, and everything in between —
						with a focus on clean APIs, concurrency safety, and reliable deployments.
					</p>
				</ScrollReveal>

				<ScrollReveal delay={0.45}>
					<div class="hero-ctas">
						<Button href="#work">See my work</Button>
						<Button variant="secondary" href="/resume.pdf" download>Download Resumé</Button>
					</div>
				</ScrollReveal>
			</div>

			<div class="hero-visual">
				<ScrollReveal delay={0.2}>
					<ParallaxTilt>
						<div class="portrait-wrapper">
							<div class="portrait">
								<div class="portrait-inner">
									<img
										src="/hero-portrait.png"
										alt="Portrait of Kumar Anubhav"
										class="portrait-img"
										width="1024"
										height="1024"
									/>
								</div>
							</div>
							<img
								src="/peep-standing.svg"
								alt=""
								class="hero-peep"
								width="80"
								height="120"
								aria-hidden="true"
							/>
							<div class="portrait-caption">
								<svg width="24" height="12" viewBox="0 0 24 12" fill="none" class="caption-arrow">
									<path d="M24 6H2M6 2l-4 4 4 4" stroke="var(--color-accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
								</svg>
								<span>B.Tech CSE · IIIT Ranchi</span>
							</div>
						</div>
					</ParallaxTilt>
				</ScrollReveal>
			</div>
		</div>
	</div>
</section>

<style>
	.hero {
		padding: 3rem 0 5rem;
	}

	.hero-grid {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 3rem;
		align-items: center;
	}

	.hero-content {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.hero-eyebrow {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	.hero-headline {
		font-family: var(--font-display);
		font-size: clamp(var(--text-4xl), 5.5vw, var(--text-6xl));
		font-weight: 300;
		line-height: 1.1;
		letter-spacing: -0.02em;
		color: var(--color-ink);
		max-width: 700px;
	}

	.hero-description {
		font-family: var(--font-body);
		font-size: var(--text-lg);
		line-height: 1.6;
		color: var(--color-muted);
		max-width: 500px;
	}

	.hero-ctas {
		display: flex;
		gap: 1rem;
		flex-wrap: wrap;
		margin-top: 0.5rem;
	}

	:global(.hero-underline) {
		margin-top: 0.25rem;
		margin-left: 0.25rem;
	}

	/* Portrait */
	.hero-visual {
		display: flex;
		justify-content: center;
	}

	.hero-peep {
		position: absolute;
		bottom: -20px;
		right: -20px;
		width: 70px;
		height: auto;
		opacity: 0.25;
		pointer-events: none;
	}

	.portrait-wrapper {
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
	}

	.portrait {
		width: 100%;
		max-width: 380px;
	}

	.portrait-inner {
		width: 100%;
	}

	.portrait-img {
		width: 100%;
		height: auto;
		display: block;
		-webkit-mask-image: radial-gradient(ellipse 90% 85% at 50% 50%, black 55%, transparent 100%);
		mask-image: radial-gradient(ellipse 90% 85% at 50% 50%, black 55%, transparent 100%);
		opacity: 0.95;
		transition: opacity 0.5s ease, transform 0.5s ease;
	}

	.portrait-img:hover {
		opacity: 1;
		transform: scale(1.02);
	}

	.portrait-caption {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin-top: 0.75rem;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-muted);
		font-style: italic;
	}

	.caption-arrow {
		flex-shrink: 0;
	}

	@media (max-width: 900px) {
		.hero-grid {
			grid-template-columns: 1fr;
			gap: 2rem;
		}

		.hero-visual {
			order: -1;
		}

		.portrait {
			max-width: 280px;
		}
	}
</style>
