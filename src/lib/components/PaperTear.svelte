<script lang="ts">
	import { onMount, onDestroy, tick } from 'svelte';
	import ScrollReveal from './ScrollReveal.svelte';

	let { onComplete }: { onComplete?: () => void } = $props();

	type Pt = { x: number; y: number; px: number; py: number; pinned: boolean };
	type Cn = { a: number; b: number; len: number; dead?: boolean };

	let show = $state(false);
	let fading = $state(false); // reveal triggered — fade the whole overlay
	let interacting = $state(false); // user has grabbed the fabric
	let hintVisible = $state(false);
	let canvasEl: HTMLCanvasElement | undefined = $state();

	let ctx: CanvasRenderingContext2D | null = null;
	let points: Pt[] = [];
	let constraints: Cn[] = [];
	let cols = 0;
	let rows = 0;
	let w = 0;
	let h = 0;
	let grain: CanvasPattern | null = null;
	let raf = 0;
	let totalConstraints = 0;
	let tornCount = 0;
	let dragDist = 0;
	let lastPointer = { x: 0, y: 0 };
	let interactive = false;
	let revealing = false;
	let started = false; // physics begin once the ink act ends
	let time = 0;
	let simTime = 0;
	let frame = 0;
	let minTornRow = Infinity;
	let maxTornRow = -1;
	let interactTimeout: number | undefined;
	let idleTimeout: number | undefined;
	let capTimeout: number | undefined;
	let hintTimeout: number | undefined;
	let revealTimeout: number | undefined;

	const mouse = { x: 0, y: 0, down: false, point: -1, pointerId: -1 };

	const GRAVITY = 1200; // px/s^2
	const WIND_AMP = 500; // gentle sway, px/s^2
	const DAMPING = 0.98;
	const DT = 1 / 60;
	const RELAX_PASSES = 3;
	const TEAR_FACTOR = 2.0; // constraint breaks when stretched beyond len * this
	const TORN_REVEAL = 0.22; // reveal when this fraction of constraints is torn
	const DETACH_REVEAL = 0.3; // reveal when this fraction of the sheet has fallen off
	const INTERACT_DELAY = 1400; // ms — ink act length before fabric is grabbable
	const IDLE_AFTER_ACTIVITY = 6000; // ms of no dragging before auto-reveal
	const CAP_AFTER_INTERACTIVE = 15000; // hard cap of interactive time
	const TORN_SPAN_FACTOR = 0.75; // reveal when a tear spans this fraction of the height

	onMount(() => {
		if (typeof window === 'undefined') return;
		// Always play the intro from the start on every load — only reduced-motion
		// users skip it (accessibility), and the skip button is there as an escape.
		if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
			onComplete?.();
			return;
		}
		show = true;
		tick().then(init);
	});

	function init() {
		const canvas = canvasEl;
		if (!canvas) return;
		const dpr = Math.min(window.devicePixelRatio || 1, 2);
		w = window.innerWidth;
		h = window.innerHeight;
		canvas.width = Math.round(w * dpr);
		canvas.height = Math.round(h * dpr);
		canvas.style.width = `${w}px`;
		canvas.style.height = `${h}px`;
		const c = canvas.getContext('2d');
		if (!c) return;
		ctx = c;
		ctx.scale(dpr, dpr);
		grain = makeGrain();
		buildCloth();
		interactTimeout = window.setTimeout(() => {
			interactive = true;
			// Fabric stays taut (physics off) until the user actually grabs it —
			// it must not sag or fall on its own, like a curtain awaiting a pull.
			capTimeout = window.setTimeout(reveal, CAP_AFTER_INTERACTIVE);
		}, INTERACT_DELAY);
		hintTimeout = window.setTimeout(() => {
			hintVisible = true;
		}, 1750);
		raf = requestAnimationFrame(loop);
	}

	function buildCloth() {
		const mobile = w < 640;
		cols = mobile ? 34 : 52;
		rows = mobile ? 20 : 30;
		const stepX = w / (cols - 1);
		const stepY = h / (rows - 1);
		points = [];
		constraints = [];
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				const xx = x * stepX;
				const yy = y * stepY;
				// Only the two top corners hold the fabric up
				const pinned = y === 0 && (x === 0 || x === cols - 1);
				points.push({ x: xx, y: yy, px: xx, py: yy, pinned });
			}
		}
		const idx = (x: number, y: number) => y * cols + x;
		for (let y = 0; y < rows; y++) {
			for (let x = 0; x < cols; x++) {
				if (x < cols - 1) constraints.push({ a: idx(x, y), b: idx(x + 1, y), len: stepX });
				if (y < rows - 1) constraints.push({ a: idx(x, y), b: idx(x, y + 1), len: stepY });
			}
		}
		totalConstraints = constraints.length;
	}

	function simulate(dt: number) {
		simTime += dt;
		// Gravity ramps in so the fabric settles gently instead of snapping
		const ramp = Math.min(1, simTime / 0.7);
		const g = GRAVITY * ramp;
		const wind = Math.sin(time * 1.2) * WIND_AMP * ramp;

		for (const p of points) {
			if (p.pinned) continue;
			const vx = (p.x - p.px) * DAMPING;
			const vy = (p.y - p.py) * DAMPING;
			p.px = p.x;
			p.py = p.y;
			p.x += vx + wind * dt * dt;
			p.y += vy + g * dt * dt;
		}

		// The grabbed point rides the cursor — this is what rips the cloth
		if (mouse.down && mouse.point >= 0 && interactive && !revealing) {
			const p = points[mouse.point];
			p.x = mouse.x;
			p.y = mouse.y;
			p.px = mouse.x;
			p.py = mouse.y;
		}

		for (let i = 0; i < RELAX_PASSES; i++) {
			for (const c of constraints) {
				const p1 = points[c.a];
				const p2 = points[c.b];
				const dx = p2.x - p1.x;
				const dy = p2.y - p1.y;
				const dist = Math.sqrt(dx * dx + dy * dy) || 0.001;
				const diff = (dist - c.len) / dist;
				if (p1.pinned && p2.pinned) continue;
				if (p1.pinned) {
					p2.x -= dx * diff;
					p2.y -= dy * diff;
				} else if (p2.pinned) {
					p1.x += dx * diff;
					p1.y += dy * diff;
				} else {
					const hx = dx * diff * 0.5;
					const hy = dy * diff * 0.5;
					p1.x += hx;
					p1.y += hy;
					p2.x -= hx;
					p2.y -= hy;
				}
			}
		}

		// Tear: any constraint stretched past its limit snaps — but ONLY while the user is
		// actively dragging. The settle and wind sway can never rip the sheet on their own.
		if (mouse.down && interactive && !revealing) {
			const td2 = TEAR_FACTOR * TEAR_FACTOR;
			let needFilter = false;
			for (const c of constraints) {
				const p1 = points[c.a];
				const p2 = points[c.b];
				const dx = p2.x - p1.x;
				const dy = p2.y - p1.y;
				if (dx * dx + dy * dy > c.len * c.len * td2) {
					c.dead = true;
					needFilter = true;
					const row = Math.floor(Math.min(c.a, c.b) / cols);
					if (row < minTornRow) minTornRow = row;
					if (row > maxTornRow) maxTornRow = row;
				}
			}
			if (needFilter) {
				const before = constraints.length;
				constraints = constraints.filter((c) => !c.dead);
				tornCount += before - constraints.length;
			}
		}
	}

	function detachedFraction(): number {
		const n = points.length;
		const parent = new Int32Array(n);
		for (let i = 0; i < n; i++) parent[i] = i;
		const find = (i: number): number => {
			let r = i;
			while (parent[r] !== r) r = parent[r];
			while (parent[i] !== i) {
				const next = parent[i];
				parent[i] = r;
				i = next;
			}
			return r;
		};
		const union = (a: number, b: number) => {
			const ra = find(a);
			const rb = find(b);
			if (ra !== rb) parent[rb] = ra;
		};
		for (const c of constraints) union(c.a, c.b);
		// Pinned corners: top-left is index 0, top-right is index cols-1
		const held = new Set<number>([find(0), find(cols - 1)]);
		let detached = 0;
		for (let i = 0; i < n; i++) if (!held.has(find(i))) detached++;
		return detached / n;
	}

	function checkDismissal(): boolean {
		if (totalConstraints > 0 && tornCount / totalConstraints >= TORN_REVEAL) return true;
		if (dragDist >= Math.min(w, h) * 0.7) return true;
		if (maxTornRow - minTornRow >= (rows - 1) * TORN_SPAN_FACTOR) return true;
		if (detachedFraction() >= DETACH_REVEAL) return true;
		return false;
	}

	function reveal() {
		if (revealing) return;
		revealing = true;
		interacting = false;
		hintVisible = false;
		fading = true;
		if (idleTimeout !== undefined) window.clearTimeout(idleTimeout);
		if (capTimeout !== undefined) window.clearTimeout(capTimeout);
		revealTimeout = window.setTimeout(() => onComplete?.(), 650);
	}

	// --- Pointer interaction (mouse + touch unified) ---
	function onPointerDown(e: PointerEvent) {
		if (!interactive || revealing) return;
		canvasEl?.setPointerCapture(e.pointerId);
		mouse.pointerId = e.pointerId;
		mouse.x = e.clientX;
		mouse.y = e.clientY;
		lastPointer = { x: e.clientX, y: e.clientY };
		mouse.point = nearestPoint(e.clientX, e.clientY);
		mouse.down = true;
		interacting = true;
		hintVisible = false;
		resetIdle();
	}

	function onPointerMove(e: PointerEvent) {
		if (!mouse.down || e.pointerId !== mouse.pointerId) return;
		started = true; // fabric comes to life only on an actual drag — a tap never sets it off
		const dx = e.clientX - lastPointer.x;
		const dy = e.clientY - lastPointer.y;
		dragDist += Math.sqrt(dx * dx + dy * dy);
		lastPointer = { x: e.clientX, y: e.clientY };
		mouse.x = e.clientX;
		mouse.y = e.clientY;
		resetIdle();
	}

	function onPointerUp(e: PointerEvent) {
		if (e.pointerId !== mouse.pointerId) return;
		mouse.down = false;
		mouse.point = -1;
		mouse.pointerId = -1;
	}

	// If the user makes no progress for a while, let them in anyway.
	// Only armed once there's real tearing progress — a bare tap won't start it.
	function resetIdle() {
		if (dragDist <= 0 && tornCount <= 0) return;
		if (idleTimeout !== undefined) window.clearTimeout(idleTimeout);
		idleTimeout = window.setTimeout(reveal, IDLE_AFTER_ACTIVITY);
	}

	function nearestPoint(x: number, y: number): number {
		const stepX = w / (cols - 1);
		const stepY = h / (rows - 1);
		let cx = Math.round(x / stepX);
		let cy = Math.round(y / stepY);
		cx = Math.max(0, Math.min(cols - 1, cx));
		cy = Math.max(0, Math.min(rows - 1, cy));
		const idx = (a: number, b: number) => b * cols + a;
		let best = idx(cx, cy);
		let bestD = Infinity;
		for (let dy = -1; dy <= 1; dy++) {
			for (let dx = -1; dx <= 1; dx++) {
				const nx = cx + dx;
				const ny = cy + dy;
				if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
				const p = points[idx(nx, ny)];
				const d = (p.x - x) ** 2 + (p.y - y) ** 2;
				if (d < bestD) {
					bestD = d;
					best = idx(nx, ny);
				}
			}
		}
		return best;
	}

	function draw() {
		if (!ctx) return;
		ctx.clearRect(0, 0, w, h);

		// Solid fabric sheet, quad by quad
		ctx.beginPath();
		for (let y = 0; y < rows - 1; y++) {
			for (let x = 0; x < cols - 1; x++) {
				const a = points[y * cols + x];
				const b = points[y * cols + x + 1];
				const c = points[(y + 1) * cols + x + 1];
				const d = points[(y + 1) * cols + x];
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.lineTo(c.x, c.y);
				ctx.lineTo(d.x, d.y);
				ctx.closePath();
			}
		}
		ctx.fillStyle = '#f7f4ec';
		ctx.fill();

		// Faint mesh weave — also defines the jagged torn edges
		ctx.strokeStyle = 'rgba(30, 36, 48, 0.055)';
		ctx.lineWidth = 1;
		ctx.beginPath();
		for (let y = 0; y < rows - 1; y++) {
			for (let x = 0; x < cols - 1; x++) {
				const a = points[y * cols + x];
				const b = points[y * cols + x + 1];
				const c = points[(y + 1) * cols + x + 1];
				const d = points[(y + 1) * cols + x];
				ctx.moveTo(a.x, a.y);
				ctx.lineTo(b.x, b.y);
				ctx.moveTo(b.x, b.y);
				ctx.lineTo(c.x, c.y);
				ctx.moveTo(c.x, c.y);
				ctx.lineTo(d.x, d.y);
				ctx.moveTo(d.x, d.y);
				ctx.lineTo(a.x, a.y);
			}
		}
		ctx.stroke();

		// Grain, applied only over the fabric pixels
		if (grain) {
			ctx.save();
			ctx.globalCompositeOperation = 'source-atop';
			ctx.globalAlpha = 0.5;
			ctx.fillStyle = grain;
			ctx.fillRect(0, 0, w, h);
			ctx.restore();
		}

		// Grab indicator — a small pinch ring at the cursor
		if (mouse.down && interactive && !revealing) {
			ctx.beginPath();
			ctx.arc(mouse.x, mouse.y, 5, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(92, 112, 149, 0.9)';
			ctx.fill();
			ctx.beginPath();
			ctx.arc(mouse.x, mouse.y, 12, 0, Math.PI * 2);
			ctx.strokeStyle = 'rgba(92, 112, 149, 0.35)';
			ctx.lineWidth = 1.5;
			ctx.stroke();
		}
	}

	function makeGrain(): CanvasPattern | null {
		if (!ctx) return null;
		const g = document.createElement('canvas');
		g.width = g.height = 128;
		const gctx = g.getContext('2d');
		if (!gctx) return null;
		const img = gctx.createImageData(128, 128);
		for (let i = 0; i < img.data.length; i += 4) {
			const v = Math.random() * 255;
			img.data[i] = v;
			img.data[i + 1] = v;
			img.data[i + 2] = v;
			img.data[i + 3] = 16;
		}
		gctx.putImageData(img, 0, 0);
		return ctx.createPattern(g, 'repeat');
	}

	let last = 0;
	let acc = 0;

	function loop(now: number) {
		if (!last) last = now;
		const dtms = Math.min(50, now - last);
		last = now;
		time += dtms / 1000;
		acc += dtms / 1000;
		while (acc >= DT) {
			if (started) simulate(DT);
			acc -= DT;
		}
		frame++;
		// Only ever reveal from tear progress once the user has actually grabbed the fabric
		if (interacting && !revealing && frame % 20 === 0 && checkDismissal()) {
			reveal();
		}
		draw();
		raf = requestAnimationFrame(loop);
	}

	onDestroy(() => {
		if (typeof window === 'undefined') return;
		cancelAnimationFrame(raf);
		if (interactTimeout !== undefined) window.clearTimeout(interactTimeout);
		if (idleTimeout !== undefined) window.clearTimeout(idleTimeout);
		if (capTimeout !== undefined) window.clearTimeout(capTimeout);
		if (hintTimeout !== undefined) window.clearTimeout(hintTimeout);
		if (revealTimeout !== undefined) window.clearTimeout(revealTimeout);
	});
</script>

{#if show}
	<div class="paper-tear" class:paper-tear--fading={fading}>
		<canvas
			bind:this={canvasEl}
			class="paper-tear__canvas"
			aria-hidden="true"
			onpointerdown={onPointerDown}
			onpointermove={onPointerMove}
			onpointerup={onPointerUp}
			onpointercancel={onPointerUp}
			oncontextmenu={(e) => e.preventDefault()}
		></canvas>

		<!-- Act 1 — ink mood screen: same reveal animation as the main content -->
		<div class="pt-ink" aria-hidden="true">
			<ScrollReveal class="pt-ink__reveal">
				<div class="pt-ink__name">Kumar Anubhav</div>
			</ScrollReveal>
			<ScrollReveal delay={0.15} class="pt-ink__reveal">
				<span class="pt-ink__tagline">a thinker &amp; a tinkerer</span>
			</ScrollReveal>
		</div>

		<!-- Act 2 hint — drag to tear -->
		<div class="pt-hint" class:pt-hint--visible={hintVisible} aria-hidden="true">
			<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
				stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
				<path d="M8 8l-4 4 4 4" />
				<path d="M16 8l4 4-4 4" />
				<path d="M4 12h16" />
			</svg>
			<span>drag to tear</span>
		</div>

		<button type="button" class="pt-skip" onclick={reveal}>skip &rarr;</button>
	</div>
{/if}

<style>
	.paper-tear {
		position: fixed;
		inset: 0;
		z-index: 200;
		cursor: crosshair;
		touch-action: none;
		-webkit-user-select: none;
		user-select: none;
		opacity: 1;
		transition: opacity 0.65s ease;
	}

	.paper-tear--fading {
		opacity: 0;
	}

	.paper-tear__canvas {
		position: absolute;
		inset: 0;
		width: 100%;
		height: 100%;
		display: block;
	}

	/* Act 1 — ink mood screen */
	.pt-ink {
		position: absolute;
		inset: 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1.1rem;
		text-align: center;
		background: var(--color-cta);
		pointer-events: none;
		/* Hold the reveal, then dissolve into the paper sheet */
		animation: pt-ink-out 0.35s var(--ease-out) 1.4s forwards;
	}

	.pt-ink::after {
		content: '';
		position: absolute;
		inset: 0;
		pointer-events: none;
		background: radial-gradient(
			ellipse 120% 90% at 50% 38%,
			transparent 45%,
			rgba(0, 0, 0, 0.28) 100%
		);
	}

	/* The reveal divs sit above the vignette */
	:global(.pt-ink__reveal) {
		position: relative;
		z-index: 1;
	}

	.pt-ink__name {
		font-family: var(--font-display);
		font-style: italic;
		font-weight: 300;
		font-size: clamp(2.5rem, 8vw, 4.5rem);
		letter-spacing: -0.01em;
		line-height: 1.1;
		color: #f4f1e9;
		white-space: nowrap;
	}

	.pt-ink__tagline {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: rgba(244, 241, 233, 0.55);
	}

	@keyframes pt-ink-out {
		to {
			opacity: 0;
		}
	}

	/* Act 2 hint */
	.pt-hint {
		position: absolute;
		left: 50%;
		bottom: 12%;
		transform: translateX(-50%);
		display: flex;
		align-items: center;
		gap: 0.6rem;
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 500;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--color-muted);
		pointer-events: none;
		opacity: 0;
		transition: opacity 0.4s var(--ease-out);
	}

	.pt-hint--visible {
		opacity: 1;
	}

	.pt-hint svg {
		animation: pt-hint-pulse 1.8s ease-in-out infinite;
	}

	@keyframes pt-hint-pulse {
		0%,
		100% {
			transform: translateX(-4px);
		}
		50% {
			transform: translateX(4px);
		}
	}

	.pt-skip {
		position: absolute;
		right: 1.5rem;
		bottom: 1.5rem;
		z-index: 2;
		background: none;
		border: none;
		cursor: pointer;
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 500;
		letter-spacing: 0.18em;
		text-transform: uppercase;
		color: var(--color-muted);
		opacity: 0;
		animation: pt-skip-in 0.5s var(--ease-out) 1.2s forwards;
		transition: color 0.25s;
	}

	.pt-skip:hover {
		color: var(--color-ink);
	}

	.pt-skip:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 4px;
		border-radius: 4px;
	}

	@keyframes pt-skip-in {
		to {
			opacity: 1;
		}
	}
</style>
