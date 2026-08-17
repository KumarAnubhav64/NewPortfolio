<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { playlist } from '$lib/playlist';

	/**
	 * Small floating music player for Kumar's favourite playlist.
	 * Nothing plays automatically — visitors press play themselves.
	 */
	const AMBIENT_VOLUME = 0.8;

	let audio: HTMLAudioElement | undefined = $state();
	let currentIndex = $state(0);
	let playing = $state(false);
	let failed = $state(false);

	const track = $derived(playlist[currentIndex] ?? playlist[0]);

	function loadTrack(index: number) {
		if (!audio) return;
		currentIndex = index;
		failed = false;
		audio.src = playlist[index].src;
		audio.load();
	}

	function playCurrent() {
		if (!audio || failed) return;
		audio.volume = AMBIENT_VOLUME;
		audio.play().catch(() => {});
	}

	function toggle() {
		if (!audio || failed) return;
		if (playing) {
			audio.pause();
		} else {
			playCurrent();
		}
	}

	function next() {
		const nextIndex = (currentIndex + 1) % playlist.length;
		loadTrack(nextIndex);
		if (playing) playCurrent();
	}

	function prev() {
		const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
		loadTrack(prevIndex);
		if (playing) playCurrent();
	}

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
				playCurrent();
			}
		};
		document.addEventListener('visibilitychange', onVisibilityChange);

		return () => {
			document.removeEventListener('visibilitychange', onVisibilityChange);
		};
	});

	onDestroy(() => {
		audio?.pause();
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
		src={track.src}
		preload="none"
		onplay={() => (playing = true)}
		onpause={() => (playing = false)}
		onerror={() => (failed = true)}
		onended={() => {
			// Advance through the playlist; stop after the last track finishes.
			if (currentIndex < playlist.length - 1) {
				next();
			} else {
				playing = false;
			}
		}}
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

	{#if playlist.length > 1}
		<div class="player__controls">
			<button type="button" class="player__step" onclick={prev} aria-label="Previous track" title="Previous track">
				<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
					<path d="M6 5h2v14H6zM18 5v14l-9-7z" />
				</svg>
			</button>
			<button type="button" class="player__step" onclick={next} aria-label="Next track" title="Next track">
				<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor">
					<path d="M16 5h2v14h-2zM6 5v14l9-7z" />
				</svg>
			</button>
		</div>
	{/if}

	<div class="player__meta">
		<span class="player__title">{track.title}</span>
		<span class="player__status">
			{#if failed}
				Track missing
			{:else if playlist.length > 1}
				{currentIndex + 1} of {playlist.length} · {playing ? 'Playing' : 'Paused'}
			{:else}
				{playing ? 'Playing' : 'Paused'}
			{/if}
		</span>
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
		max-width: 460px;
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



	/* ---------- Prev / next ---------- */
	.player__controls {
		flex-shrink: 0;
		display: flex;
		gap: 0.25rem;
		opacity: 0;
		transform: translateX(-8px);
		transition:
			opacity 0.55s ease 0.3s,
			transform 0.55s ease 0.3s;
	}

	.player:hover .player__controls,
	.player:focus-within .player__controls {
		opacity: 1;
		transform: none;
	}

	.player__step {
		flex-shrink: 0;
		width: 24px;
		height: 24px;
		border: none;
		border-radius: 50%;
		background: var(--color-bg-alt);
		color: var(--color-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition:
			background-color 0.2s,
			color 0.2s,
			transform 0.2s;
	}

	.player__step:hover {
		background: var(--color-accent);
		color: #fff;
		transform: scale(1.08);
	}

	.player__step:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
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
			max-width: 460px;
			border-radius: 999px;
			padding: 6px 1.25rem 6px 6px;
		}

		.player__meta,
		.player__controls,
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
		.player__controls,
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
