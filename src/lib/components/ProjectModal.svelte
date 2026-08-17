<script lang="ts">
	import { tick } from 'svelte';
	import { fade, fly } from 'svelte/transition';
	import TagPill from './TagPill.svelte';

	interface ProjectLink {
		label: string;
		href: string;
	}

	interface Project {
		number: string;
		title: string;
		tag: string;
		imageUrl?: string;
		description: string;
		whatIDid: string[];
		stack: string;
		links: ProjectLink[];
	}

	let { project, onClose }: { project: Project; onClose: () => void } = $props();

	let dialog = $state<HTMLElement | undefined>();

	$effect(() => {
		document.body.style.overflow = 'hidden';
		tick().then(() => dialog?.focus());
		return () => {
			document.body.style.overflow = '';
		};
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onClose();
			return;
		}
		// Keep focus inside the dialog while tabbing
		if (e.key === 'Tab' && dialog) {
			const focusables = dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
			if (focusables.length === 0) return;
			const first = focusables[0];
			const last = focusables[focusables.length - 1];
			if (e.shiftKey && document.activeElement === first) {
				e.preventDefault();
				last.focus();
			} else if (!e.shiftKey && document.activeElement === last) {
				e.preventDefault();
				first.focus();
			}
		}
	}

	function handleBackdropClick(e: MouseEvent) {
		if (e.target === e.currentTarget) onClose();
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div
	class="modal-backdrop"
	role="presentation"
	onclick={handleBackdropClick}
	transition:fade={{ duration: 160 }}
>
	<div
		class="modal-panel"
		role="dialog"
		aria-modal="true"
		aria-labelledby="modal-title"
		tabindex="-1"
		bind:this={dialog}
		transition:fly={{ y: 18, duration: 260 }}
	>
		<button class="modal-close" onclick={onClose} aria-label="Close project details">
			<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
				<path d="M2 2l10 10M12 2L2 12" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
			</svg>
		</button>

		<header class="modal-header">
			<div class="modal-meta">
				<span class="modal-number">{project.number}</span>
				<TagPill>{project.tag}</TagPill>
			</div>
			<h3 class="modal-title" id="modal-title">{project.title}</h3>
			<p class="modal-summary">{project.description}</p>
		</header>

		<div class="modal-body">
			<h4 class="modal-section-title">What I did</h4>
			<ul class="modal-list">
				{#each project.whatIDid as item}
					<li class="modal-list-item">
						<svg class="list-check" width="14" height="14" viewBox="0 0 14 14" fill="none">
							<path d="M2.5 7.5L5.5 10.5L11.5 3.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						<span>{item}</span>
					</li>
				{/each}
			</ul>

			<h4 class="modal-section-title">Stack</h4>
			<div class="stack-row">
				{#each project.stack.split(' · ') as tech}
					<span class="stack-chip">{tech}</span>
				{/each}
			</div>
		</div>

		{#if project.links.length > 0}
			<footer class="modal-footer">
				{#each project.links as link}
					<a class="modal-link" href={link.href} target="_blank" rel="noopener noreferrer">
						{link.label}
						<svg width="14" height="14" viewBox="0 0 16 16" fill="none">
							<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</a>
				{/each}
			</footer>
		{/if}
	</div>
</div>

<style>
	.modal-backdrop {
		position: fixed;
		inset: 0;
		z-index: 300;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1.5rem;
		background: rgba(22, 24, 25, 0.45);
		backdrop-filter: blur(4px);
		-webkit-backdrop-filter: blur(4px);
	}

	.modal-panel {
		position: relative;
		width: 100%;
		max-width: 640px;
		max-height: min(82vh, 760px);
		overflow-y: auto;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		padding: 2.25rem;
		box-shadow: 0 24px 80px rgba(0,0,0,0.18);
	}

	.modal-close {
		position: absolute;
		top: 1rem;
		right: 1rem;
		width: 34px;
		height: 34px;
		display: flex;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		border: 1px solid var(--color-border);
		background: var(--color-bg);
		color: var(--color-muted);
		cursor: pointer;
		transition: color 0.2s, border-color 0.2s, transform 0.2s var(--ease-out);
	}

	.modal-close:hover {
		color: var(--color-ink);
		border-color: var(--color-muted);
		transform: rotate(90deg);
	}

	.modal-meta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		margin-bottom: 0.75rem;
	}

	.modal-number {
		font-family: var(--font-display);
		font-size: var(--text-sm);
		font-style: italic;
		color: var(--color-accent);
	}

	.modal-title {
		font-family: var(--font-display);
		font-size: var(--text-3xl);
		font-weight: 300;
		line-height: 1.15;
		color: var(--color-ink);
		padding-right: 2.5rem;
	}

	.modal-summary {
		font-family: var(--font-body);
		font-size: var(--text-base);
		line-height: 1.65;
		color: var(--color-muted);
		margin-top: 1rem;
	}

	.modal-body {
		margin-top: 1.75rem;
	}

	.modal-section-title {
		font-family: var(--font-display);
		font-size: var(--text-lg);
		font-weight: 400;
		font-style: italic;
		color: var(--color-ink);
		margin-bottom: 0.75rem;
	}

	.modal-section-title + .modal-list {
		margin-top: 0;
	}

	.modal-list {
		list-style: none;
		margin: 0 0 1.75rem;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 0.6rem;
	}

	.modal-list-item {
		display: flex;
		gap: 0.6rem;
		align-items: flex-start;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--color-ink);
	}

	.list-check {
		flex-shrink: 0;
		margin-top: 0.3rem;
		color: var(--color-accent);
	}

	.stack-row {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
		margin-bottom: 2rem;
	}

	.stack-chip {
		padding: 0.3rem 0.7rem;
		border-radius: 100px;
		background: var(--color-bg);
		border: 1px solid var(--color-border);
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-muted);
	}

	.modal-footer {
		display: flex;
		flex-wrap: wrap;
		gap: 0.75rem;
		padding-top: 1.5rem;
		border-top: 1px solid var(--color-border);
	}

	.modal-link {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.7rem 1.25rem;
		border-radius: var(--radius-lg);
		border: 1.5px solid var(--color-accent);
		background: var(--color-accent);
		color: #ffffff;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		text-decoration: none;
		transition: background-color 0.25s, border-color 0.25s, transform 0.25s var(--ease-out);
	}

	.modal-link:hover {
		background: var(--color-accent-dark);
		border-color: var(--color-accent-dark);
		transform: translateY(-1px);
	}

	.modal-link svg {
		transition: transform 0.25s var(--ease-out);
	}

	.modal-link:hover svg {
		transform: translateX(3px);
	}

	@media (max-width: 600px) {
		.modal-panel {
			padding: 1.5rem;
		}

		.modal-title {
			font-size: var(--text-2xl);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.modal-close,
		.modal-link,
		.modal-link svg {
			transition: none;
		}
	}
</style>
