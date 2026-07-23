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

<div class="step-card">
	<div class="step-header">
		<span class="step-number">{number}</span>
		<div class="step-rule"></div>
	</div>
	<h3 class="step-title">{title}</h3>
	<p class="step-description">{description}</p>
</div>

<style>
	.step-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		padding: 1.75rem;
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		transition: transform 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out);
	}

	.step-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.04);
	}

	.step-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.step-number {
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		font-style: italic;
		font-weight: 300;
		color: var(--color-accent);
		line-height: 1;
	}

	.step-rule {
		flex: 1;
		height: 1px;
		background: var(--color-border);
		min-width: 1.5rem;
	}

	.step-title {
		font-family: var(--font-body);
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-ink);
		margin-bottom: 0.5rem;
	}

	.step-description {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--color-muted);
	}

	@media (max-width: 600px) {
		.step-card {
			padding: 1.25rem;
		}
	}
</style>
