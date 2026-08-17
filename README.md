# sv

Everything you need to build a Svelte project, powered by [`sv`](https://github.com/sveltejs/cli).

## Creating a project

If you're seeing this, you've probably already done this step. Congrats!

```sh
# create a new project
npx sv create my-app
```

To recreate this project with the same configuration:

```sh
# recreate this project
npx sv@0.16.5 create --template minimal --types ts --install npm .
```

## Developing

Once you've created a project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```sh
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## Building

To create a production version of your app:

```sh
npm run build
```

You can preview the production build with `npm run preview`.

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.

## AI Chat Widget ("Ask me anything")

The site includes a floating chat widget that answers questions about Kumar Anubhav using Groq's LLM API.

### Setup

1. Get a free API key from <https://console.groq.com/keys>.
2. Copy `.env.example` to `.env` and set your key:

   ```sh
   cp .env.example .env
   # then edit .env and set GROQ_API_KEY=your_key
   ```

3. The key is only read server-side (in `src/routes/api/chat/+server.ts`) — it is never shipped to the browser.

### How it works

- The knowledge base in `src/lib/chat/knowledge.ts` is compiled from the resume (`static/resume.pdf`) and portfolio data, and is injected into the system prompt.
- `POST /api/chat` sends the conversation to Groq (`llama-3.3-70b-versatile`) and returns the reply.
- To update what the bot knows, edit `src/lib/chat/knowledge.ts`.

### Voice input (same Groq key)

- **🎤 Speak your question** — the mic button records audio in the browser, `POST /api/transcribe` sends it to Groq Whisper (`whisper-large-v3-turbo`), and the transcript is sent as your message. Requires mic permission.

### Music playlist

The floating music player plays through the tracks in `src/lib/playlist.ts` — nothing plays automatically, visitors press play. To add a song:

1. Drop the audio file into `static/audio/`.
2. Add an entry to the `playlist` array in `src/lib/playlist.ts`, e.g. `{ title: 'My Song', src: '/audio/my-song.mp3' }`.

When the playlist has more than one track, the player shows prev/next buttons and advances automatically to the next track (stopping after the last one).

> Note: the chat requires a server environment (the dev server or a serverless adapter). It will not work on a purely static export.
