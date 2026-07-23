<script lang="ts">
	import TagPill from './TagPill.svelte';

	let {
		number,
		title,
		description,
		tag,
		href = '#',
		imageUrl
	}: {
		number: string;
		title: string;
		description: string;
		tag: string;
		href?: string;
		imageUrl?: string;
	} = $props();
</script>

<article class="project-card">
	<div class="card-browser">
		<div class="browser-bar">
			<span class="browser-dot"></span>
			<span class="browser-dot"></span>
			<span class="browser-dot"></span>
		</div>
		<div class="card-image">
			{#if imageUrl}
				<img src={imageUrl} alt={title} />
			{:else}
				<div class="image-placeholder">
					<span class="placeholder-label">{title}</span>
				</div>
			{/if}
		</div>
	</div>
	<div class="card-body">
		<span class="card-number">{number}</span>
		<h3 class="card-title">{title}</h3>
		<p class="card-description">{description}</p>
		<div class="card-footer">
			<TagPill>{tag}</TagPill>
			<a {href} class="card-link">View case →</a>
		</div>
	</div>
</article>

<style>
	.project-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		overflow: hidden;
		transition: transform 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out);
	}

	.project-card:hover {
		transform: translateY(-4px);
		box-shadow: 0 12px 40px rgba(0,0,0,0.06);
	}

	.card-browser {
		border-bottom: 1px solid var(--color-border);
	}

	.browser-bar {
		display: flex;
		gap: 6px;
		padding: 12px 16px;
		background: var(--color-bg);
	}

	.browser-dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		background: var(--color-border);
	}

	.browser-dot:first-child { background: #fc5f5f; }
	.browser-dot:nth-child(2) { background: #fdbc40; }
	.browser-dot:nth-child(3) { background: #34c749; }

	.card-image {
		width: 100%;
		aspect-ratio: 16 / 10;
		overflow: hidden;
	}

	.card-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 0.6s var(--ease-out);
	}

	.project-card:hover .card-image img {
		transform: scale(1.03);
	}

	.image-placeholder {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		background: linear-gradient(135deg, var(--color-bg) 0%, var(--color-bg-alt) 100%);
	}

	.placeholder-label {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		color: var(--color-muted);
		font-style: italic;
	}

	.card-body {
		padding: var(--space-card);
	}

	.card-number {
		display: block;
		font-family: var(--font-display);
		font-size: var(--text-sm);
		font-style: italic;
		color: var(--color-accent);
		margin-bottom: 0.5rem;
	}

	.card-title {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-weight: 300;
		margin-bottom: 0.75rem;
		color: var(--color-ink);
	}

	.card-description {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--color-muted);
		margin-bottom: 1.25rem;
		max-width: 100%;
	}

	.card-footer {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

	.card-link {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-accent);
		transition: opacity 0.2s;
	}

	.card-link:hover {
		opacity: 0.7;
	}
</style>
