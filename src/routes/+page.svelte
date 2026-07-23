<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Hero from '$lib/components/Hero.svelte';
	import SelectedWork from '$lib/components/SelectedWork.svelte';
	import HowIWork from '$lib/components/HowIWork.svelte';
	import Skills from '$lib/components/Skills.svelte';
	import About from '$lib/components/About.svelte';
	import Contact from '$lib/components/Contact.svelte';
	import Footer from '$lib/components/Footer.svelte';
</script>

<svelte:head>
	<title>Kumar Anubhav — Full Stack Developer</title>
	<meta name="description" content="Full-stack developer specializing in Python, Go, and TypeScript with cloud-native infrastructure. CSE @ IIIT Ranchi." />
</svelte:head>

<Nav />
<Hero />
<SelectedWork />
<HowIWork />
<Skills />
<About />
<Contact />
<Footer />
