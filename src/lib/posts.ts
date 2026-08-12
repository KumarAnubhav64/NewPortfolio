export interface Post {
	slug: string;
	title: string;
	date: string;
	excerpt: string;
	tags: string[];
	content: string;
	readingMinutes: number;
}

// Vite glob — all markdown posts imported eagerly as raw text at build time.
// This keeps the blog static: no server, no CMS, no runtime fetch.
const modules = import.meta.glob('./posts/*.md', {
	query: '?raw',
	import: 'default',
	eager: true
}) as Record<string, string>;

const WPM = 200;

function parseFrontmatter(raw: string): { meta: Record<string, string>; body: string } {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
	if (!match) return { meta: {}, body: raw };

	const meta: Record<string, string> = {};
	for (const line of match[1].split('\n')) {
		const idx = line.indexOf(':');
		if (idx > 0) meta[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
	}
	return { meta, body: match[2] };
}

function parseTags(raw: string | undefined): string[] {
	if (!raw) return [];
	return raw
		.split(',')
		.map((t) => t.trim())
		.filter(Boolean);
}

function toPost(path: string, raw: string): Post {
	const slug = path.split('/').pop()!.replace(/\.md$/, '');
	const { meta, body } = parseFrontmatter(raw);
	const words = body.trim().split(/\s+/).length;
	return {
		slug,
		title: meta.title || slug,
		date: meta.date || '',
		excerpt: meta.excerpt || '',
		tags: parseTags(meta.tags),
		content: body,
		readingMinutes: Math.max(1, Math.round(words / WPM))
	};
}

export function getPosts(): Post[] {
	return Object.entries(modules)
		.map(([path, raw]) => toPost(path, raw))
		.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function getPost(slug: string): Post | undefined {
	return getPosts().find((p) => p.slug === slug);
}
