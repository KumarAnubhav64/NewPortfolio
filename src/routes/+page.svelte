<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import SelectedWork from '$lib/components/SelectedWork.svelte';
	import HowIWork from '$lib/components/HowIWork.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import Hobbies from '$lib/components/Hobbies.svelte';
	import About from '$lib/components/About.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import IntroReveal from '$lib/components/IntroReveal.svelte';
	import { scrollToTop } from '$lib/utils/smoothNavigate';

	let showBackToTop = $state(false);
	let showIntro = $state(true);

	$effect(() => {
		const onScroll = () => {
			showBackToTop = window.scrollY > 600;
		};
		window.addEventListener('scroll', onScroll, { passive: true });
		return () => window.removeEventListener('scroll', onScroll);
	});
</script>

<svelte:head>
	<title>Kumar Anubhav — Full Stack Developer</title>
	<meta name="description" content="Full-stack developer specializing in Python, Go, and TypeScript with cloud-native infrastructure. CSE @ IIIT Ranchi." />
</svelte:head>

<Nav />
<div class="page-main">
	<Hero />
	<SelectedWork />
	<HowIWork />
	<Skills />
	<Hobbies />
	<About />
	<Contact />
</div>
<Footer />

{#if showIntro}
	<IntroReveal onComplete={() => (showIntro = false)} />
{/if}

<button
	class="back-to-top"
	class:back-to-top--visible={showBackToTop}
	onclick={scrollToTop}
	aria-label="Scroll to top"
>
	<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
		<path d="M8 13V3M4 7l4-4 4 4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
	</svg>
</button>
