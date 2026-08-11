<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import ScrollReveal from './ScrollReveal.svelte';

	let { onComplete }: { onComplete?: () => void } = $props();

	let show = $state(false);
	let revealing = $state(false);

	const REVEAL_START = 2400; // ms — ink reveal length before the fade begins
	const REVEAL_DURATION = 3000; // ms — the circular fade

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
		}, REVEAL_START + REVEAL_DURATION + 150);
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
			<ScrollReveal class="ink-reveal">
				<div class="ink__name">Kumar Anubhav</div>
			</ScrollReveal>
			<ScrollReveal delay={0.15} class="ink-reveal">
				<span class="ink__tagline">thinker, tinkerer, builder</span>
			</ScrollReveal>
		</div>

		<!-- The skip control lives outside the aria-hidden ink so assistive tech can reach it -->
		<button type="button" class="skip" onclick={skip}>skip &rarr;</button>
	</div>
{/if}

<style>
	@property --open {
		syntax: '<length>';
		initial-value: 0px;
		inherits: false;
	}

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
		--open: 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.1rem;
		text-align: center;
		background: var(--color-cta);
		/* A soft circular hole opens from the center — the ink fades out in a circle */
		-webkit-mask-image: radial-gradient(
			circle at 50% 50%,
			transparent 0,
			transparent calc(var(--open) - 80px),
			#000 var(--open),
			#000 100%
		);
		mask-image: radial-gradient(
			circle at 50% 50%,
			transparent 0,
			transparent calc(var(--open) - 80px),
			#000 var(--open),
			#000 100%
		);
	}

	.intro--go .ink {
		animation:
			ink-fade-open 3s linear forwards,
			ink-fade-safe 3s var(--ease-out) forwards;
	}

	@keyframes ink-fade-open {
		from {
			--open: 0px;
		}
		/* Linear pacing + a ~72vmax target = the hole covers even square screens' corners
		   only near the very end, so the whole 3s reads as one slow, even dissolve. */
		to {
			--open: 72vmax;
		}
	}

	/* Safety net: browsers without @property (mask never opens) still fade the ink out. */
	@keyframes ink-fade-safe {
		0%,
		85% {
			opacity: 1;
		}
		100% {
			opacity: 0;
		}
	}

	:global(.ink-reveal) {
		position: relative;
		z-index: 1;
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
		color: rgba(244, 241, 233, 0.55);
	}

	/* ---------- Skip ---------- */
	.skip {
		position: absolute;
		right: 1.5rem;
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
		animation: skip-in 0.5s var(--ease-out) 1.6s forwards;
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
		.skip {
			animation: none;
		}
	}
</style>
