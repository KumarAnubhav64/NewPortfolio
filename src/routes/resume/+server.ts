import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { RequestHandler } from './$types';

const resumePath = path.join(process.cwd(), 'static', 'resume.pdf');

export const GET: RequestHandler = async ({ setHeaders }) => {
	try {
		const pdf = await readFile(resumePath);
		setHeaders({
			'Content-Type': 'application/pdf',
			'Content-Length': pdf.length.toString(),
			'Cache-Control': dev ? 'no-cache' : 'public, max-age=3600'
		});
		return new Response(new Uint8Array(pdf));
	} catch {
		throw error(404, 'Resume not found');
	}
};
