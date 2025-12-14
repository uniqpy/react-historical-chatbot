# Caligula Conversational AI

React + Express chatbot that speaks as Emperor Caligula. Short prompts are served locally from a weighted JSON engine; longer prompts call Gemini with a verification pass to keep tone and safety in line.

## Prerequisites
- Node.js (LTS)
- npm

## Setup
```bash
npm install
```

Create `server/.env` with:
```
GOOGLE_API_KEY=your_key_here
PORT=5174
```

## Running
- Front end: `npm run dev` then open http://localhost:5173
- Back end: `npm start` (listens on PORT, default 5174)

Vite proxies `/api/*` to the back end in development, so no extra CORS setup is needed.

## API contract
- `POST /api/chat`
  - Body: `{ messages: [{ role: "user"|"assistant", text: string }] }`
  - Success: `{ success: true, reply: string, cid: string, source?: "local" }`
  - Failure: `{ success: false, error: string, cid: string }` with HTTP 4xx/5xx
- `GET /api/health` returns `{ ok: true, cid }`
- `GET /api/debug/env` shows whether a Gemini key is present

## Project layout
- `client/src` React application (chat UI and about page)
- `server/` Express server, local reply engine, Gemini client
- `server/local-responses.json` Weighted local replies to cut down on API calls

## Notes
- Secrets stay on the server; the client never holds API keys.
- If Gemini is not configured, the API responds with a clear 503 instead of crashing.
- Dependencies are kept to what is actually used; unused packages (for example, database drivers) have been removed to keep installs lean and audits quiet.
