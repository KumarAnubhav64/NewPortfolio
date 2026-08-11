<script lang="ts">
	import { onMount, onDestroy } from 'svelte';

	/**
	 * Small floating music player.
	 * Starts automatically once the intro reveal finishes, at a quiet 30% volume.
	 * If the browser blocks that autoplay, it retries on the first interaction.
	 */
	let {
		src = '/audio/stranger-than-heaven.mp3',
		title = 'Stranger Than Heaven'
	}: { src?: string; title?: string } = $props();

	const AMBIENT_VOLUME = 0.3;

	let audio: HTMLAudioElement | undefined = $state();
	let playing = $state(false);
	let failed = $state(false);

	function playAmbient() {
		if (!audio || failed || playing) return;
		audio.volume = AMBIENT_VOLUME;
		audio.play().catch(() => {});
	}

	function toggle() {
		if (!audio || failed) return;
		if (playing) {
			audio.pause();
		} else {
			audio.volume = AMBIENT_VOLUME;
			audio.play().catch(() => {});
		}
	}

	let removeRetry = () => {};
	let wasPlayingBeforeHide = false;

	onMount(() => {
		// Pause when the tab is hidden, resume when it comes back (only if it was playing).
		const onVisibilityChange = () => {
			if (document.hidden) {
				if (playing) {
					wasPlayingBeforeHide = true;
					audio?.pause();
				}
			} else if (wasPlayingBeforeHide) {
				wasPlayingBeforeHide = false;
				playAmbient();
			}
		};
		document.addEventListener('visibilitychange', onVisibilityChange);

		// Start once the intro reveal is done.
		const onIntroComplete = () => {
			playAmbient();
			// If autoplay was blocked (no gesture yet), retry on the first interaction.
			const onFirstInteraction = () => {
				window.removeEventListener('pointerdown', onFirstInteraction);
				window.removeEventListener('keydown', onFirstInteraction);
				window.removeEventListener('touchstart', onFirstInteraction);
				playAmbient();
			};
			window.addEventListener('pointerdown', onFirstInteraction);
			window.addEventListener('keydown', onFirstInteraction);
			window.addEventListener('touchstart', onFirstInteraction);
			removeRetry = () => {
				window.removeEventListener('pointerdown', onFirstInteraction);
				window.removeEventListener('keydown', onFirstInteraction);
				window.removeEventListener('touchstart', onFirstInteraction);
			};
		};

		window.addEventListener('intro:complete', onIntroComplete);
		return () => {
			window.removeEventListener('intro:complete', onIntroComplete);
			document.removeEventListener('visibilitychange', onVisibilityChange);
			removeRetry();
		};
	});

	onDestroy(() => {
		removeRetry();
	});
</script>

<div
	class="player"
	class:player--playing={playing}
	class:player--failed={failed}
	role="group"
	aria-label="Music player"
