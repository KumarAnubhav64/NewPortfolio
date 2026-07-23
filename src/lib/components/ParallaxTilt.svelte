<script lang="ts">
	let {
		children,
		class: className = ''
	}: {
		children: import('svelte').Snippet;
		class?: string;
	} = $props();

	let el: HTMLElement | undefined = $state();
	let tiltX = $state(0);
	let tiltY = $state(0);
	let isHovering = $state(false);

	function onMove(e: MouseEvent) {
		if (!el) return;
		const rect = el.getBoundingClientRect();
		const cx = rect.x + rect.width / 2;
		const cy = rect.y + rect.height / 2;
		const dx = (e.clientX - cx) / rect.width;
		const dy = (e.clientY - cy) / rect.height;
		tiltX = dy * -6;
		tiltY = dx * 6;
	}

	function onEnter() {
		isHovering = true;
	}

	function onLeave() {
		isHovering = false;
		tiltX = 0;
		tiltY = 0;
	}
</script>

<div
	bind:this={el}
	class="parallax-tilt {className}"
	class:parallax-tilt--active={isHovering}
	onmousemove={onMove}
	onmouseenter={onEnter}
	onmouseleave={onLeave}
	role="presentation"
	style="--tx: {tiltY}px; --ty: {tiltX}px"
>
	{@render children()}
</div>

<style>
	.parallax-tilt {
		transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
		transform-style: preserve-3d;
		will-change: transform;
	}

	.parallax-tilt--active {
		transform: translate(var(--tx), var(--ty));
	}
</style>
