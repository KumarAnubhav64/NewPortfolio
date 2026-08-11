<script module lang="ts">
	// Module-level counter so each Logo instance gets a unique gradient id
	let counter = 0;
</script>

<script lang="ts">
	let { size = 36, decorative = false, class: className = '' }: { size?: number; decorative?: boolean; class?: string } = $props();

	const uid = `ls-${++counter}`;
</script>

<svg
	class="logo {className}"
	width={size}
	height={size}
	viewBox="0 0 96 96"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	role={decorative ? undefined : 'img'}
	aria-hidden={decorative ? 'true' : undefined}
	aria-label={decorative ? undefined : 'Kumar Anubhav'}
>
	<defs>
		<radialGradient id={uid} cx="0.3" cy="0.22" r="1.15" gradientUnits="objectBoundingBox">
			<stop offset="0" stop-color="#ffffff" stop-opacity="0.14" />
			<stop offset="0.45" stop-color="#ffffff" stop-opacity="0.04" />
			<stop offset="1" stop-color="#ffffff" stop-opacity="0" />
		</radialGradient>
	</defs>

	<rect class="logo__tile" width="96" height="96" rx="23" />

	<!-- Soft light sheen — the quiet premium touch -->
	<rect class="logo__sheen" width="96" height="96" rx="23" fill="url(#{uid})" />

	<!-- Delicate inset ring, echoing the blueprint motif -->
	<rect class="logo__ring" x="4.25" y="4.25" width="87.5" height="87.5" rx="19.25" />

	<!-- K — hand-drawn strokes, slightly lifted & smoothed -->
	<path class="logo__stroke" d="M19 23.5c.45 13.5.9 28.5 1.45 47.5" />
	<path class="logo__stroke" d="M21.8 43.5C27.8 38.6 33.8 33.7 39.8 28.8" />
	<path class="logo__stroke" d="M22.2 47.5c6.6 6.9 11.8 14.7 16.8 23.5" />

	<!-- A — hand-drawn strokes, refined curves -->
	<path class="logo__stroke" d="M48.5 72.5c5-14.5 10-31 15-46.5" />
	<path class="logo__stroke" d="M63.5 26c5.4 16 9.9 32 13.3 46" />
	<path class="logo__stroke" d="M54.3 52c4.7-1.6 9.8-1.6 15.9 0" />

	<!-- Sparkle accent (site motif) -->
	<path
		class="logo__spark"
		d="M72.5 11c-.55 3.2-3.4 6.05-6.6 6.6 3.2.55 6.05 3.4 6.6 6.6.55-3.2 3.4-6.05 6.6-6.6-3.2-.55-6.05-3.4-6.6-6.6z"
	/>

	<!-- Hand-drawn squiggle underline -->
	<path class="logo__squiggle" d="M29 81c5-3 10-3 14 0s9 3 13 0 8-1 11 0" />
</svg>

<style>
	.logo {
		display: block;
		flex-shrink: 0;
		transition: transform 0.4s var(--ease-out);
	}

	.logo__tile {
		fill: var(--color-ink, #1e2430);
		transition: fill 0.3s var(--ease-out);
	}

	.logo__sheen {
		pointer-events: none;
	}

	.logo__ring {
		stroke: rgba(166, 184, 219, 0.45);
		stroke-width: 1.2;
		stroke-linecap: round;
		transition: stroke 0.3s var(--ease-out);
	}

	.logo__stroke {
		stroke: #f4f5f7;
		stroke-width: 4.8;
		stroke-linecap: round;
		stroke-linejoin: round;
	}

	.logo__spark {
		stroke: #a6b8db;
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-linejoin: round;
		transform-origin: 72.5px 17.6px;
		transition: transform 0.45s var(--ease-out);
	}

	.logo__squiggle {
		stroke: #a6b8db;
		stroke-width: 2.2;
		stroke-linecap: round;
		opacity: 0.85;
	}

	.logo:hover {
		transform: translateY(-1px);
	}

	.logo:hover .logo__spark {
		transform: rotate(90deg) scale(1.15);
	}

	.logo:hover .logo__tile {
		fill: var(--color-cta, #161819);
	}

	.logo:hover .logo__ring {
		stroke: rgba(166, 184, 219, 0.75);
	}

	@media (prefers-reduced-motion: reduce) {
		.logo,
		.logo__tile,
		.logo__spark,
		.logo__ring {
			transition: none;
		}
	}
</style>