>
	<audio
		bind:this={audio}
		{src}
		loop
		preload="none"
		onplay={() => (playing = true)}
		onpause={() => (playing = false)}
		onerror={() => (failed = true)}
	></audio>

	<button
		type="button"
		class="player__toggle"
		onclick={toggle}
		aria-label={playing ? 'Pause music' : 'Play music'}
		aria-pressed={playing}
	>
		{#if playing}
			<svg class="toggle-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
				<rect x="6" y="4.5" width="4" height="15" rx="1.2" />
				<rect x="14" y="4.5" width="4" height="15" rx="1.2" />
			</svg>
		{:else}
			<svg class="toggle-icon" viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
				<path d="M7.5 4.6c0-.9 1-1.5 1.8-1L19 11c.7.5.7 1.6 0 2.1l-9.7 7.3c-.8.6-1.8 0-1.8-1V4.6z" />
			</svg>
		{/if}
	</button>

	<div class="player__meta">
		<span class="player__title">{title}</span>
		<span class="player__status">{failed ? 'Track missing' : playing ? 'Playing' : 'Paused'}</span>
	</div>

	<div class="player__eq" aria-hidden="true">
		<span class="eq-bar"></span>
		<span class="eq-bar"></span>
		<span class="eq-bar"></span>
		<span class="eq-bar"></span>
	</div>
</div>

<style>
	/* A circle at rest… */
	.player {
		position: fixed;
		left: clamp(1rem, 3vw, 1.5rem);
		bottom: clamp(1rem, 3vw, 1.5rem);
		z-index: 90;
		display: flex;
		align-items: center;
		gap: 0.7rem;
		height: 48px;
		/* No fixed width: max-width clamps the circle at rest and lets it
		   grow into the pill on hover (overflow hidden clips the rest). */
		max-width: 48px;
		padding: 6px;
		border-radius: 50%;
		overflow: hidden;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		box-shadow: 0 6px 24px rgba(30, 36, 48, 0.08);
		transition:
			max-width 0.9s cubic-bezier(0.22, 1, 0.36, 1),
			border-radius 0.9s cubic-bezier(0.22, 1, 0.36, 1),
			padding 0.9s cubic-bezier(0.22, 1, 0.36, 1),
			border-color 0.3s,
			box-shadow 0.3s,
			transform 0.3s;
	}

	/* …that opens into the full pill on hover (or when focused) */
	.player:hover,
	.player:focus-within {
		max-width: 380px;
		border-radius: 999px;
		padding: 6px 1.25rem 6px 6px;
		border-color: var(--color-accent);
		box-shadow: 0 10px 32px rgba(30, 36, 48, 0.12);
		transform: translateY(-1px);
	}

	.player--failed {
		opacity: 0.75;
	}

	/* ---------- Play / pause ---------- */
	.player__toggle {
		flex-shrink: 0;
		width: 34px;
		height: 34px;
		border: none;
		border-radius: 50%;
		background: var(--color-ink);
		color: #f4f1e9;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background-color 0.25s,
			transform 0.25s;
	}

	.toggle-icon {
		display: block;
	}

	.player__toggle:hover {
		background: var(--color-accent);
		transform: scale(1.06);
	}

	.player__toggle:active {
		transform: scale(0.96);
	}

	.player__toggle:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 3px;
	}

	/* A gentle halo while playing */
	.player--playing .player__toggle {
		box-shadow: 0 0 0 5px rgba(92, 112, 149, 0.14);
	}

	/* ---------- Track meta ---------- */
	/* Hidden (and clipped) while the player is a circle; fades in as it opens */
	.player__meta {
		flex-shrink: 0;
		display: flex;
		flex-direction: column;
		line-height: 1.25;
		opacity: 0;
		transform: translateX(-8px);
		transition:
			opacity 0.55s ease 0.3s,
			transform 0.55s ease 0.3s;
	}

	.player:hover .player__meta,
	.player:focus-within .player__meta {
		opacity: 1;
		transform: none;
	}

	.player__title {
		font-family: var(--font-display);
		font-style: italic;
		font-size: 0.875rem;
		font-weight: 500;
		letter-spacing: -0.01em;
		color: var(--color-ink);
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		max-width: 150px;
	}

	.player__status {
		font-size: 0.625rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: var(--color-muted);
		transition: color 0.3s;
	}

	.player--playing .player__status {
		color: var(--color-accent);
	}

	/* ---------- Equalizer ---------- */
	.player__eq {
		flex-shrink: 0;
		display: flex;
		align-items: flex-end;
		gap: 2.5px;
		height: 15px;
		padding-left: 2px;
		opacity: 0;
		transform: translateX(-8px);
		transition:
			opacity 0.55s ease 0.3s,
			transform 0.55s ease 0.3s;
	}

	.player:hover .player__eq,
	.player:focus-within .player__eq {
		opacity: 1;
		transform: none;
	}

	.eq-bar {
		width: 2.5px;
		height: 4px;
		border-radius: 2px;
		background: var(--color-accent);
	}

	.player--playing .eq-bar {
		animation: eq-bounce var(--eq-d, 0.7s) infinite alternate ease-in-out;
	}

	.player--playing .eq-bar:nth-child(1) {
		--eq-d: 0.7s;
	}

	.player--playing .eq-bar:nth-child(2) {
		--eq-d: 0.95s;
		animation-delay: 0.15s;
	}

	.player--playing .eq-bar:nth-child(3) {
		--eq-d: 0.6s;
		animation-delay: 0.3s;
	}

	.player--playing .eq-bar:nth-child(4) {
		--eq-d: 0.85s;
		animation-delay: 0.05s;
	}

	@keyframes eq-bounce {
		from {
			height: 4px;
		}
		to {
			height: 14px;
		}
	}

	/* Touch devices have no hover, so keep it open as the full pill */
	@media (hover: none) {
		.player {
			max-width: 380px;
			border-radius: 999px;
			padding: 6px 1.25rem 6px 6px;
		}

		.player__meta,
		.player__eq {
			opacity: 1;
			transform: none;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.player {
			transition: none;
		}

		.player__meta,
		.player__eq {
			transition: none;
		}

		.player--playing .eq-bar {
			animation: none;
		}

		.player__toggle {
			transition: background-color 0.2s;
		}
	}
</style>
