<script lang="ts">
	import Eyebrow from './Eyebrow.svelte';
	import TestimonialCard from './TestimonialCard.svelte';
	import ScrollReveal from './ScrollReveal.svelte';

	let currentIndex = $state(0);
	let isHovering = $state(false);
	const visibleCount = 3;

	const testimonials = [
		{
			quote: "Rahul has an extraordinary ability to simplify the most complex problems. He led our design system transformation with clarity, patience, and a relentless focus on user outcomes.",
			name: "Sarah Chen",
			role: "VP of Product, TechFlow Inc."
		},
		{
			quote: "Working with Rahul changed how our team thinks about design. He doesn't just deliver beautiful work — he builds the thinking and the process so the team can sustain it.",
			name: "Marcus Johnson",
			role: "Engineering Director, DataVisio"
		},
		{
			quote: "The most systems-minded designer I've ever worked with. Rahul understands that great design at scale isn't about pixels — it's about principles, patterns, and people.",
			name: "Elena Torres",
			role: "Head of Design, CloudBase"
		},
		{
			quote: "Rahul brought structure to our chaos. Within three months, he had mapped our entire product ecosystem and redesigned our core workflow. Remarkable clarity.",
			name: "James Park",
			role: "CTO, NexusAI"
		},
		{
			quote: "His workshops are transformative. Rahul has a rare gift for making everyone feel heard while steering toward real outcomes. Our team still uses his frameworks daily.",
			name: "Priya Sharma",
			role: "Product Lead, Finova"
		}
	];

	const maxIndex = testimonials.length - visibleCount;

	function goPrev() {
		currentIndex = Math.max(0, currentIndex - 1);
	}

	function goNext() {
		currentIndex = Math.min(maxIndex, currentIndex + 1);
	}

	function goTo(index: number) {
		currentIndex = Math.min(index, maxIndex);
	}

	const totalDots = maxIndex + 1;

	$effect(() => {
		if (isHovering) return;
		const interval = setInterval(() => {
			goNext();
		}, 4500);
		return () => clearInterval(interval);
	});
</script>

<section id="endorsements" class="section section--alt section-anchor">
	<div class="container">
		<ScrollReveal>
			<div class="endorsements-header">
				<Eyebrow>Endorsements</Eyebrow>
				<p class="header-quote">What people say about <em class="headline-em">working together.</em></p>
			</div>
		</ScrollReveal>

		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="carousel-container"
			role="region"
			aria-label="Testimonials carousel"
			onmouseenter={() => isHovering = true}
			onmouseleave={() => isHovering = false}
		>
			<ScrollReveal delay={0.15}>
				<div class="testimonials-track" style="transform: translateX(calc(-{currentIndex} * (100% / {visibleCount} + {1.5 / 3}rem)))">
					{#each testimonials as testimonial}
						<div class="testimonial-slide">
							<TestimonialCard {...testimonial} />
						</div>
					{/each}
				</div>
			</ScrollReveal>

			<div class="carousel-controls">
				<div class="carousel-dots">
					{#each Array(totalDots) as _, i}
						<button
							class="dot"
							class:dot--active={i === currentIndex}
							onclick={() => goTo(i)}
							aria-label="Go to testimonial {i + 1}"
						></button>
					{/each}
				</div>

				<div class="carousel-arrows">
					<button
						class="arrow-btn"
						onclick={goPrev}
						disabled={currentIndex === 0}
						aria-label="Previous testimonials"
					>
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M13 4l-6 6 6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
					<button
						class="arrow-btn"
						onclick={goNext}
						disabled={currentIndex === maxIndex}
						aria-label="Next testimonials"
					>
						<svg width="20" height="20" viewBox="0 0 20 20" fill="none">
							<path d="M7 4l6 6-6 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					</button>
				</div>
			</div>
		</div>
	</div>
</section>

<style>
	.endorsements-header {
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

	.carousel-container {
		overflow: hidden;
	}

	.testimonials-track {
		display: flex;
		gap: 1.5rem;
		transition: transform 0.5s var(--ease-out);
		margin-bottom: 2rem;
	}

	.testimonial-slide {
		flex: 0 0 calc((100% - 2 * 1.5rem) / 3);
		min-width: 0;
	}

	.carousel-controls {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.carousel-dots {
		display: flex;
		gap: 0.5rem;
	}

	.dot {
		width: 10px;
		height: 10px;
		border-radius: 50%;
		border: 1.5px solid var(--color-border);
		background: transparent;
		cursor: pointer;
		padding: 0;
		transition: all 0.3s var(--ease-out);
	}

	.dot--active {
		background: var(--color-accent);
		border-color: var(--color-accent);
	}

	.dot:hover:not(.dot--active) {
		border-color: var(--color-muted);
	}

	.carousel-arrows {
		display: flex;
		gap: 0.5rem;
	}

	.arrow-btn {
		display: flex;
		align-items: center;
		justify-content: center;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		border: 1.5px solid var(--color-border);
		background: var(--color-surface);
		cursor: pointer;
		color: var(--color-ink);
		transition: all 0.2s;
	}

	.arrow-btn:hover:not(:disabled) {
		border-color: var(--color-accent);
		color: var(--color-accent);
	}

	.arrow-btn:disabled {
		opacity: 0.3;
		cursor: not-allowed;
	}

	@media (max-width: 900px) {
		.testimonial-slide {
			flex: 0 0 calc((100% - 1.5rem) / 2);
		}
	}

	@media (max-width: 600px) {
		.testimonial-slide {
			flex: 0 0 100%;
		}
	}
</style>
