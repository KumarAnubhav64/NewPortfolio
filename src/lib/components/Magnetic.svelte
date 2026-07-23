<script lang="ts">
	let {
		children,
		strength = 0.15,
		class: className = ''
	}: {
		children: import('svelte').Snippet;
		strength?: number;
		class?: string;
	} = $props();

	let el: HTMLElement | undefined = $state();
	let rect = $state({ left: 0, top: 0, width: 0, height: 0 });
	let offsetX = $state(0);
	let offsetY = $state(0);
	let isHovering = $state(false);

	function onEnter() {
		if (!el) return;
		rect = el.getBoundingClientRect();
		isHovering = true;
	}

	function onMove(e: MouseEvent) {
		if (!isHovering) return;
		const cx = rect.left + rect.width / 2;
		const cy = rect.top + rect.height / 2;
		offsetX = (e.clientX - cx) * strength;
		offsetY = (e.clientY - cy) * strength;
	}

	function onLeave() {
		isHovering = false;
		offsetX = 0;
		offsetY = 0;
	}
</script>

<div
	bind:this={el}
	class="magnetic {className}"
	class:magnetic--active={isHovering}
	onmouseenter={onEnter}
	onmousemove={onMove}
	onmouseleave={onLeave}
	role="presentation"
	style="--mx: {offsetX}px; --my: {offsetY}px"
>
	{@render children()}
</div>

<style>
	.magnetic {
		display: inline-flex;
		transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.magnetic--active {
		transform: translate(var(--mx), var(--my));
	}
</style>
