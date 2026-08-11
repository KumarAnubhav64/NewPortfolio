<script lang="ts">
	import Button from './Button.svelte';
	import Logo from './Logo.svelte';
	import { navigateToSection } from '$lib/utils/smoothNavigate';
	import { sectionLinks } from '$lib/sectionLinks';

	let mobileMenuOpen = $state(false);
	let isScrolled = $state(false);
	let activeSection = $state('');
	let menuId = $state('nav-menu');

	// Swipe-to-close gesture
	let drawerPanel = $state<HTMLElement | undefined>();
	let touchStartX = $state(0);
	let touchTranslateX = $state(0);
	let isDragging = $state(false);
	let panelWidth = $state(0);

	function handleTouchStart(e: TouchEvent) {
		if (!mobileMenuOpen) return;
		touchStartX = e.touches[0].clientX;
		isDragging = true;
		if (drawerPanel) {
			panelWidth = drawerPanel.offsetWidth;
			drawerPanel.style.transition = 'none';
		}
	}

	function handleTouchMove(e: TouchEvent) {
		if (!isDragging || !drawerPanel) return;

		// Prevent browser scroll and pull-to-refresh during swipe
		e.preventDefault();

		const currentX = e.touches[0].clientX;
		const deltaX = currentX - touchStartX;

		// Only allow rightward drag (to close); ignore leftward
		const dragOffset = Math.max(0, deltaX);
		touchTranslateX = dragOffset;

		const maxTranslate = panelWidth;
		const progress = Math.min(dragOffset / maxTranslate, 1);
		// Ease-in curve: drag starts fast and decelerates (feels like physical resistance)
		const easedOffset = maxTranslate * (1 - Math.pow(1 - progress, 2));

		drawerPanel.style.transform = `translateX(${easedOffset}px)`;

		// Fade the overlay proportionally
		const overlay = drawerPanel.parentElement?.querySelector('.nav-drawer-overlay') as HTMLElement;
		if (overlay) {
			const overlayOpacity = Math.max(0, 0.4 * (1 - progress));
			overlay.style.transition = 'none';
			overlay.style.opacity = String(overlayOpacity);
		}
	}

	function handleTouchEnd() {
		if (!isDragging || !drawerPanel) {
			isDragging = false;
			return;
		}
		isDragging = false;

		// Reset transitions
		drawerPanel.style.transition = '';
		const overlay = drawerPanel.parentElement?.querySelector('.nav-drawer-overlay') as HTMLElement;
		if (overlay) overlay.style.transition = '';

		// Close if dragged more than 30% of panel width or 80px
		const threshold = Math.max(80, panelWidth * 0.3);
		if (touchTranslateX > threshold) {
			closeMenu();
		} else {
			// Snap back — remove inline transform so CSS transition takes over
			drawerPanel.style.transform = '';
			if (overlay) overlay.style.opacity = '';
		}

		touchTranslateX = 0;
	}

	function handleTouchCancel() {
		if (!isDragging || !drawerPanel) return;
		isDragging = false;
		touchTranslateX = 0;

		// Reset all inline styles
		drawerPanel.style.transition = '';
		drawerPanel.style.transform = '';
		const overlay = drawerPanel.parentElement?.querySelector('.nav-drawer-overlay') as HTMLElement;
		if (overlay) {
			overlay.style.transition = '';
			overlay.style.opacity = '';
		}
	}

	function handleNavClick(e: MouseEvent, sectionId: string) {
		e.preventDefault();
		closeMenu();
		navigateToSection(sectionId);
	}

	function closeMenu() {
		mobileMenuOpen = false;
	}

	function toggleMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape' && mobileMenuOpen) {
			closeMenu();
		}
	}

	// Body scroll lock when mobile menu is open
	$effect(() => {
		if (mobileMenuOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
		return () => {
			document.body.style.overflow = '';
		};
	});

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

<svelte:window onkeydown={handleKeydown} />

<nav class="nav" class:nav--scrolled={isScrolled} class:nav--menu-open={mobileMenuOpen} aria-label="Main navigation">
	<div class="nav-inner container">
		<a href="/" class="nav-logo" aria-label="Kumar Anubhav — Home">
			<Logo size={24} decorative />
		</a>

		<button
			class="mobile-toggle"
			onclick={toggleMenu}
			aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
			aria-expanded={mobileMenuOpen}
			aria-controls={menuId}
		>
			<span class="toggle-bar" class:toggle-bar--open={mobileMenuOpen}></span>
			<span class="toggle-bar toggle-bar--mid" class:toggle-bar--open={mobileMenuOpen}></span>
			<span class="toggle-bar" class:toggle-bar--open={mobileMenuOpen}></span>
		</button>

		<!-- Desktop nav links -->
		<div class="nav-links">
			{#each sectionLinks as link}
				<a
					href={link.href}
					class="nav-link"
					class:nav-link--active={activeSection === link.href.slice(1)}
					onclick={(e) => handleNavClick(e, link.href.slice(1))}
				>{link.label}</a>
			{/each}
		</div>

		<div class="nav-actions">
			<Button variant="secondary" href="/resume.pdf" download>Resumé</Button>
		</div>
	</div>

	<!-- Mobile drawer -->
	<div
		id={menuId}
		class="nav-drawer"
		class:nav-drawer--open={mobileMenuOpen}
		role="dialog"
		aria-modal={mobileMenuOpen}
		aria-label="Navigation menu"
	>
		<button
			class="nav-drawer-overlay"
			onclick={closeMenu}
			aria-label="Close menu"
			tabindex={mobileMenuOpen ? 0 : -1}
		></button>

		<div class="nav-drawer-panel" class:nav-drawer-panel--dragging={isDragging}
			bind:this={drawerPanel}
			role="presentation"
			ontouchstart={handleTouchStart}
			ontouchmove={handleTouchMove}
			ontouchend={handleTouchEnd}
			ontouchcancel={handleTouchCancel}
		>
			<div class="nav-drawer-grip" aria-hidden="true">
				<span class="nav-drawer-grip-bar"></span>
			</div>

			<div class="nav-drawer-links">
				{#each sectionLinks as link, i}
					<a
						href={link.href}
						class="nav-link nav-link--drawer"
						class:nav-link--active={activeSection === link.href.slice(1)}
						style={mobileMenuOpen ? `transition-delay: ${i * 0.06}s` : ''}
						onclick={(e) => handleNavClick(e, link.href.slice(1))}
						role="menuitem"
					>{link.label}</a>
				{/each}
			</div>

			<div class="nav-drawer-footer">
				<Button variant="secondary" href="/resume.pdf" download>Resumé</Button>
			</div>
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
		-webkit-backdrop-filter: blur(12px);
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

	.nav-links {
		display: flex;
		align-items: center;
		gap: 1.75rem;
	}

	.nav-link {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-muted);
		text-decoration: none;
		transition: color 0.2s;
		position: relative;
		white-space: nowrap;
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
	}	/* ===========================================
	   Mobile Menu Toggle Button
	   =========================================== */
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
		position: relative;
		transition: border-color 0.3s var(--ease-out), background-color 0.3s var(--ease-out);
	}

	.mobile-toggle:hover {
		border-color: var(--color-muted);
		background: rgba(0,0,0,0.03);
	}

	.mobile-toggle:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
	}

	.toggle-bar {
		display: block;
		width: 20px;
		height: 2px;
		background: var(--color-ink);
		border-radius: 2px;
		transition: all 0.35s var(--ease-out);
		transform-origin: center;
	}

	/* 3-bar hamburger → X animation */
	/* 3-bar hamburger → X animation */
	.toggle-bar--open:first-child {
		transform: rotate(45deg) translateY(7px);
		width: 22px;
	}

	.toggle-bar--open:nth-child(2) {
		opacity: 0;
		transform: scaleX(0);
	}

	.toggle-bar--open:last-child {
		transform: rotate(-45deg) translateY(-7px);
		width: 22px;
	}

	/* ===========================================
	   Mobile Drawer (hidden on desktop)
	   =========================================== */
	.nav-drawer {
		display: none;
	}

	.nav-drawer-overlay {
		position: fixed;
		inset: 0;
		background: rgba(30, 36, 48, 0.4);
		backdrop-filter: blur(2px);
		-webkit-backdrop-filter: blur(2px);
		cursor: default;
		border: none;
		padding: 0;
		opacity: 0;
		pointer-events: none;
		transition: opacity 0.4s var(--ease-out);
		z-index: 1;
	}

	.nav-drawer--open .nav-drawer-overlay {
		opacity: 1;
		pointer-events: auto;
	}

	.nav-drawer-panel {
		position: fixed;
		top: 0;
		right: 0;
		width: 75%;
		max-width: 320px;
		height: 100vh;
		height: 100dvh;
		display: flex;
		flex-direction: column;
		background: var(--color-surface);
		border-left: 1px solid var(--color-border);
		padding: 5rem 2rem 2rem;
		box-shadow: -12px 0 40px rgba(0,0,0,0.08);
		transform: translateX(100%);
		transition: transform 0.45s var(--ease-out);
		z-index: 2;
		touch-action: pan-y;
		user-select: none;
		-webkit-user-select: none;
	}

	.nav-drawer-panel--dragging {
		transition: none !important;
	}

	.nav-drawer--open .nav-drawer-panel {
		transform: translateX(0);
	}

	/* ===========================================
	   Drag Handle Grip
	   =========================================== */
	.nav-drawer-grip {
		display: flex;
		justify-content: center;
		padding: 0.5rem 0 0.75rem;
		opacity: 0;
		transform: translateY(-8px);
		transition: opacity 0.5s var(--ease-out) 0.2s,
					transform 0.5s var(--ease-out) 0.2s;
	}

	.nav-drawer--open .nav-drawer-grip {
		opacity: 1;
		transform: translateY(0);
	}

	.nav-drawer-grip-bar {
		display: block;
		width: 36px;
		height: 4px;
		border-radius: 2px;
		background: var(--color-border);
		transition: background 0.3s var(--ease-out);
	}

	.nav-drawer-grip-bar {
		animation: grip-pulse 3s var(--ease-out) infinite;
		animation-delay: 0.7s;
	}

	@keyframes grip-pulse {
		0%, 100% {
			background: var(--color-border);
			transform: scaleX(1);
		}
		50% {
			background: var(--color-muted);
			transform: scaleX(1.15);
		}
	}

	.nav-drawer-links {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.5rem;
	}

	.nav-drawer-links .nav-link {
		font-size: var(--text-xl);
		padding: 0.75rem 0;
		width: 100%;
		white-space: normal;
		opacity: 0;
		transform: translateX(16px);
		transition: opacity 0.4s var(--ease-out),
					transform 0.4s var(--ease-out),
					color 0.2s;
	}

	.nav-drawer--open .nav-drawer-links .nav-link {
		opacity: 1;
		transform: translateX(0);
	}

	/* Override delay from inline style when closing */
	.nav-drawer:not(.nav-drawer--open) .nav-drawer-links .nav-link {
		transition-delay: 0s !important;
	}

	.nav-drawer-links .nav-link--active {
		color: var(--color-accent);
	}

	.nav-drawer-links .nav-link::after {
		display: none;
	}

	.nav-drawer-footer {
		margin-top: auto;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
		opacity: 0;
		transform: translateY(12px);
		transition: opacity 0.4s var(--ease-out) 0.35s,
					transform 0.4s var(--ease-out) 0.35s;
	}

	.nav-drawer--open .nav-drawer-footer {
		opacity: 1;
		transform: translateY(0);
	}

	/* Remove grip pulse when drawer is closing */
	.nav-drawer:not(.nav-drawer--open) .nav-drawer-grip-bar {
		animation: none;
	}

	/* Keep the wordmark and actions from overflowing on mid-size screens */
	@media (max-width: 1000px) {
		.nav-actions {
			display: none;
		}
	}

	@media (max-width: 900px) {
		:global(.nav-logo .logo) {
			--logo-size: 21px !important;
		}
	}

	@media (max-width: 768px) {
		.nav--menu-open {
			z-index: 200;
		}

		.mobile-toggle {
			display: flex;
		}

		.nav-links {
			display: none;
		}

		.nav-actions {
			display: none;
		}

		.nav-drawer {
			display: block;
			position: fixed;
			top: 0;
			right: 0;
			width: 100%;
			height: 100vh;
			height: 100dvh;
			z-index: 100;
			pointer-events: none;
		}

		.nav-drawer--open {
			pointer-events: auto;
		}
	}

	@media (max-width: 480px) {
		.nav-drawer-panel {
			width: 100%;
			max-width: 100%;
			border-left: none;
			padding: 5rem 1.5rem 1.5rem;
		}

		.nav-drawer-overlay {
			display: none;
		}

		.nav-drawer-links .nav-link {
			font-size: var(--text-2xl);
		}
	}
</style>
