/**
 * Smoothly scrolls to a section by its ID, using the View Transitions API
 * when available for a polished crossfade effect.
 *
 * Falls back to standard smooth scrolling in unsupported browsers.
 */
export function navigateToSection(sectionId: string): void {
	const el = document.getElementById(sectionId);
	if (!el) return;

	// Use View Transitions API when available (Chromium browsers)
	if (document.startViewTransition) {
		document.startViewTransition(() => {
			el.scrollIntoView({ behavior: 'instant', block: 'start' });
		});
	} else {
		el.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}
}

/**
 * Smoothly scrolls to the top of the page with View Transitions.
 */
export function scrollToTop(): void {
	if (document.startViewTransition) {
		document.startViewTransition(() => {
			window.scrollTo({ top: 0, behavior: 'instant' });
		});
	} else {
		window.scrollTo({ top: 0, behavior: 'smooth' });
	}
}
