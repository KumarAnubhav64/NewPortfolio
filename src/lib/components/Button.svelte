<script lang="ts">
	import Magnetic from './Magnetic.svelte';

	let {
		children,
		variant = 'primary',
		href,
		download,
		class: className = ''
	}: {
		children: import('svelte').Snippet;
		variant?: 'primary' | 'secondary';
		href?: string;
		download?: boolean | string;
		class?: string;
	} = $props();
</script>

<Magnetic>
	{#if href}
		<a {href} {download} class="btn btn--{variant} {className}">
			{@render children()}
			<svg class="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</a>
	{:else}
		<button class="btn btn--{variant} {className}">
			{@render children()}
			<svg class="btn-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
				<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		</button>
	{/if}
</Magnetic>

<style>
	.btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.875rem 1.75rem;
		border-radius: var(--radius-lg);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		letter-spacing: 0.02em;
		cursor: pointer;
		transition: all 0.3s var(--ease-out);
		text-decoration: none;
		border: 1.5px solid transparent;
		line-height: 1;
		transform: scale(1);
	}

	.btn:hover {
		transform: scale(1.02);
	}

	.btn:active {
		transform: scale(0.98);
	}

	.btn-arrow {
		transition: transform 0.3s var(--ease-out);
	}

	.btn:hover .btn-arrow {
		transform: translateX(3px);
	}

	.btn--primary {
		background: var(--color-cta);
		color: #fff;
		border-color: var(--color-cta);
	}

	.btn--primary:hover {
		background: #2a2d33;
		border-color: #2a2d33;
	}

	.btn--secondary {
		background: transparent;
		color: var(--color-ink);
		border-color: var(--color-border);
	}

	.btn--secondary:hover {
		border-color: var(--color-muted);
		background: rgba(0,0,0,0.02);
	}
</style>
