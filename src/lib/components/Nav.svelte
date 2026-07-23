<script lang="ts">
	import Button from './Button.svelte';

	let mobileMenuOpen = $state(false);
	let isScrolled = $state(false);
	let activeSection = $state('');

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

	$effect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				// Find the most visible section
				let maxRatio = 0;
				let maxId = '';
				for (const entry of entries) {
					if (entry.intersectionRatio > maxRatio) {
						maxRatio = entry.intersectionRatio;
						maxId = entry.target.id;
					}
				}
				if (maxId) activeSection = maxId;
			},
			{ threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5], rootMargin: '-80px 0px -30% 0px' }
		);

		const sections = document.querySelectorAll('section[id]');
		sections.forEach((s) => observer.observe(s));

		// Track scroll shadow
		const onScroll = () => {
			isScrolled = window.scrollY > 80;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		// Initial check
		onScroll();

		return () => {
			observer.disconnect();
			window.removeEventListener('scroll', onScroll);
		};
	});
</script>

<nav class="nav" class:nav--scrolled={isScrolled} aria-label="Main navigation">
	<div class="nav-inner container">
		<a href="/" class="nav-logo">
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
				<a
					href={link.href}
					class="nav-link"
					class:nav-link--active={activeSection === link.href.slice(1)}
					onclick={closeMenu}
				>{link.label}</a>
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
		transition: box-shadow 0.4s var(--ease-out), padding 0.3s var(--ease-out);
	}

	.nav--scrolled {
		box-shadow: 0 1px 0 var(--color-border);
		padding: 0.75rem 0;
	}

	.nav-inner {
		display: flex;
		align-items: center;
		gap: 2rem;
	}

	.nav-logo {
		display: flex;
		align-items: center;
		text-decoration: none;
		margin-right: auto;
		flex-shrink: 0;
	}

	.logo-name {
		font-family: var(--font-display);
		font-size: var(--text-base);
		font-weight: 400;
		color: var(--color-ink);
		letter-spacing: -0.01em;
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

	.nav-link--active {
		color: var(--color-ink);
	}

	.nav-link--active::after {
		width: 100%;
		background: var(--color-ink);
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
