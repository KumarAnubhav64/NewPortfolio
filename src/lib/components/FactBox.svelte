<script lang="ts">
	let {
		items,
		closingQuote,
		title
	}: {
		items: string[];
		closingQuote?: string;
		title?: string;
	} = $props();
</script>

<div class="fact-box">
	{#if title}
		<h3 class="fact-title">{title}</h3>
	{/if}
	<ul class="fact-list">
		{#each items as item}
			<li class="fact-item">{item}</li>
		{/each}
	</ul>
	{#if closingQuote}
		<div class="fact-quote">
			<span class="fact-quote-mark">"</span>
			<p class="fact-quote-text">{closingQuote}</p>
		</div>
	{/if}
</div>

<style>
	.fact-box {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		padding: 2rem;
	}

	.fact-title {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-muted);
		margin-bottom: 1.25rem;
	}

	.fact-list {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 0.75rem;
	}

	.fact-item {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--color-ink);
		padding-left: 1.25rem;
		position: relative;
	}

	.fact-item::before {
		content: '→';
		position: absolute;
		left: 0;
		color: var(--color-accent);
		font-weight: 500;
	}

	.fact-quote {
		margin-top: 1.5rem;
		padding-top: 1.25rem;
		border-top: 1px solid var(--color-border);
		display: flex;
		gap: 0.5rem;
		align-items: flex-start;
	}

	.fact-quote-mark {
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		font-style: italic;
		color: var(--color-accent);
		line-height: 0.8;
		opacity: 0.3;
		flex-shrink: 0;
	}

	.fact-quote-text {
		font-family: var(--font-display);
		font-size: var(--text-base);
		font-style: italic;
		font-weight: 300;
		line-height: 1.5;
		color: var(--color-muted);
		margin: 0;
	}
</style>
