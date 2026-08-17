import { error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const GROQ_API_URL = 'https://api.groq.com/openai/v1';
export const GROQ_STT_MODEL = 'whisper-large-v3-turbo';

/** Returns the Groq API key, throwing a 500 if it is missing. */
export function getGroqKey(): string {
	const apiKey = env.GROQ_API_KEY;
	if (!apiKey) {
		throw error(500, 'GROQ_API_KEY is not configured on the server.');
	}
	return apiKey;
}
