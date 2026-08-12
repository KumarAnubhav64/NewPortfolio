<script lang="ts">
	import Logo from './Logo.svelte';
	import { page } from '$app/state';
	import { navigateToSection } from '$lib/utils/smoothNavigate';
	import { sectionLinks } from '$lib/sectionLinks';

	// Section links only exist on the home page; sub-routes (e.g. /blog) skip them.
	const isHome = $derived(page.url.pathname === '/');
	const links = $derived(isHome ? sectionLinks : []);

	function handleSectionClick(e: MouseEvent, sectionId: string) {
		e.preventDefault();
		navigateToSection(sectionId);
	}
</script>

<footer class="footer">
	<div class="container">
		<div class="footer-top">
			<div class="footer-brand">
				<Logo size={21} />
			</div>
			<div class="footer-info">
				<span class="footer-copyright">© {new Date().getFullYear()} Kumar Anubhav.</span>
				<span class="footer-credit">Built with Go, TypeScript &amp; Svelte.</span>
			</div>
		</div>

		{#if links.length > 0}
			<nav class="footer-links" aria-label="Site sections">
				{#each links as link}
					<a
						href={link.href}
						class="footer-link"
						onclick={(e) => handleSectionClick(e, link.href.slice(1))}
					>{link.label}</a>
				{/each}
			</nav>
		{/if}
	</div>
</footer>

<style>
	.footer {
		padding: 3rem 0;
		border-top: 1px solid var(--color-border);
	}

	.footer-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.footer-brand {
		display: flex;
		align-items: center;
	}

	.footer-info {
		display: flex;
		align-items: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.footer-copyright {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-muted);
	}

	.footer-credit {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-muted);
		font-style: italic;
	}

	.footer-links {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 1.75rem;
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.footer-link {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-muted);
		text-decoration: none;
		transition: color 0.2s;
		position: relative;
	}

	.footer-link::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 0;
		height: 1px;
		background: var(--color-accent);
		transition: width 0.3s var(--ease-out);
	}

	.footer-link:hover {
		color: var(--color-ink);
	}

	.footer-link:hover::after {
		width: 100%;
	}
</style>
