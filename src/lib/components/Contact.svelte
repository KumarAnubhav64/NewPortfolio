<script lang="ts">
	import Button from './Button.svelte';
	import ScrollReveal from './ScrollReveal.svelte';
	import HandDrawnAccent from './HandDrawnAccent.svelte';

	const socialLinks = [
		{ label: 'Email', href: 'mailto:kumaranubhav20026@gmail.com' },
		{ label: 'College', href: 'mailto:kumar.2023ug1026@iiitranchi.ac.in' },
		{ label: 'GitHub', href: 'https://github.com/KumarAnubhav64' },
		{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/kumar-anubhav-45b1aa29a/' },
		{ label: 'Resumé', href: '/resume.pdf' }
	];
</script>

<section id="contact" class="section section--alt">
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
					Go, React, AI, or distributed systems — I'd love to hear from you.
				</p>
			</ScrollReveal>

			<ScrollReveal delay={0.45}>
				<div class="contact-cta">
					<Button href="mailto:kumaranubhav20026@gmail.com">Start a conversation</Button>
				</div>
			</ScrollReveal>

			<ScrollReveal delay={0.6}>
				<div class="contact-links">
					{#each socialLinks as link}
						<a href={link.href} class="contact-link">{link.label}</a>
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

	.contact-cta {
		margin-top: 0.5rem;
	}

	.contact-links {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.5rem;
		margin-top: 0.5rem;
	}

	.contact-link {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-accent);
		text-decoration: none;
		transition: opacity 0.2s;
		position: relative;
	}

	.contact-link::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 0;
		height: 1px;
		background: var(--color-accent);
		transition: width 0.3s var(--ease-out);
	}

	.contact-link:hover::after {
		width: 100%;
	}

	.contact-link:hover {
		opacity: 0.8;
	}
</style>
