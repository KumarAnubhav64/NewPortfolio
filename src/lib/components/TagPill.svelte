<script lang="ts">
	let {
		children,
		class: className = ''
	}: {
		children: import('svelte').Snippet;
		class?: string;
	} = $props();
</script>

<span class="tag-pill {className}">
	{@render children()}
</span>

<style>
	.tag-pill {
		display: inline-block;
		padding: 0.3rem 0.75rem;
		border-radius: 100px;
		background: rgba(92, 111, 149, 0.1);
		border: 1px solid rgba(92, 111, 149, 0.25);
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 500;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-accent);
		white-space: nowrap;
	}
</style>
