<script lang="ts">
	let {
		children,
		delay = 0,
		class: className = ''
	}: {
		children: import('svelte').Snippet;
		delay?: number;
		class?: string;
	} = $props();

	let element: HTMLElement | undefined = $state();
	let isVisible = $state(false);

	$effect(() => {
		const el = element;
		if (!el) return;

		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					isVisible = true;
					observer.disconnect();
				}
			},
			{ threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
		);

		observer.observe(el);
		return () => observer.disconnect();
	});
</script>

<div
	bind:this={element}
	class="reveal {className}"
	class:reveal--visible={isVisible}
	style={delay > 0 ? `transition-delay: ${delay}s` : ''}
>
	{@render children()}
</div>

<style>
	.reveal {
		opacity: 0;
		transform: translateY(30px);
		transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1),
					transform 0.7s cubic-bezier(0.22, 1, 0.36, 1);
	}

	.reveal--visible {
		opacity: 1;
		transform: translateY(0);
	}
</style>
