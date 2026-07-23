<script lang="ts">
	let ring = $state<HTMLElement | undefined>();
	let dot = $state<HTMLElement | undefined>();
	let isHovering = $state(false);
	let isVisible = $state(false);
	let isTouch = $state(typeof window !== 'undefined' && 'ontouchstart' in window);

	function onMouseMove(e: MouseEvent) {
		if (!isVisible) isVisible = true;
		if (ring) {
			ring.style.transform = `translate(${e.clientX - 12}px, ${e.clientY - 12}px)`;
		}
		if (dot) {
			dot.style.transform = `translate(${e.clientX - 3}px, ${e.clientY - 3}px)`;
		}
	}

	function onMouseLeave() {
		isVisible = false;
	}

	function updateHoverState(e: MouseEvent) {
		const target = e.target as HTMLElement;
		isHovering = !!target.closest('a, button, .project-card, .skill-tag, .btn, input, textarea');
	}

	$effect(() => {
		if (isTouch) return;
		document.documentElement.style.cursor = 'none';

		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseover', updateHoverState);
		document.addEventListener('mouseleave', onMouseLeave);

		return () => {
			document.documentElement.style.cursor = '';
			document.removeEventListener('mousemove', onMouseMove);
			document.removeEventListener('mouseover', updateHoverState);
			document.removeEventListener('mouseleave', onMouseLeave);
		};
	});
</script>

{#if !isTouch}
	<div
		bind:this={ring}
		class="cursor-ring"
		class:cursor-ring--visible={isVisible}
		class:cursor-ring--hover={isHovering}
	></div>
	<div
		bind:this={dot}
		class="cursor-dot"
		class:cursor-dot--visible={isVisible}
		class:cursor-dot--hover={isHovering}
	></div>
{/if}

<style>
	.cursor-ring {
		position: fixed;
		pointer-events: none;
		z-index: 9999;
		width: 24px;
		height: 24px;
		border: 1.5px solid var(--color-accent);
		border-radius: 50%;
		opacity: 0;
		transition: width 0.3s var(--ease-out),
					height 0.3s var(--ease-out),
					opacity 0.3s var(--ease-out),
					background-color 0.3s var(--ease-out),
					border-color 0.3s var(--ease-out);
		mix-blend-mode: difference;
		will-change: transform;
	}

	.cursor-ring--visible {
		opacity: 0.6;
	}

	.cursor-ring--hover {
		width: 48px;
		height: 48px;
		opacity: 0.3;
		background: var(--color-accent);
		border-color: var(--color-accent);
	}

	.cursor-dot {
		position: fixed;
		pointer-events: none;
		z-index: 10000;
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-accent);
		opacity: 0;
		transition: opacity 0.2s var(--ease-out),
					width 0.2s var(--ease-out),
					height 0.2s var(--ease-out),
					background-color 0.2s var(--ease-out);
		mix-blend-mode: difference;
		will-change: transform;
	}

	.cursor-dot--visible {
		opacity: 1;
	}

	.cursor-dot--hover {
		width: 10px;
		height: 10px;
		background: var(--color-accent);
	}
</style>
