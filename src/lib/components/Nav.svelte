<script lang="ts">
	import Button from './Button.svelte';

	let mobileMenuOpen = $state(false);

	const navLinks = [
		{ label: 'Work', href: '#work' },
		{ label: 'How I Work', href: '#how-i-work' },
		{ label: 'Skills', href: '#skills' },
		{ label: 'About', href: '#about' },
		{ label: 'Contact', href: '#contact' }
	];

	function closeMenu() {
		mobileMenuOpen = false;
	}
</script>

<nav class="nav" aria-label="Main navigation">
	<div class="nav-inner container">
		<a href="/" class="nav-logo">
			<span class="logo-mark">KA</span>
			<span class="logo-name">Kumar Anubhav</span>
		</a>

		<button
			class="mobile-toggle"
			onclick={() => mobileMenuOpen = !mobileMenuOpen}
			aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={mobileMenuOpen}
		>
			<span class="toggle-bar" class:toggle-bar--open={mobileMenuOpen}></span>
			<span class="toggle-bar" class:toggle-bar--open={mobileMenuOpen}></span>
		</button>

		<div class="nav-links" class:nav-links--open={mobileMenuOpen}>
			{#each navLinks as link}
				<a href={link.href} class="nav-link" onclick={closeMenu}>{link.label}</a>
			{/each}
		</div>

		<div class="nav-actions">				<Button variant="secondary" href="/resume.pdf" download>Resumé</Button>
		</div>
	</div>
</nav>

<style>
	.nav {
		padding: 1.25rem 0;
		position: sticky;
		top: 0;
		z-index: 100;
		background: rgba(234, 235, 238, 0.9);
		backdrop-filter: blur(12px);
	}

	.nav-inner {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.nav-logo {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		text-decoration: none;
		margin-right: auto;
		flex-shrink: 0;
	}

	.logo-mark {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 36px;
		height: 36px;
		border-radius: 50%;
		background: var(--color-ink);
		color: #fff;
		font-family: var(--font-display);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.05em;
	}

	.logo-name {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		color: var(--color-ink);
	}

	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.75rem;
		transition: all 0.3s var(--ease-out);
	}

	.nav-link {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-muted);
		text-decoration: none;
		transition: color 0.2s;
		position: relative;
	}

	.nav-link::after {
		content: '';
		position: absolute;
		bottom: -2px;
		left: 0;
		width: 0;
		height: 1px;
		background: var(--color-accent);
		transition: width 0.3s var(--ease-out);
	}

	.nav-link:hover {
		color: var(--color-ink);
	}

	.nav-link:hover::after {
		width: 100%;
	}

	.nav-actions {
		flex-shrink: 0;
	}

	/* Mobile toggle */
	.mobile-toggle {
		display: none;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 5px;
		width: 36px;
		height: 36px;
		padding: 6px;
		background: none;
		border: 1px solid var(--color-border);
		border-radius: var(--radius-sm);
		cursor: pointer;
		z-index: 110;
	}

	.toggle-bar {
		display: block;
		width: 20px;
		height: 2px;
		background: var(--color-ink);
		border-radius: 1px;
		transition: all 0.3s var(--ease-out);
	}

	.toggle-bar--open:first-child {
		transform: rotate(45deg) translate(5px, 5px);
	}

	.toggle-bar--open:last-child {
		transform: rotate(-45deg) translate(5px, -5px);
	}

	@media (max-width: 768px) {
		.mobile-toggle {
			display: flex;
		}

		.nav-links {
			position: fixed;
			top: 0;
			right: -100%;
			width: 75%;
			max-width: 320px;
			height: 100vh;
			height: 100dvh;
			flex-direction: column;
			justify-content: center;
			gap: 2rem;
			background: var(--color-surface);
			border-left: 1px solid var(--color-border);
			padding: 2rem;
			transition: right 0.4s var(--ease-out);
			box-shadow: -8px 0 30px rgba(0,0,0,0.06);
		}

		.nav-links--open {
			right: 0;
		}

		.nav-link {
			font-size: var(--text-lg);
		}

		.nav-actions {
			display: none;
		}
	}
</style>
