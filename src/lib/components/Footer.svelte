<script lang="ts">
	import ScrollReveal from './ScrollReveal.svelte';
</script>

<footer class="footer">
	<div class="container">
		<ScrollReveal>
			<div class="footer-inner">
				<div class="footer-brand">
					<span class="logo-mark">KA</span>
					<span class="logo-name">Kumar Anubhav</span>
				</div>
				<div class="footer-info">
					<span class="footer-copyright">© {new Date().getFullYear()} Kumar Anubhav.</span>
					<span class="footer-credit">Built with Go, TypeScript & Svelte.</span>
				</div>
			</div>
		</ScrollReveal>
	</div>
</footer>

<style>
	.footer {
		padding: 3rem 0;
		border-top: 1px solid var(--color-border);
	}

	.footer-inner {
		display: flex;
		align-items: center;
		justify-content: space-between;
		flex-wrap: wrap;
		gap: 1.5rem;
	}

	.footer-brand {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}

	.logo-mark {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--color-ink);
		color: #fff;
		font-family: var(--font-display);
		font-size: 0.65rem;
		font-weight: 600;
		letter-spacing: 0.05em;
	}

	.logo-name {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-ink);
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
</style>
