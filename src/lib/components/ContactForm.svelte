<script lang="ts">
	const FORM_ENDPOINT = 'https://api.web3forms.com/submit';
	// Create your access key at https://web3forms.com (enter your email, key is sent to you).
	// It's safe to ship in the HTML — Web3Forms treats it as an alias to your email.
	const ACCESS_KEY = '7618bead-c80f-4eb8-aff9-595ed8230a4b';

	let status = $state<'idle' | 'sending' | 'success' | 'error'>('idle');
	let errorMessage = $state('');

	async function handleSubmit(event: SubmitEvent) {
		const form = event.currentTarget as HTMLFormElement;
		if (!form || status === 'sending') return;

		status = 'sending';
		errorMessage = '';

		try {
			const response = await fetch(FORM_ENDPOINT, {
				method: 'POST',
				body: new FormData(form),
				headers: { Accept: 'application/json' }
			});

			// Web3Forms returns 200 with { success: false } for some failures, so
			// check the JSON flag rather than trusting the status code alone.
			const data = await response.json().catch(() => null);
			const ok = response.ok && (!data || data.success !== false);

			if (ok) {
				status = 'success';
				form.reset();
			} else {
				status = 'error';
				errorMessage =
					'Something went wrong sending your message. Please try again, or email me directly using the links below.';
			}
		} catch {
			status = 'error';
			errorMessage =
				'Could not reach the network just now. Please try again, or email me directly using the links below.';
		}
	}
</script>

<div class="form-card">
	{#if status === 'success'}
		<div class="form-status form-status--success" role="status">
			<p class="status-title">Thank you, message sent.</p>
			<p class="status-text">I'll get back to you soon. Meanwhile, you can keep exploring the site.</p>
		</div>
	{:else}
		<form class="contact-form" onsubmit={handleSubmit} novalidate>
			<input type="hidden" name="access_key" value={ACCESS_KEY} />
			<!-- Honeypot: real users never see this, bots fill it and get silently dropped -->
			<input type="text" name="botcheck" class="form-honeypot" tabindex="-1" autocomplete="off" aria-hidden="true" />

			<div class="form-row">
				<div class="form-field">
					<label class="form-label" for="cf-name">Name</label>
					<input
						id="cf-name"
						class="form-input"
						type="text"
						name="name"
						placeholder="Your name"
						required
					/>
				</div>
				<div class="form-field">
					<label class="form-label" for="cf-email">Email</label>
					<input
						id="cf-email"
						class="form-input"
						type="email"
						name="email"
						placeholder="you@example.com"
						required
					/>
				</div>
			</div>

			<div class="form-field">
				<label class="form-label" for="cf-subject">Subject</label>
				<select id="cf-subject" class="form-input form-select" name="subject">
					<option value="Project inquiry" selected>Project inquiry</option>
					<option value="Job opportunity">Job opportunity</option>
					<option value="Collaboration">Collaboration</option>
					<option value="Just saying hi">Just saying hi</option>
				</select>
			</div>

			<div class="form-field">
				<label class="form-label" for="cf-message">Message</label>
				<textarea
					id="cf-message"
					class="form-input form-textarea"
					name="message"
					placeholder="Tell me about your project, role, or just say hello..."
					rows="5"
					required
				></textarea>
			</div>

			{#if status === 'error'}
				<p class="form-status form-status--error" role="alert">{errorMessage}</p>
			{/if}

			<div class="form-submit">
				<button type="submit" class="form-button" disabled={status === 'sending'}>
					{#if status === 'sending'}
						<span class="form-spinner" aria-hidden="true"></span>
						Sending
					{:else}
						Send message
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
							<path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
					{/if}
				</button>
			</div>
		</form>
	{/if}
</div>

<style>
	.form-card {
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: var(--radius-xl);
		padding: 2rem;
		box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
		transition: transform 0.4s var(--ease-out), box-shadow 0.4s var(--ease-out);
	}

	.form-card:hover {
		transform: translateY(-2px);
		box-shadow: 0 12px 32px rgba(0, 0, 0, 0.06);
	}

	.contact-form {
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		text-align: left;
	}

	.form-honeypot {
		position: absolute;
		left: -9999px;
		opacity: 0;
		height: 0;
		width: 0;
	}

	.form-row {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}

	.form-field {
		display: flex;
		flex-direction: column;
		gap: 0.4rem;
	}

	.form-label {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-muted);
	}

	.form-input {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-ink);
		background: var(--color-bg);
		border: 1.5px solid var(--color-border);
		border-radius: var(--radius-lg);
		padding: 0.8rem 1rem;
		width: 100%;
		box-sizing: border-box;
		outline: none;
		transition: border-color 0.3s var(--ease-out), box-shadow 0.3s var(--ease-out), background 0.3s var(--ease-out);
	}

	.form-input::placeholder {
		color: var(--color-muted);
		opacity: 0.65;
	}

	.form-input:focus {
		border-color: var(--color-accent);
		background: var(--color-surface);
		box-shadow: 0 0 0 3px rgba(92, 111, 149, 0.12);
	}

	.form-textarea {
		resize: vertical;
		min-height: 120px;
		line-height: 1.6;
	}

	.form-select {
		appearance: none;
		-webkit-appearance: none;
		background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5 11 1.5' stroke='%236e6358' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
		background-repeat: no-repeat;
		background-position: right 1rem center;
		padding-right: 2.5rem;
		cursor: pointer;
	}

	.form-status {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.6;
		padding: 0.9rem 1rem;
		border-radius: var(--radius-lg);
		margin: 0;
	}

	.form-status--error {
		color: #8a3a2e;
		background: rgba(180, 82, 62, 0.08);
		border: 1px solid rgba(180, 82, 62, 0.25);
	}

	.form-status--success {
		display: flex;
		flex-direction: column;
		gap: 0.35rem;
		text-align: center;
		padding: 2.5rem 1.5rem;
	}

	.status-title {
		font-family: var(--font-display);
		font-size: var(--text-2xl);
		font-style: italic;
		font-weight: 300;
		color: var(--color-ink);
		margin: 0;
	}

	.status-text {
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-muted);
		margin: 0;
	}

	.form-submit {
		display: flex;
	}

	.form-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.9rem 1.75rem;
		border-radius: var(--radius-lg);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		font-weight: 500;
		letter-spacing: 0.02em;
		cursor: pointer;
		background: var(--color-accent);
		color: #fff;
		border: 1.5px solid var(--color-accent);
		line-height: 1;
		transition: all 0.3s var(--ease-out);
		width: 100%;
	}

	.form-button:hover:not(:disabled) {
		background: var(--color-accent-dark);
		border-color: var(--color-accent-dark);
		transform: translateY(-1px);
	}

	.form-button:active:not(:disabled) {
		transform: scale(0.98);
	}

	.form-button:disabled {
		opacity: 0.75;
		cursor: wait;
	}

	.form-button svg {
		transition: transform 0.3s var(--ease-out);
	}

	.form-button:hover:not(:disabled) svg {
		transform: translateX(3px);
	}

	.form-spinner {
		width: 14px;
		height: 14px;
		border: 2px solid rgba(255, 255, 255, 0.35);
		border-top-color: #fff;
		border-radius: 50%;
		animation: form-spin 0.7s linear infinite;
	}

	@keyframes form-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (max-width: 560px) {
		.form-card {
			padding: 1.5rem;
		}

		.form-row {
			grid-template-columns: 1fr;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.form-spinner {
			animation-duration: 1.4s;
		}

		.form-card {
			transition: none;
		}
	}
</style>
