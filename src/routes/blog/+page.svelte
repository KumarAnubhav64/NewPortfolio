<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import Eyebrow from '$lib/components/Eyebrow.svelte';
	import type { Post } from '$lib/posts';

	let { data }: { data: { posts: Post[] } } = $props();
</script>

<svelte:head>
	<title>Writing — Kumar Anubhav</title>
	<meta
		name="description"
		content="Notes and deep-dives on building production software for $0 — face recognition, LLM patterns, free-tier architecture."
	/>
</svelte:head>

<Nav />

<main class="blog-page">
	<div class="container">
		<header class="blog-header">
			<Eyebrow>Writing</Eyebrow>
			<h1 class="blog-title">
				Notes on building <em class="blog-em">for real</em>
			</h1>
			<p class="blog-sub">
				Deep-dives on the projects in this portfolio — the tradeoffs, the free-tier math, and the
				patterns worth stealing. No filler.
			</p>
		</header>

		<div class="post-list">
			{#each data.posts as post}
				<a class="post-card" href={`/blog/${post.slug}`}>
					<div class="post-meta">
						<time datetime={post.date}>{post.date}</time>
						<span class="post-dot" aria-hidden="true">·</span>
						<span>{post.readingMinutes} min read</span>
					</div>
					<h2 class="post-title">{post.title}</h2>
					<p class="post-excerpt">{post.excerpt}</p>
					<div class="post-tags">
						{#each post.tags as tag}
							<span class="post-tag">{tag}</span>
						{/each}
					</div>
					<span class="post-read">Read the post →</span>
				</a>
			{/each}
		</div>
	</div>
</main>

<Footer />

<style>
	.blog-page {
		padding: 4rem 0 6rem;
	}

	.blog-header {
		max-width: 640px;
		margin-bottom: 3.5rem;
	}

	.blog-title {
		font-family: var(--font-display);
		font-size: clamp(var(--text-3xl), 4vw, var(--text-5xl));
		font-weight: 300;
		line-height: 1.15;
		color: var(--color-ink);
		margin-top: 0.75rem;
	}

	.blog-em {
		font-style: italic;
		color: var(--color-accent);
	}

	.blog-sub {
		font-family: var(--font-body);
		font-size: var(--text-lg);
		line-height: 1.6;
		color: var(--color-muted);
		margin-top: 1rem;
	}

	.post-list {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	.post-card {
		display: flex;
		flex-direction: column;
		padding: 1.75rem;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		text-decoration: none;
		transition: transform 0.35s var(--ease-out), box-shadow 0.35s var(--ease-out),
			border-color 0.35s var(--ease-out);
	}

	.post-card:hover {
		transform: translateY(-3px);
		box-shadow: 0 12px 32px rgba(30, 36, 48, 0.08);
		border-color: var(--color-accent);
	}

	.post-meta {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-body);
		font-size: var(--text-xs);
		letter-spacing: 0.04em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	.post-dot {
		opacity: 0.5;
	}

	.post-title {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		font-weight: 400;
		line-height: 1.25;
		color: var(--color-ink);
		margin-top: 0.75rem;
		transition: color 0.3s;
	}

	.post-card:hover .post-title {
		color: var(--color-accent);
	}

	.post-excerpt {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.65;
		color: var(--color-muted);
		margin-top: 0.6rem;
	}

	.post-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-top: 1rem;
	}

	.post-tag {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		padding: 0.25rem 0.6rem;
		border-radius: 999px;
		background: var(--color-bg-alt);
		color: var(--color-muted);
	}

	.post-read {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-accent);
		margin-top: auto;
		padding-top: 1.25rem;
	}

	@media (max-width: 768px) {
		.post-list {
			grid-template-columns: 1fr;
		}
	}
</style>
