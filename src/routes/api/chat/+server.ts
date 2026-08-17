import { json, error } from '@sveltejs/kit';
import { systemPrompt } from '$lib/chat/knowledge';
import { GROQ_API_URL, getGroqKey } from '$lib/server/groq';

const MODEL = 'openai/gpt-oss-120b';

// Keep the conversation window small so a long session doesn't blow up the context.
const MAX_HISTORY_MESSAGES = 12;

export async function POST({ request }) {
	const apiKey = getGroqKey();

	let body: { messages?: { role: string; content: string }[] };
	try {
		body = await request.json();
	} catch {
		throw error(400, 'Invalid JSON body.');
	}

	const messages = Array.isArray(body.messages) ? body.messages : [];
	if (messages.length === 0) {
		throw error(400, 'No messages provided.');
	}

	// Validate roles and keep only recent messages
	const history = messages
		.filter((m) => m && typeof m.content === 'string' && (m.role === 'user' || m.role === 'assistant'))
		.slice(-MAX_HISTORY_MESSAGES);

	if (history.length === 0) {
		throw error(400, 'No valid messages provided.');
	}

	const groqRes = await fetch(`${GROQ_API_URL}/chat/completions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: MODEL,
			messages: [{ role: 'system', content: systemPrompt }, ...history],
			temperature: 0.4,
			max_tokens: 900
		})
	});

	if (!groqRes.ok) {
		const detail = await groqRes.text().catch(() => '');
		console.error('Groq API error:', groqRes.status, detail);
		throw error(502, 'The AI backend returned an error. Please try again.');
	}

	const data = await groqRes.json();
	const reply = data?.choices?.[0]?.message?.content;

	if (typeof reply !== 'string' || reply.length === 0) {
		throw error(502, 'The AI returned an empty response. Please try again.');
	}

	return json({ reply });
}
