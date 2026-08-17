import { json, error } from '@sveltejs/kit';
import { GROQ_API_URL, GROQ_STT_MODEL, getGroqKey } from '$lib/server/groq';

const MAX_AUDIO_BYTES = 25 * 1024 * 1024; // Groq free-tier limit

export async function POST({ request }) {
	const apiKey = getGroqKey();

	const formData = await request.formData().catch(() => null);
	const file = formData?.get('file');

	if (!(file instanceof Blob)) {
		throw error(400, 'No audio file provided.');
	}
	if (file.size === 0 || file.size > MAX_AUDIO_BYTES) {
		throw error(400, 'Audio file is empty or too large (max 25 MB).');
	}

	const groqForm = new FormData();
	groqForm.set('model', GROQ_STT_MODEL);
	groqForm.set('file', file, 'recording.webm');

	const groqRes = await fetch(`${GROQ_API_URL}/audio/transcriptions`, {
		method: 'POST',
		headers: { Authorization: `Bearer ${apiKey}` },
		body: groqForm
	});

	if (!groqRes.ok) {
		const detail = await groqRes.text().catch(() => '');
		console.error('Groq transcription error:', groqRes.status, detail);
		throw error(502, 'Speech-to-text failed. Please try again.');
	}

	const data = await groqRes.json();
	const text = typeof data?.text === 'string' ? data.text.trim() : '';

	if (!text) {
		throw error(502, 'No speech detected. Please try again.');
	}

	return json({ text });
}
