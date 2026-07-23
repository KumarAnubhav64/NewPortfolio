<script lang="ts">
	let {
		quote,
		name,
		role
	}: {
		quote: string;
		name: string;
		role: string;
	} = $props();
</script>

<div class="testimonial-card">
	<span class="quote-mark">"</span>
	<blockquote class="quote-text">{quote}</blockquote>
	<div class="quote-author">
		<span class="quote-name">{name}</span>
		<span class="quote-role">{role}</span>
	</div>
</div>

<style>
	.testimonial-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		padding: 2rem;
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.quote-mark {
		font-family: var(--font-display);
		font-size: var(--text-5xl);
		font-style: italic;
		line-height: 0.6;
		color: var(--color-accent);
		opacity: 0.3;
	}

	.quote-text {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		line-height: 1.5;
		color: var(--color-ink);
		margin: 0;
		font-style: italic;
		font-weight: 300;
	}

	.quote-author {
		display: flex;
		flex-direction: column;
		gap: 0.15rem;
		margin-top: auto;
		padding-top: 1rem;
		border-top: 1px solid var(--color-border);
	}

	.quote-name {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		font-weight: 500;
		font-style: italic;
		color: var(--color-ink);
		letter-spacing: -0.01em;
	}

	.quote-role {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-muted);
		letter-spacing: 0.02em;
	}
</style>
