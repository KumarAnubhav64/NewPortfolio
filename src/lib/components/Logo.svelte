<script lang="ts">
	let {
		size = 24,
		decorative = false,
		class: className = ''
	}: { size?: number; decorative?: boolean; class?: string } = $props();
</script>

<span
	class="logo {className}"
	style={`--logo-size: ${size}px`}
	role={decorative ? undefined : 'img'}
	aria-hidden={decorative ? 'true' : undefined}
	aria-label={decorative ? undefined : 'Kumar Anubhav'}
>
	Kumar&nbsp;Anubhav
</span>

<style>
	.logo {
		display: inline-block;
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 400;
		font-optical-sizing: auto;
		font-size: var(--logo-size, 24px);
		line-height: 1.1;
		letter-spacing: -0.015em;
		color: var(--color-ink);
		white-space: nowrap;
		flex-shrink: 0;
		transition:
			transform 0.4s var(--ease-out),
			color 0.3s var(--ease-out);
	}

	.logo:hover {
		transform: translateY(-1px);
	}

	@media (prefers-reduced-motion: reduce) {
		.logo {
			transition: none;
		}
	}
</style>
