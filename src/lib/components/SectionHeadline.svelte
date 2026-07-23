<script lang="ts">
	import Eyebrow from './Eyebrow.svelte';

	let {
		eyebrow,
		headline,
		italicWords = [],
		children,
		class: className = ''
	}: {
		eyebrow: string;
		headline: string;
		italicWords?: string[];
		children?: import('svelte').Snippet;
		class?: string;
	} = $props();

	function renderHeadline(text: string): string {
		if (italicWords.length === 0) return text;
		let result = text;
		for (const word of italicWords) {
			const escaped = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
			result = result.replace(new RegExp(`\\b(${escaped})\\b`, 'gi'), '<em class="headline-em">$1</em>');
		}
		return result;
	}
</script>

<div class="section-header {className}">
	<Eyebrow>{eyebrow}</Eyebrow>
	<h2 class="headline">{@html renderHeadline(headline)}</h2>
	{#if children}
		{@render children()}
	{/if}
</div>

<style>
	.section-header {
		margin-bottom: 3rem;
	}

	.headline {
		font-family: var(--font-display);
		font-size: clamp(var(--text-3xl), 4vw, var(--text-5xl));
		font-weight: 300;
		line-height: 1.2;
		color: var(--color-ink);
		max-width: 720px;
	}

	:global(.headline-em) {
		font-style: italic;
		color: var(--color-accent);
	}
</style>
