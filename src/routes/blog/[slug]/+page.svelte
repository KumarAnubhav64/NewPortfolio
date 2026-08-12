<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import type { Post } from '$lib/posts';

	let { data }: { data: { post: Post; html: string } } = $props();
</script>

<svelte:head>
	<title>{data.post.title} — Kumar Anubhav</title>
	<meta name="description" content={data.post.excerpt} />
</svelte:head>

<Nav />

<main class="article-page">
	<div class="container">
		<a class="back-link" href="/blog">← All posts</a>

		<article class="article">
			<header class="article-header">
				<div class="article-meta">
					<time datetime={data.post.date}>{data.post.date}</time>
					<span class="meta-dot" aria-hidden="true">·</span>
					<span>{data.post.readingMinutes} min read</span>
				</div>
				<h1 class="article-title">{data.post.title}</h1>
				<div class="article-tags">
					{#each data.post.tags as tag}
						<span class="article-tag">{tag}</span>
					{/each}
				</div>
			</header>

			<div class="prose">{@html data.html}</div>
		</article>
	</div>
</main>

<Footer />

<style>
	.article-page {
		padding: 3rem 0 6rem;
	}

	.back-link {
		display: inline-block;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-muted);
		text-decoration: none;
		transition: color 0.2s;
		margin-bottom: 2.5rem;
	}

	.back-link:hover {
		color: var(--color-accent);
	}

	.article {
		max-width: 720px;
		margin: 0 auto;
	}

	.article-header {
		margin-bottom: 2.5rem;
	}

	.article-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-body);
		font-size: var(--text-xs);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	.meta-dot {
		opacity: 0.5;
	}

	.article-title {
		font-family: var(--font-display);
		font-size: clamp(var(--text-3xl), 4.5vw, var(--text-5xl));
		font-weight: 300;
		line-height: 1.15;
		color: var(--color-ink);
		margin-top: 0.75rem;
	}

	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 1.25rem;
	}

	.article-tag {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		background: var(--color-bg-alt);
		color: var(--color-muted);
	}

	/* ---------- prose ---------- */

	.prose {
		font-family: var(--font-body);
		font-size: var(--text-lg);
		line-height: 1.75;
		color: var(--color-ink);
	}

	/* The rendered markdown is injected via {@html}, so its elements are NOT
	   scoped — style them through :global() instead. */
	.prose :global(h1) {
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		font-weight: 400;
		line-height: 1.2;
		margin: 2.5rem 0 1rem;
	}

	.prose :global(h2) {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		font-weight: 400;
		line-height: 1.25;
		margin: 2.5rem 0 0.9rem;
	}

	.prose :global(h3) {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-weight: 500;
		margin: 2rem 0 0.75rem;
	}

	.prose :global(p) {
		margin: 1rem 0;
	}

	.prose :global(a) {
		color: var(--color-accent);
		text-decoration: underline;
		text-underline-offset: 3px;
		text-decoration-thickness: 1px;
		transition: text-decoration-color 0.2s;
	}

	.prose :global(a:hover) {
		text-decoration-color: transparent;
	}

	.prose :global(strong) {
		font-weight: 600;
		color: var(--color-ink);
	}

	.prose :global(em) {
		font-style: italic;
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: 1rem 0;
		padding-left: 1.5rem;
	}

	.prose :global(ul) {
		list-style: disc;
	}

	.prose :global(ol) {
		list-style: decimal;
	}

	.prose :global(li) {
		margin: 0.4rem 0;
	}

	.prose :global(li::marker) {
		color: var(--color-accent);
	}

	.prose :global(code) {
		font-family: ui-monospace, 'SF Mono', 'Cascadia Code', 'JetBrains Mono', Menlo, monospace;
		font-size: 0.85em;
		background: var(--color-bg-alt);
		padding: 0.15em 0.4em;
		border-radius: var(--radius-sm);
	}

	.prose :global(pre) {
		background: var(--color-cta);
		color: #e8eaf0;
		padding: 1.25rem 1.5rem;
		border-radius: var(--radius-lg);
		overflow-x: auto;
		margin: 1.5rem 0;
		font-size: var(--text-sm);
		line-height: 1.6;
	}

	.prose :global(pre code) {
		background: none;
		padding: 0;
		color: inherit;
		font-size: inherit;
	}

	.prose :global(blockquote) {
		border-left: 3px solid var(--color-accent);
		padding-left: 1.25rem;
		margin: 1.5rem 0;
		color: var(--color-muted);
		font-style: italic;
	}

	.prose :global(hr) {
		border: none;
		border-top: 1px solid var(--color-border);
		margin: 2.5rem 0;
	}

	.prose :global(table) {
		width: 100%;
		border-collapse: collapse;
		margin: 1.5rem 0;
		font-size: var(--text-sm);
	}

	.prose :global(th),
	.prose :global(td) {
		text-align: left;
		padding: 0.6rem 0.9rem;
		border: 1px solid var(--color-border);
	}

	.prose :global(th) {
		background: var(--color-bg-alt);
		font-weight: 600;
	}

	@media (max-width: 768px) {
		.prose {
			font-size: var(--text-base);
		}
	}
</style>
