<script lang="ts">
	let {
		number,
		title,
		description
	}: {
		number: string;
		title: string;
		description: string;
	} = $props();
</script>

<div class="step">
	<span class="step-number">{number}</span>
	<div class="step-rule"></div>
	<h3 class="step-title">{title}</h3>
	<p class="step-description">{description}</p>
</div>

<style>
	.step {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.step-number {
		font-family: var(--font-display);
		font-size: var(--text-4xl);
		font-style: italic;
		font-weight: 300;
		color: var(--color-accent);
		line-height: 1;
	}

	.step-rule {
		width: 2rem;
		height: 2px;
		background: var(--color-border);
		margin: 0.5rem 0;
	}

	.step-title {
		font-family: var(--font-body);
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-ink);
		margin-bottom: 0.25rem;
	}

	.step-description {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--color-muted);
		max-width: 280px;
	}
</style>
