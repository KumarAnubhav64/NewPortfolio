<script lang="ts">
	let {
		variant = 'underline',
		class: className = ''
	}: {
		variant?: 'underline' | 'squiggle' | 'arrow' | 'star' | 'sparkle';
		class?: string;
	} = $props();
</script>

{#if variant === 'underline'}
	<svg class="accent {className}" width="120" height="16" viewBox="0 0 120 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<path d="M2 12.5c8-2 16-4 24-3s16 3 24 2 16-3 24-2 16 2 22 1" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.3"/>
	</svg>
{:else if variant === 'squiggle'}
	<svg class="accent {className}" width="80" height="20" viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<path d="M2 10c6-4 12 4 18 0s12-4 18 0 12 4 18 0 12-4 22 0" stroke="var(--color-accent)" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.25"/>
	</svg>
{:else if variant === 'arrow'}
	<svg class="accent {className}" width="60" height="30" viewBox="0 0 60 30" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<path d="M2 26c10-4 20-12 30-16s14-6 26-6" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.3"/>
		<path d="M52 6l6-4-2 8" stroke="var(--color-accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="0.3"/>
	</svg>
{:else if variant === 'star'}
	<svg class="accent {className}" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<path d="M12 2l-2 8-8 2 8 2 2 8 2-8 8-2-8-2-2-8z" stroke="var(--color-accent)" stroke-width="1.8" stroke-linejoin="round" fill="none" opacity="0.35"/>
	</svg>
{:else if variant === 'sparkle'}
	<svg class="accent {className}" width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
		<path d="M16 4c-1 5-6 10-12 12 6 2 11 7 12 12 1-5 6-10 12-12-6-2-11-7-12-12z" stroke="var(--color-accent)" stroke-width="1.8" stroke-linejoin="round" fill="none" opacity="0.3"/>
	</svg>
{/if}

<style>
	.accent {
		display: inline-block;
		flex-shrink: 0;
	}
</style>
