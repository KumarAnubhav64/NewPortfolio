<script lang="ts">
	import SectionHeadline from './SectionHeadline.svelte';
	import ScrollReveal from './ScrollReveal.svelte';

	import japaneseImg from '$lib/assets/hobby-japanese.jpg';
	import gamingImg from '$lib/assets/hobby-gaming.jpg';
	import roboticsImg from '$lib/assets/hobby-robotics.jpg';
	import electronicsImg from '$lib/assets/hobby-electronics.jpg';

	const hobbies = [
		{
			title: 'Learning Japanese',
			description: 'Kanji drills, immersion listening, and slowly levelling up toward JLPT fluency.',
			imageUrl: japaneseImg
		},
		{
			title: 'Gaming',
			description: 'Competitive shooters to open worlds — reflexes, strategy, and good stories.',
			imageUrl: gamingImg
		},
		{
			title: 'Robotics',
			description: 'Building bots as head of the IoT & Robotics Club — sensors, motors, and motion.',
			imageUrl: roboticsImg
		},
		{
			title: 'Repairing Electronics',
			description: 'Soldering, reviving dead boards, and fixing what everyone else gave up on.',
			imageUrl: electronicsImg
		}
	];
</script>

<section id="hobbies" class="section section-anchor">
	<div class="container">
		<SectionHeadline
			eyebrow="Hobbies"
			headline="Off the clock, I'm learning, playing, and taking things apart."
			italicWords={['learning', 'playing', 'apart']}
		>
			<p class="hobbies-sub">The tinkering that keeps me curious when the IDE is closed.</p>
		</SectionHeadline>

		<div class="hobbies-grid">
			{#each hobbies as hobby, i}
				<ScrollReveal delay={(i % 2) * 0.12}>
					<article class="hobby-card">
						<div class="hobby-image">
							<img src={hobby.imageUrl} alt="" width="800" height="500" loading="lazy" decoding="async" />
						</div>
						<div class="hobby-body">
							<h3 class="hobby-title">{hobby.title}</h3>
							<p class="hobby-description">{hobby.description}</p>
						</div>
					</article>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>

<style>
	.hobbies-sub {
		font-family: var(--font-body);
		font-size: var(--text-base);
		line-height: 1.6;
		color: var(--color-muted);
		max-width: 560px;
		margin-top: 1rem;
	}

	.hobbies-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 1.5rem;
	}

	.hobby-card {
		height: 100%;
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		overflow: hidden;
		transition: transform 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out);
	}

	.hobby-image {
		border-bottom: 1px solid var(--color-border);
	}

	.hobby-image img {
		width: 100%;
		height: auto;
		display: block;
		transition: transform 0.6s var(--ease-out);
	}

	.hobby-body {
		padding: 1.5rem;
	}

	.hobby-title {
		font-family: var(--font-display);
		font-size: var(--text-xl);
		font-weight: 300;
		color: var(--color-ink);
		margin-bottom: 0.5rem;
	}

	.hobby-description {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.6;
		color: var(--color-muted);
	}

	@media (hover: hover) {
		.hobby-card:hover {
			transform: translateY(-4px);
			box-shadow: 0 12px 40px rgba(0, 0, 0, 0.06);
		}

		.hobby-card:hover .hobby-image img {
			transform: scale(1.03);
		}
	}

	@media (max-width: 700px) {
		.hobbies-grid {
			grid-template-columns: 1fr;
		}

		.hobby-body {
			padding: 1.25rem;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hobby-card,
		.hobby-image img {
			transition: none;
		}
	}
</style>
