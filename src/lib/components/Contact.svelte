<script lang="ts">
	import ScrollReveal from './ScrollReveal.svelte';
	import HandDrawnAccent from './HandDrawnAccent.svelte';
	import ContactForm from './ContactForm.svelte';
	import SocialIcon from './SocialIcon.svelte';
	import { socialLinks } from '$lib/socialLinks';
</script>

<section id="contact" class="section section--alt section-anchor">
	<div class="container">
		<div class="contact-inner">
			<img
				src="/peep-standing.svg"
				alt=""
				class="contact-peep"
				width="80"
				height="120"
				aria-hidden="true"
			/>
			<ScrollReveal>
				<div class="contact-eyebrow">
					<span class="eyebrow-line"></span>
					<span class="eyebrow-label">Get in Touch</span>
					<span class="eyebrow-line"></span>
				</div>
			</ScrollReveal>

			<ScrollReveal delay={0.15}>
				<h2 class="contact-headline">
					Let's <em class="headline-em">ship</em> something great together.
					<HandDrawnAccent variant="sparkle" class="contact-sparkle" />
				</h2>
			</ScrollReveal>

			<ScrollReveal delay={0.3}>
				<p class="contact-description">
					Whether you have a project in mind, an interesting problem to solve, or just want to chat about
					Go, React, AI, or distributed systems. I'd love to hear from you.
				</p>
			</ScrollReveal>

			<ScrollReveal delay={0.45}>
				<div class="contact-cta">
					<ContactForm />
				</div>
			</ScrollReveal>

			<ScrollReveal delay={0.6}>
				<div class="contact-socials">
					{#each socialLinks as link}
						<a
							href={link.href}
							class="contact-social"
							download={link.download || undefined}
							aria-label={link.label}
							title={link.label}
						>
							<SocialIcon name={link.icon} size={20} />
						</a>
					{/each}
				</div>
			</ScrollReveal>
		</div>
	</div>
</section>

<style>
	.contact-inner {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
		gap: 1.5rem;
		max-width: 640px;
		margin: 0 auto;
		position: relative;
	}

	.contact-eyebrow {
		display: flex;
		align-items: center;
		gap: 1rem;
		width: 100%;
		justify-content: center;
	}

	.eyebrow-line {
		height: 1px;
		width: 60px;
		background: var(--color-border);
	}

	.eyebrow-label {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-muted);
		white-space: nowrap;
	}

	.contact-headline {
		font-family: var(--font-display);
		font-size: clamp(var(--text-3xl), 4.5vw, var(--text-5xl));
		font-weight: 300;
		line-height: 1.15;
		color: var(--color-ink);
	}

	.contact-description {
		font-family: var(--font-body);
		font-size: var(--text-base);
		line-height: 1.7;
		color: var(--color-muted);
		max-width: 500px;
	}

	:global(.contact-sparkle) {
		margin-left: 0.5rem;
		vertical-align: middle;
	}

	.contact-peep {
		position: absolute;
		right: -60px;
		top: 10%;
		width: 80px;
		height: auto;
		opacity: 0.2;
		pointer-events: none;
	}

	@media (max-width: 768px) {
		.contact-peep {
			display: none;
		}

		.eyebrow-line {
			width: 32px;
		}

		.contact-socials {
			gap: 0.85rem;
		}

		.contact-description {
			font-size: var(--text-sm);
		}
	}

	.contact-cta {
		margin-top: 0.5rem;
		width: 100%;
	}

	.contact-cta :global(.form-card) {
		width: 100%;
		max-width: 560px;
		margin: 0 auto;
	}	.contact-socials {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.25rem;
		margin-top: 0.75rem;
	}

	.contact-social {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 52px;
		height: 52px;
		border-radius: 14px;
		border: 1.5px solid var(--color-border);
		background: transparent;
		color: var(--color-accent);
		text-decoration: none;
		transition:
			transform 0.3s var(--ease-out),
			border-color 0.3s var(--ease-out),
			background 0.3s var(--ease-out),
			box-shadow 0.3s var(--ease-out);
	}

	.contact-social:hover {
		transform: translateY(-3px);
		border-color: var(--color-accent);
		background: rgba(92, 112, 149, 0.08);
		box-shadow: 0 10px 24px rgba(92, 112, 149, 0.12);
	}

	.contact-social:active {
		transform: translateY(-1px) scale(0.97);
	}

	.contact-social:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 3px;
	}
</style>
