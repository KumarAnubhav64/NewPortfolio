<script lang="ts">
	import TagPill from './TagPill.svelte';

	let {
		number,
		title,
		description,
		tag,
		imageUrl,
		onSelect
	}: {
		number: string;
		title: string;
		description: string;
		tag: string;
		imageUrl?: string;
		onSelect: () => void;
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
				<img src={imageUrl} alt="" />
			{:else}
				<div class="image-placeholder">
					<span class="placeholder-label">{title}</span>
				</div>
			{/if}
			<div class="image-overlay">
				<span class="overlay-text">What I did</span>
				<svg class="overlay-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">
					<path d="M7 17l9-9M7 8h9v9" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
				</svg>
			</div>
		</div>
	</div>
	<div class="card-body">
		<span class="card-number">{number}</span>
		<h3 class="card-title">{title}</h3>
		<p class="card-description">{description}</p>
		<div class="card-footer">
			<TagPill>{tag}</TagPill>
		</div>
	</div>
	<button
		type="button"
		class="card-hit-area"
		onclick={onSelect}
		aria-label={`View details for ${title}`}
		aria-haspopup="dialog"
	></button>
</article>

<style>
	.project-card {
		position: relative;
		height: 100%;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		overflow: hidden;
		cursor: pointer;
		transition: transform 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out);
	}

	/* Whole-card click target (real button for accessibility) */
	.card-hit-area {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		border: none;
		background: transparent;
		cursor: pointer;
		z-index: 1;
	}

	.card-hit-area:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: -2px;
		border-radius: var(--radius-xl);
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
		position: relative;
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

	/* Sliding overlay */
	.image-overlay {
		position: absolute;
		inset: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: linear-gradient(to top, rgba(22,24,25,0.85) 0%, rgba(22,24,25,0.35) 100%);
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
		opacity: 0;
		transform: translateY(100%);
		transition: transform 0.5s var(--ease-out), opacity 0.4s var(--ease-out);
	}

	.project-card:focus-within .image-overlay {
		opacity: 1;
		transform: translateY(0);
	}

	.overlay-text {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		color: #ffffff;
		transform: translateY(8px);
		opacity: 0;
		transition: transform 0.4s var(--ease-out) 0.08s, opacity 0.3s var(--ease-out) 0.08s;
	}

	.project-card:focus-within .overlay-text {
		transform: translateY(0);
		opacity: 1;
	}

	.overlay-icon {
		color: #ffffff;
		opacity: 0.85;
		transform: translate(-6px, 8px);
		transition: transform 0.4s var(--ease-out) 0.12s, opacity 0.3s var(--ease-out) 0.12s;
	}

	.project-card:focus-within .overlay-icon {
		transform: translate(0, 0);
		opacity: 1;
	}

	/* Hover interactions — only on devices that actually hover */
	@media (hover: hover) {
		.project-card:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 40px rgba(0,0,0,0.06);
		}

		.project-card:hover .card-image img {
			transform: scale(1.05);
		}

		.project-card:hover .image-overlay {
			opacity: 1;
			transform: translateY(0);
		}

		.project-card:hover .overlay-text {
			transform: translateY(0);
			opacity: 1;
		}

		.project-card:hover .overlay-icon {
			transform: translate(0, 0);
			opacity: 1;
		}
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

	@media (max-width: 600px) {
		.card-body {
			padding: 1.25rem;
		}

		.card-title {
			font-size: var(--text-lg);
		}

		.card-description {
			font-size: var(--text-xs);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.project-card,
		.card-image img,
		.image-overlay,
		.overlay-text,
		.overlay-icon {
			transition: none;
		}
	}
</style>
