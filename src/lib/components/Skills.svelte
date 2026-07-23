<script lang="ts">
	import Eyebrow from './Eyebrow.svelte';
	import ScrollReveal from './ScrollReveal.svelte';

	const categories = [
		{
			title: 'Languages',
			skills: ['Python', 'TypeScript', 'JavaScript', 'Go', 'SQL', 'Bash', 'C', 'C++']
		},
		{
			title: 'Frontend',
			skills: ['React.js', 'Svelte', 'TailwindCSS', 'HTML/CSS', 'Responsive Design']
		},
		{
			title: 'Backend & APIs',
			skills: ['FastAPI', 'Django', 'Flask', 'Express.js', 'RESTful APIs', 'Webhooks']
		},
		{
			title: 'Cloud & DevOps',
			skills: ['GCP (Cloud Run, Pub/Sub, Cloud SQL)', 'Firebase', 'Firestore', 'Linux', 'Git']
		},
		{
			title: 'Payments & Databases',
			skills: ['Stripe', 'Razorpay', 'PostgreSQL', 'Neon DB', 'Firestore']
		}
	];
</script>

<section id="skills" class="section section--alt section-anchor">
	<div class="container">
		<ScrollReveal>
			<div class="skills-header">
				<Eyebrow>Tech Stack</Eyebrow>
				<p class="header-quote">Technologies I work with to build <em class="headline-em">reliable</em> & <em class="headline-em">scalable</em> systems.</p>
			</div>
		</ScrollReveal>

		<div class="skills-grid">
			{#each categories as category, i}
				<ScrollReveal delay={i * 0.1}>
					<div class="skill-category">
						<h3 class="category-title">{category.title}</h3>
						<div class="skill-tags">
							{#each category.skills as skill}
								<span class="skill-tag">{skill}</span>
							{/each}
						</div>
					</div>
				</ScrollReveal>
			{/each}
		</div>
	</div>
</section>

<style>
	.skills-header {
		margin-bottom: 3rem;
	}

	.header-quote {
		font-family: var(--font-display);
		font-size: clamp(var(--text-2xl), 3.5vw, var(--text-4xl));
		font-style: italic;
		color: var(--color-ink);
		max-width: 600px;
		margin: 0;
		line-height: 1.3;
	}

	.skills-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.5rem;
	}

	.skill-category {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		padding: 1.5rem;
		transition: transform 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out);
	}

	.skill-category:hover {
		transform: translateY(-2px);
		box-shadow: 0 8px 24px rgba(0,0,0,0.04);
	}

	.category-title {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-accent);
		margin-bottom: 1rem;
	}

	.skill-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 0.5rem;
	}

	.skill-tag {
		display: inline-block;
		padding: 0.35rem 0.75rem;
		border-radius: 100px;
		background: var(--color-bg);
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 500;
		color: var(--color-ink);
		transition: all 0.2s;
	}

	.skill-tag:hover {
		background: var(--color-accent);
		color: #fff;
	}

	@media (max-width: 900px) {
		.skills-grid {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 600px) {
		.skills-grid {
			grid-template-columns: 1fr;
		}

		.skill-category {
			padding: 1.25rem;
		}

		.header-quote {
			font-size: var(--text-xl);
		}
	}
</style>
