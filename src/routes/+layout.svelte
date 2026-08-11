<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Cursor from '$lib/components/Cursor.svelte';
	import MusicPlayer from '$lib/components/MusicPlayer.svelte';

	let { children }: { children: import('svelte').Snippet } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} sizes="32x32" />
	<link rel="icon" href={favicon} sizes="16x16" />
</svelte:head>

<Cursor />
<MusicPlayer />
{@render children()}
