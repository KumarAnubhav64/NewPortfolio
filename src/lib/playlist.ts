/**
 * Kumar's playlist — the floating music player plays through these tracks.
 *
 * To add a song:
 *   1. Drop the audio file into `static/audio/` (mp3, ogg, wav…).
 *   2. Add an entry below with `title` and `src: '/audio/<your-file>'`.
 *
 * Nothing plays automatically — visitors press play themselves.
 */
export type Track = {
	title: string;
	/** Path to the audio file inside `static/audio/`. */
	src: string;
	/** Optional note shown next to the title. */
	artist?: string;
};

export const playlist: Track[] = [
	{ title: 'Stranger Than Heaven', src: '/audio/stranger-than-heaven.mp3' }
];
