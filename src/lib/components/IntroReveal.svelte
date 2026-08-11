<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ScrollReveal from './ScrollReveal.svelte';
	import HandDrawnAccent from './HandDrawnAccent.svelte';

	let { onComplete }: { onComplete?: () => void } = $props();

	let show = $state(false);
	let revealing = $state(false);

	const REVEAL_START = 1300; // ms — ink reveal length before the fade begins
	const REVEAL_DURATION = 2000; // ms — the full-page fadeout

	let startTimer: number | undefined;
	let endTimer: number | undefined;

	function skip() {
		onComplete?.();
	}

	onMount(() => {
		if (typeof window === 'undefined') return;
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			onComplete?.();
			return;
		}
		show = true;
		startTimer = window.setTimeout(() => {
			revealing = true;
		}, REVEAL_START);
		endTimer = window.setTimeout(() => {
			onComplete?.();
		}, REVEAL_START + REVEAL_DURATION + 200);
	});

	onDestroy(() => {
		if (startTimer !== undefined) window.clearTimeout(startTimer);
		if (endTimer !== undefined) window.clearTimeout(endTimer);
	});
</script>

{#if show}
	<div class="intro" class:intro--go={revealing}>
		<!-- Act 1 — ink mood screen: same reveal as the main content -->
		<div class="ink" aria-hidden="true">
			<!-- Background layer: solid ink + soft accent glow. Zooms IN while the
			     words zoom out — the dolly-zoom motion. -->
			<div class="ink__bg"></div>

			<!-- Foreground layer: the words. Zooms out + dissolves, lingering
			     over the rushing background before it melts away. -->
			<div class="ink__content">
				<ScrollReveal class="ink-reveal">
					<div class="ink__name">Kumar Anubhav</div>
				</ScrollReveal>
				<HandDrawnAccent variant="squiggle" class="ink-accent" />
				<ScrollReveal delay={0.15} class="ink-reveal">
					<span class="ink__tagline">thinker, tinkerer, builder</span>
				</ScrollReveal>
			</div>
		</div>

		<!-- The skip control lives outside the aria-hidden ink so assistive tech can reach it -->
		<button type="button" class="skip" onclick={skip}>skip &rarr;</button>
	</div>
{/if}

<style>
	.intro {
		position: fixed;
		inset: 0;
		z-index: 200;
		touch-action: none;
		-webkit-user-select: none;
		user-select: none;
		overflow: hidden;
	}

	/* ---------- Ink screen ---------- */
	.ink {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		text-align: center;
	}

	/* The master reveal: the whole screen recedes slightly (zoom out) while it
	   fades, and the background layer looms past the words inside it — dolly zoom. */
	.intro--go .ink {
		animation: ink-fade 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	@keyframes ink-fade {
		from {
			opacity: 1;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(0.94);
		}
	}

	/* ---------- Background layer (dolly IN) ---------- */
	.ink__bg {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 50% 42%, rgba(92, 112, 149, 0.17), transparent 62%),
			var(--color-cta);
	}

	.intro--go .ink__bg {
		animation: bg-dolly 2s var(--ease-out) forwards;
	}

	@keyframes bg-dolly {
		from {
			transform: scale(1);
		}
		to {
			transform: scale(1.4);
		}
	}

	/* ---------- Foreground layer (dolly OUT) ---------- */
	.ink__content {
		position: relative;
		z-index: 1;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.75rem;
	}

	/* Words hold crisp while the background looms in, then dissolve out */
	.intro--go .ink__content {
		animation: content-dolly 2s cubic-bezier(0.4, 0, 0.2, 1) forwards;
	}

	@keyframes content-dolly {
		0%,
		45% {
			opacity: 1;
			transform: scale(1);
		}
		100% {
			opacity: 0;
			transform: scale(0.9);
		}
	}

	:global(.ink-reveal) {
		position: relative;
	}

	.ink__name {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 300;
		font-size: clamp(2.5rem, 8vw, 4.5rem);
		letter-spacing: -0.01em;
		line-height: 1.1;
		color: #f4f1e9;
		white-space: nowrap;
	}

	.ink__tagline {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(244, 241, 233, 0.6);
	}

	/* Hand-drawn squiggle between name and tagline — drawn in after the name lands.
	   :global because the class lives on the HandDrawnAccent component root (an SVG). */
	:global(.ink-accent) {
		position: relative;
		margin: 0.25rem 0 0.15rem;
	}

	:global(.ink-accent path) {
		opacity: 0.45;
		stroke-dasharray: 100;
		stroke-dashoffset: 100;
		animation: draw-squiggle 0.8s var(--ease-out) 0.4s forwards;
	}

	@keyframes draw-squiggle {
		to {
			stroke-dashoffset: 0;
		}
	}

	/* ---------- Skip ---------- */
	/* Centered so the intro stays perfectly symmetric */
	.skip {
		position: absolute;
		left: 50%;
		transform: translateX(-50%);
		bottom: 1.5rem;
		z-index: 2;
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-muted);
		opacity: 0;
		animation: skip-in 0.4s var(--ease-out) 1.1s forwards;
		transition: color 0.25s;
	}

	.skip:hover {
		color: var(--color-ink);
	}

	.skip:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 4px;
		border-radius: 4px;
	}

	@keyframes skip-in {
		to {
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ink,
		.ink__bg,
		.ink__content,
		:global(.ink-accent),
		:global(.ink-accent path),
		.skip {
			animation: none;
		}

		:global(.ink-accent path) {
			stroke-dashoffset: 0;
		}
	}
</style>
