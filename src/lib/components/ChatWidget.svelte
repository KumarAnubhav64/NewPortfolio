<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';

	marked.setOptions({ gfm: true, breaks: true });

	type ChatMessage = { role: 'user' | 'assistant'; content: string };

	let open = $state(false);
	let input = $state('');
	let messages = $state<ChatMessage[]>([]);
	let pending = $state(false);
	let errorMsg = $state('');
	let panelEl: HTMLElement | undefined = $state();
	let inputEl: HTMLTextAreaElement | undefined = $state();

	// ---- Voice state ----
	let recording = $state(false);
	let transcribing = $state(false);
	let micSupported = $state(false);
	let mediaRecorder: MediaRecorder | null = null;
	let mediaStream: MediaStream | null = null;
	let audioChunks: Blob[] = [];

	// ---- Suggested questions (cues) ----
	const cues = [
		{
			q: "What are Kumar's strongest skills?",
			icon: '<path d="M13 2L4.5 13.5H11L10 22l8.5-11.5H12L13 2z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>'
		},
		{
			q: 'Show me his best projects',
			icon: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>'
		},
		{
			q: 'What did he work on at Daaranya.ai?',
			icon: '<rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12h18" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'
		},
		{
			q: "What's his education background?",
			icon: '<path d="M22 9L12 4 2 9l10 5 10-5z" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><path d="M6 11.5V16c0 1.66 2.69 3 6 3s6-1.34 6-3v-4.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>'
		},
		{
			q: 'What are his hobbies?',
			icon: '<path d="M9 18V6l10-2v12" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/><circle cx="6" cy="18" r="3" stroke="currentColor" stroke-width="1.7"/><circle cx="16" cy="16" r="3" stroke="currentColor" stroke-width="1.7"/>'
		},
		{
			q: 'How can I get in touch?',
			icon: '<rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M3 7l9 6 9-6" stroke="currentColor" stroke-width="1.7" stroke-linejoin="round"/>'
		}
	];

	// Show the cue cards while only the welcome message exists.
	let showCues = $derived(messages.length === 1 && !pending);

	// A tiny allowlist sanitizer for LLM output (marked does not sanitize).
	function sanitizeHtml(html: string): string {
		const allowedTags = new Set([
			'P', 'BR', 'STRONG', 'EM', 'B', 'I', 'UL', 'OL', 'LI', 'A', 'CODE', 'PRE',
			'BLOCKQUOTE', 'H1', 'H2', 'H3', 'H4', 'HR', 'SPAN', 'DIV'
		]);
		const doc = new DOMParser().parseFromString(html, 'text/html');
		doc.body.querySelectorAll('*').forEach((el) => {
			if (!allowedTags.has(el.tagName)) {
				el.replaceWith(...Array.from(el.childNodes));
				return;
			}
			Array.from(el.attributes).forEach((attr) => {
				if (attr.name.startsWith('on') || attr.name === 'style' || attr.name === 'class') {
					el.removeAttribute(attr.name);
					return;
				}
				if (attr.name === 'href' && !/^(https?:|mailto:)/i.test(attr.value)) {
					el.removeAttribute('href');
				}
			});
		});
		return doc.body.innerHTML;
	}

	function renderMarkdown(content: string): string {
		const html = marked.parse(content) as string;
		return sanitizeHtml(html);
	}

	async function sendMessage(text?: string) {
		const content = (text ?? input).trim();
		if (!content || pending) return;

		const nextMessages: ChatMessage[] = [...messages, { role: 'user', content }];
		messages = nextMessages;
		input = '';
		errorMsg = '';
		pending = true;

		try {
			const res = await fetch('/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ messages: nextMessages })
			});

			if (!res.ok) {
				const detail = await res.json().catch(() => null);
				throw new Error(detail?.message ?? `Request failed (${res.status})`);
			}

			const data = await res.json();
			messages = [...nextMessages, { role: 'assistant', content: data.reply }];
		} catch (e) {
			errorMsg = e instanceof Error ? e.message : 'Something went wrong. Please try again.';
		} finally {
			pending = false;
		}
	}

	// ---- Voice input (mic) ----

	async function startRecording() {
		errorMsg = '';
		try {
			mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
		} catch {
			errorMsg = 'Microphone access was denied. Check your browser permissions.';
			return;
		}

		audioChunks = [];
		try {
			mediaRecorder = new MediaRecorder(mediaStream);
		} catch {
			mediaStream.getTracks().forEach((t) => t.stop());
			mediaStream = null;
			errorMsg = 'Recording is not supported in this browser.';
			return;
		}

		mediaRecorder.ondataavailable = (e) => {
			if (e.data.size > 0) audioChunks.push(e.data);
		};
		mediaRecorder.onstop = () => transcribeRecording();
		mediaRecorder.start();
		recording = true;
	}

	function stopRecording() {
		if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
		recording = false;
	}

	async function transcribeRecording() {
		mediaStream?.getTracks().forEach((t) => t.stop());
		mediaStream = null;

		if (audioChunks.length === 0) return;
		const blob = new Blob(audioChunks, { type: 'audio/webm' });
		audioChunks = [];
		transcribing = true;
		errorMsg = '';

		try {
			const form = new FormData();
			form.append('file', blob, 'recording.webm');
			const res = await fetch('/api/transcribe', { method: 'POST', body: form });

			if (!res.ok) {
				const detail = await res.json().catch(() => null);
				throw new Error(detail?.message ?? `Transcription failed (${res.status})`);
			}

			const data = await res.json();
			if (data.text) sendMessage(data.text);
		} catch (e) {
			errorMsg = e instanceof Error ? e.message : 'Could not understand the audio. Please try again.';
		} finally {
			transcribing = false;
		}
	}

	// Keep the newest message in view.
	$effect(() => {
		if (!panelEl) return;
		panelEl.scrollTop = panelEl.scrollHeight;
	});

	$effect(() => {
		if (open && inputEl) inputEl.focus();
	});

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
		if (e.key === 'Escape') {
			open = false;
		}
	}

	function toggle() {
		open = !open;
		if (!open) {
			input = '';
			stopRecording();
		}
	}

	onMount(() => {
		// Seed with a friendly welcome message.
		if (messages.length === 0) {
			messages = [
				{
					role: 'assistant',
					content:
						"Hi! I'm Kumar's AI assistant 👋 Ask me anything about him — skills, projects, experience, hobbies, or how to get in touch. Try one of the questions below to get started."
				}
			];
		}
		micSupported =
			navigator.mediaDevices?.getUserMedia !== undefined && typeof MediaRecorder !== 'undefined';
	});
