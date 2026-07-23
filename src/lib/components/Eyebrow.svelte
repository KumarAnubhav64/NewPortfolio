<script lang="ts">
	let { children, class: className = '' }: { children: import('svelte').Snippet; class?: string } = $props();
</script>

<span class="eyebrow {className}">
	{@render children()}
</span>

<style>
	.eyebrow {
		display: inline-block;
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 500;
		letter-spacing: 0.1em;
		text-transform: uppercase;
		color: var(--color-muted);
		margin-bottom: 1rem;
	}
</style>
