import { error } from '@sveltejs/kit';
import { marked } from 'marked';
import { getPost, getPosts } from '$lib/posts';

export const prerender = true;

export function entries() {
	return getPosts().map((p) => ({ slug: p.slug }));
}

export function load({ params }: { params: { slug: string } }) {
	const post = getPost(params.slug);
	if (!post) throw error(404, 'Post not found');

	marked.setOptions({ gfm: true, breaks: false });
	const html = marked.parse(post.content) as string;

	return { post, html };
}