</script>

<style>
	/* ---------- Launcher button ---------- */
	.chat-launcher {
		position: fixed;
		right: 1.5rem;
		bottom: 1.5rem;
		z-index: 100;
		width: 58px;
		height: 58px;
		border-radius: 50%;
		border: 2.5px solid var(--color-surface);
		background: var(--color-surface);
		color: var(--color-accent);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		overflow: hidden;
		padding: 0;
		transition: transform 0.3s var(--ease-out);
	}

	.chat-launcher-avatar {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	.chat-launcher:hover {
		transform: translateY(-3px) scale(1.05);
	}

	/* When the chat is open, collapse back to the gradient icon button */
	.chat-launcher--open {
		background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
		color: #fff;
		border-color: transparent;
	}

	.chat-launcher:active {
		transform: translateY(-1px) scale(0.98);
	}

	.chat-launcher:focus-visible {
		outline: 2px solid var(--color-accent);
		outline-offset: 3px;
	}

	.chat-launcher:focus-visible .chat-launcher-avatar {
		outline: 2px solid var(--color-accent);
		outline-offset: 2px;
		border-radius: 50%;
	}

	/* ---------- Panel ---------- */
	.chat-panel {
		position: fixed;
		right: 1.5rem;
		bottom: 5.75rem;
		z-index: 100;
		width: min(420px, calc(100vw - 2rem));
		height: min(720px, calc(100vh - 6.5rem));
		background: var(--color-surface);
		border: 1px solid var(--color-border);
		border-radius: 22px;
		box-shadow: 0 8px 24px rgba(30, 36, 48, 0.1);
		display: flex;
		flex-direction: column;
		overflow: hidden;
		animation: chat-pop 0.32s var(--ease-out);
	}

	@keyframes chat-pop {
		from {
			opacity: 0;
			transform: translateY(14px) scale(0.97);
		}
		to {
			opacity: 1;
			transform: translateY(0) scale(1);
		}
	}

	/* ---------- Header ---------- */
	.chat-header {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		padding: 0.95rem 1.1rem;
		background: var(--color-surface);
		border-bottom: 1px solid var(--color-border);
		flex-shrink: 0;
	}

	.chat-avatar-wrap {
		position: relative;
		flex-shrink: 0;
	}

	.chat-avatar {
		width: 40px;
		height: 40px;
		border-radius: 50%;
		background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		font-family: var(--font-display);
		font-size: 1.05rem;
		font-weight: 600;
	}

	.chat-status {
		position: absolute;
		right: -1px;
		bottom: -1px;
		width: 11px;
		height: 11px;
		border-radius: 50%;
		background: #34a853;
		border: 2px solid var(--color-surface);
	}

	.chat-header-title {
		font-family: var(--font-display);
		font-size: var(--text-base);
		font-weight: 600;
		color: var(--color-ink);
		line-height: 1.2;
	}

	.chat-header-sub {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: var(--color-muted);
	}

	.chat-close {
		margin-left: auto;
		background: none;
		border: none;
		color: var(--color-muted);
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 0.4rem;
		border-radius: 10px;
		transition: color 0.2s, background-color 0.2s;
	}

	.chat-close:hover {
		color: var(--color-ink);
		background: var(--color-bg-alt);
	}

	/* ---------- Messages ---------- */
	.chat-messages {
		flex: 1;
		overflow-y: auto;
		padding: 1.15rem 1.1rem;
		display: flex;
		flex-direction: column;
		gap: 0.8rem;
		scrollbar-width: thin;
		scrollbar-color: var(--color-border) transparent;
		background:
			radial-gradient(circle at 15% 0%, rgba(92, 111, 149, 0.06), transparent 45%),
			var(--color-surface);
	}

	.msg {
		max-width: 88%;
		padding: 0.7rem 0.95rem;
		border-radius: 16px;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.55;
		white-space: pre-wrap;
		word-wrap: break-word;
		animation: msg-in 0.25s var(--ease-out);
	}

	@keyframes msg-in {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.msg--user {
		align-self: flex-end;
		background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
		color: #fff;
		border-bottom-right-radius: 6px;
	}

	.msg--assistant {
		align-self: flex-start;
		background: var(--color-bg);
		color: var(--color-ink);
		border: 1px solid var(--color-border);
		border-bottom-left-radius: 6px;
	}

	/* Markdown inside assistant bubbles */
	.msg--assistant :global(p) {
		margin: 0 0 0.5rem;
	}
	.msg--assistant :global(p:last-child) {
		margin-bottom: 0;
	}
	.msg--assistant :global(ul),
	.msg--assistant :global(ol) {
		margin: 0.25rem 0 0.5rem;
		padding-left: 1.25rem;
	}
	.msg--assistant :global(li) {
		margin: 0.2rem 0;
	}
	.msg--assistant :global(a) {
		color: var(--color-accent);
		text-decoration: underline;
		text-underline-offset: 2px;
	}
	.msg--assistant :global(code) {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 0.85em;
		background: var(--color-bg-alt);
		padding: 0.1em 0.35em;
		border-radius: var(--radius-sm);
	}
	.msg--assistant :global(pre) {
		background: var(--color-cta);
		color: #e8eaf0;
		padding: 0.75rem 1rem;
		border-radius: var(--radius-md);
		overflow-x: auto;
		font-size: var(--text-xs);
		margin: 0.5rem 0;
	}
	.msg--assistant :global(pre code) {
		background: none;
		padding: 0;
		color: inherit;
	}
	.msg--assistant :global(blockquote) {
		border-left: 3px solid var(--color-accent);
		padding-left: 0.75rem;
		margin: 0.5rem 0;
		color: var(--color-muted);
	}
	.msg--assistant :global(strong) {
		font-weight: 600;
	}

	/* Typing indicator */
	.typing {
		display: inline-flex;
		gap: 4px;
		align-items: center;
		padding: 0.3rem 0;
	}

	.typing span {
		width: 6px;
		height: 6px;
		border-radius: 50%;
		background: var(--color-muted);
		animation: typing-bounce 1.2s infinite ease-in-out;
	}

	.typing span:nth-child(2) {
		animation-delay: 0.15s;
	}

	.typing span:nth-child(3) {
		animation-delay: 0.3s;
	}

	@keyframes typing-bounce {
		0%, 60%, 100% {
			transform: translateY(0);
			opacity: 0.5;
		}
		30% {
			transform: translateY(-4px);
			opacity: 1;
		}
	}

	/* ---------- Suggested question cues ---------- */
	.cue-block {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		align-self: flex-start;
		width: 100%;
		max-width: 88%;
		animation: msg-in 0.3s var(--ease-out) 0.15s both;
	}

	.cue-label {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		font-weight: 600;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-muted);
		margin: 0.25rem 0 0.15rem;
	}

	.cue-card {
		display: flex;
		align-items: center;
		gap: 0.7rem;
		width: 100%;
		text-align: left;
		padding: 0.6rem 0.8rem;
		border-radius: 14px;
		border: 1px solid var(--color-border);
		background: var(--color-surface);
		color: var(--color-ink);
		font-family: var(--font-body);
		font-size: var(--text-sm);
		line-height: 1.35;
		cursor: pointer;
		transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s, background-color 0.2s;
	}

	.cue-card:hover {
		border-color: var(--color-accent);
		background: rgba(92, 111, 149, 0.06);
		transform: translateY(-1px);
	}

	.cue-icon {
		flex-shrink: 0;
		width: 30px;
		height: 30px;
		border-radius: 9px;
		background: rgba(92, 111, 149, 0.12);
		color: var(--color-accent);
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.cue-icon :global(svg) {
		display: block;
	}

	/* ---------- Error ---------- */
	.chat-error {
		font-family: var(--font-body);
		font-size: var(--text-xs);
		color: #b04a4a;
		padding: 0 1.1rem 0.5rem;
		flex-shrink: 0;
	}

	/* ---------- Input row ---------- */
	.chat-input-row {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.7rem 1.1rem 1rem;
		border-top: 1px solid var(--color-border);
		background: var(--color-surface);
		flex-shrink: 0;
	}

	/* A single pill: mic + textarea + send live inside it */
	.chat-input-box {
		flex: 1;
		display: flex;
		align-items: center;
		gap: 0.35rem;
		background: var(--color-bg);
		border: 1.5px solid var(--color-border);
		border-radius: 999px;
		padding: 0.3rem 0.35rem 0.3rem 0.5rem;
		transition: border-color 0.2s, box-shadow 0.2s;
	}

	.chat-input-box:focus-within {
		border-color: var(--color-accent);
		box-shadow: 0 0 0 3px rgba(92, 111, 149, 0.14);
	}

	.chat-input {
		flex: 1;
		resize: none;
		font-family: var(--font-body);
		font-size: var(--text-sm);
		color: var(--color-ink);
		background: transparent;
		border: none;
		outline: none;
		padding: 0.4rem 0.25rem;
		min-height: 30px;
		max-height: 96px;
		line-height: 1.4;
	}

	.chat-send {
		flex-shrink: 0;
		width: 38px;
		height: 38px;
		border-radius: 50%;
		border: none;
		background: linear-gradient(135deg, var(--color-accent), var(--color-accent-dark));
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: transform 0.2s, opacity 0.2s;
	}

	.chat-send:hover:not(:disabled) {
		transform: scale(1.08);
	}

	.chat-send:disabled {
		opacity: 0.45;
		cursor: not-allowed;
	}

	.mic-btn {
		flex-shrink: 0;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		border: none;
		background: transparent;
		color: var(--color-muted);
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		transition: all 0.2s;
	}

	.mic-btn:hover:not(:disabled) {
		color: var(--color-accent);
		background: rgba(92, 111, 149, 0.1);
	}

	.mic-btn--recording {
		color: #b04a4a;
		background: rgba(176, 74, 74, 0.12);
		animation: mic-pulse 1.2s infinite ease-in-out;
	}

	.mic-btn:disabled {
		opacity: 0.4;
		cursor: not-allowed;
	}

	@keyframes mic-pulse {
		0%, 100% {
			box-shadow: 0 0 0 0 rgba(176, 74, 74, 0.4);
		}
		50% {
			box-shadow: 0 0 0 6px rgba(176, 74, 74, 0);
		}
	}

	.mic-spinner {
		width: 14px;
		height: 14px;
		border-radius: 50%;
		border: 2px solid var(--color-border);
		border-top-color: var(--color-accent);
		animation: mic-spin 0.8s linear infinite;
	}

	@keyframes mic-spin {
		to {
			transform: rotate(360deg);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.chat-panel,
		.chat-launcher,
		.msg,
		.cue-block {
			transition: none;
			animation: none;
		}
	}
</style>

{#if open}
	<div
		class="chat-panel"
		role="dialog"
		aria-label="Ask me anything about Kumar Anubhav"
		tabindex="-1"
		onkeydown={handleKeydown}
	>
		<div class="chat-header">
			<div class="chat-avatar-wrap">
				<div class="chat-avatar" aria-hidden="true">A</div>
				<span class="chat-status" aria-hidden="true"></span>
			</div>
			<div>
				<div class="chat-header-title">Kumar's Assistant</div>
				<div class="chat-header-sub">Online · replies instantly</div>
			</div>
			<button class="chat-close" onclick={() => (open = false)} aria-label="Close chat">
				<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
					<path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
				</svg>
			</button>
		</div>

		<div class="chat-messages" bind:this={panelEl}>
			{#each messages as msg}
				{#if msg.role === 'user'}
					<div class="msg msg--user">{msg.content}</div>
				{:else}
					<!-- svelte-ignore a11y_no_static_element_interactions -->
					<div class="msg msg--assistant">
						<div>{@html renderMarkdown(msg.content)}</div>
					</div>
				{/if}
			{/each}

			{#if pending}
				<div class="msg msg--assistant">
					<div class="typing" aria-label="Thinking">
						<span></span><span></span><span></span>
					</div>
				</div>
			{/if}

			{#if showCues}
				<div class="cue-block">
					<p class="cue-label">Try asking</p>
					{#each cues as cue}
						<button class="cue-card" onclick={() => sendMessage(cue.q)}>
							<span class="cue-icon">
								<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">{@html cue.icon}</svg>
							</span>
							<span>{cue.q}</span>
						</button>
					{/each}
				</div>
			{/if}
		</div>

		{#if errorMsg}
			<div class="chat-error" role="alert">{errorMsg}</div>
		{/if}

		<div class="chat-input-row">
			<div class="chat-input-box">
				{#if micSupported}
					<button
						class="mic-btn"
						class:mic-btn--recording={recording}
						onclick={() => (recording ? stopRecording() : startRecording())}
						disabled={transcribing || pending}
						aria-label={recording ? 'Stop recording' : 'Speak your question'}
						title={recording ? 'Stop recording' : 'Speak your question'}
					>
						{#if transcribing}
							<span class="mic-spinner" aria-hidden="true"></span>
						{:else if recording}
							<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
								<rect x="6" y="4.5" width="4" height="15" rx="1.2" />
								<rect x="14" y="4.5" width="4" height="15" rx="1.2" />
							</svg>
						{:else}
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
								<rect x="9" y="3" width="6" height="11" rx="3" stroke="currentColor" stroke-width="1.7" />
								<path d="M5 11a7 7 0 0 0 14 0M12 18v3" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
							</svg>
						{/if}
					</button>
				{/if}
				<textarea
					bind:this={inputEl}
					class="chat-input"
					bind:value={input}
					rows="1"
					placeholder="Ask about skills, projects, experience…"
					onkeydown={handleKeydown}
					aria-label="Your question"
				></textarea>
				<button
					class="chat-send"
					onclick={() => sendMessage()}
					disabled={(!input.trim() && !recording) || pending}
					aria-label="Send message"
				>
					<svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
						<path d="M2 9l13-6.5L9.5 16l-1.8-5.2L2 9z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
						<path d="M7.7 10.8L15 2.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
					</svg>
				</button>
			</div>
		</div>
	</div>
{/if}

<button
	class="chat-launcher"
	class:chat-launcher--open={open}
	onclick={toggle}
	aria-label={open ? 'Close chat' : 'Ask me anything'}
	aria-expanded={open}
>
	{#if open}
		<svg width="22" height="22" viewBox="0 0 16 16" fill="none" aria-hidden="true">
			<path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
		</svg>
	{:else}
		<img
			src="/hero-portrait.png"
			alt="Kumar Anubhav"
			class="chat-launcher-avatar"
			width="58"
			height="58"
		/>
	{/if}
</button>
