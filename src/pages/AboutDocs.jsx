import { useEffect, useState } from 'react';
import feather from 'feather-icons';

const CONTENT = {
  overview: {
    title: 'About',
    body: `
Roman-themed chat that mimics a ChatGPT layout. Short prompts are handled by a local JSON-driven reply engine with weighted responses; longer/complex prompts fall through to Gemini for generation plus a secondary safety/voice check. Frontend is React + Vite; backend is Express. Styling uses custom CSS and Google Fonts to give Caligula a classic feel.
`
  },

  // ===== Infrastructure =====
  infra_fe: {
    title: 'Infrastructure • Front End',
    body: `
Stack
- React + Vite (JavaScript).
- Bootstrap 5 base grid; custom CSS for Roman styling and chat bubbles.
- Feather icons for inline icons; Google Fonts (Inter + Cormorant Garamond).
- React Router for routing.

Structure
- Chat page: full-height feed with themed user/bot bubbles; bottom input card.
- About page: two-column docs style with left nav and right content pane.
- Global background image set via CSS; chat window is transparent over it.
- Vite dev proxy maps /api/* calls to backend to avoid CORS in dev.
`
  },
  infra_be: {
    title: 'Infrastructure • Back End',
    body: `
Development Server
- Express (Node.js) runs locally.
- /api/chat pipeline: local JSON responder first; if no match, call Gemini to generate, then Gemini again to verify tone/safety.

Routes
- GET /api/health: health check.
- POST /api/chat: chat endpoint consumed by the frontend.

Security
- API keys and any secrets live only on the server (.env). The client never holds secrets.
`
  },
  infra_db: {
    title: 'Infrastructure • Database',
    body: `
Current State
- No database is required for the mock-only setup.

Future
- If extended, can add MariaDB/MySQL via mysql2 with pooled connections.
- Keep connection strings in server/.env and never expose them to the client.
- Use prepared statements and a minimal DAO layer to keep things safe and testable.
`
  },
  infra_api: {
    title: 'Infrastructure • API',
    body: `
Local API
- Provided by the Express server under /api/*.
- Vite proxy forwards frontend requests to the Express server to avoid CORS during development.

Contract
- POST /api/chat expects: { messages: [{ role: "user"|"assistant", text: string }] }
- Response: { success: boolean, reply?: string, source?: "local"|"gemini", cid: string }
- GET /api/health and /api/debug/env for quick diagnostics.
`
  },

  // ===== GPT & Billing =====
  gpt_billing: {
    title: 'Local Engine & Gemini Notes',
    body: `
Local JSON Engine
- server/local-responses.json defines patterns (triggers, max words, weighted responses).
- server/local-engine.js matches short/simple prompts and returns a weighted random reply to reduce Gemini calls.

Gemini Usage
- If no local match, server/googlegemini-client.js calls Gemini (generateContent) with the Caligula system prompt.
- A second Gemini call checks tone/safety before replying.
- Requires GOOGLE_API_KEY in server/.env; billable per Gemini pricing.
`
  },

  // ===== Development =====
  dev_getting_started: {
    title: 'Development • Getting Started',
    body: `
Prerequisites
- Node.js (LTS recommended)
- npm

Install (project root)
- npm i

Additional Packages
- npm i feather-icons
- npm i express cors morgan dotenv
- Gemini client: npm i @google/genai

Layout
- src/              React + Vite frontend
- server/           Express backend (Gemini + local engine)
- vite.config.js    Dev proxy for /api
- package.json
- server/.env       Backend secrets when using real APIs
`
  },
  dev_running: {
    title: 'Development • Running Locally',
    body: `
Backend (Mock Mode)
node server/index.js
- Logs show port and correlation IDs per request.

Proxy
- vite.config.js maps "/api" to "http://localhost:5174".

Frontend
- npm run dev
- Open http://localhost:5173

Health Checks
- Backend health:  http://localhost:5174/api/health  -> { ok: true }
- Backend debug:   http://localhost:5174/api/debug/env -> shows whether Gemini key is present

Behavior
- The chat page posts messages to /api/chat.
- Short/simple inputs return local JSON responses; others go through Gemini generate + verify.
`
  },
  dev_env: {
    title: 'Development • Environment & Secrets',
    body: `
Mock Mode
- No secrets required for local-only replies.

Gemini Mode
- Create server/.env with:
  GOOGLE_API_KEY=...
  PORT=5174
- Restart the backend after editing .env.

Client-Side Rules
- I never place secrets in the frontend. All protected calls go through the Express backend.

MariaDB (Optional)
- If I add MariaDB later, I will store DB credentials in server/.env, use a connection pool, and rely on prepared statements only on the server.
`
  }
};

export default function AboutDocs() {
  const [topic, setTopic] = useState('overview');
  const [infraOpen, setInfraOpen] = useState(true);
  const [devOpen, setDevOpen] = useState(true);

  useEffect(() => { feather.replace(); }, [infraOpen, devOpen]);
  useEffect(() => { feather.replace(); }, []);

  return (
    <div className="container-fluid px-3 h-flex">
      {/* Keep .row as Bootstrap's default (horizontal) so columns sit side-by-side */}
      <div className="row">
        {/* LEFT: single card with header + vertical tree; full height */}
        <div className="col-12 col-lg-3 py-3 flex-col">
          <div className="card rounded-3 shadow-sm border h-100">
            <div className="card-header rounded-3">About</div>
            <div className="card-body d-flex flex-column">
              <div className="d-grid gap-2">
                {/* Overview */}
                <button
                  className={`btn btn-sm text-start rounded-3 ${topic === 'overview' ? 'btn-primary text-white' : 'btn-light'}`}
                  onClick={() => setTopic('overview')}
                >
                  Overview
                </button>

                {/* Infrastructure */}
                <div>
                  <button
                    className="btn btn-sm w-100 text-start rounded-3 btn-light d-flex align-items-center justify-content-between"
                    onClick={() => setInfraOpen(v => !v)}
                    aria-expanded={infraOpen}
                    aria-controls="infra-children"
                  >
                    <span>Infrastructure</span>
                    <i data-feather="chevron-right" className={infraOpen ? 'rotate-90' : ''}></i>
                  </button>

                  <div id="infra-children" className={`mt-2 ${infraOpen ? '' : 'd-none'}`}>
                    <div className="d-grid gap-2 ps-3">
                      <button
                        className={`btn btn-sm text-start rounded-3 ${topic === 'infra_fe' ? 'btn-primary text-white' : 'btn-light'}`}
                        onClick={() => setTopic('infra_fe')}
                      >
                        Front End
                      </button>
                      <button
                        className={`btn btn-sm text-start rounded-3 ${topic === 'infra_be' ? 'btn-primary text-white' : 'btn-light'}`}
                        onClick={() => setTopic('infra_be')}
                      >
                        Back End
                      </button>
                      <button
                        className={`btn btn-sm text-start rounded-3 ${topic === 'infra_db' ? 'btn-primary text-white' : 'btn-light'}`}
                        onClick={() => setTopic('infra_db')}
                      >
                        Database
                      </button>
                      <button
                        className={`btn btn-sm text-start rounded-3 ${topic === 'infra_api' ? 'btn-primary text-white' : 'btn-light'}`}
                        onClick={() => setTopic('infra_api')}
                      >
                        API
                      </button>
                    </div>
                  </div>
                </div>

                {/* GPT & Billing */}
                <button
                  className={`btn btn-sm text-start rounded-3 ${topic === 'gpt_billing' ? 'btn-primary text-white' : 'btn-light'}`}
                  onClick={() => setTopic('gpt_billing')}
                >
                  GPT & Billing
                </button>

                {/* Development */}
                <div>
                  <button
                    className="btn btn-sm w-100 text-start rounded-3 btn-light d-flex align-items-center justify-content-between"
                    onClick={() => setDevOpen(v => !v)}
                    aria-expanded={devOpen}
                    aria-controls="dev-children"
                  >
                    <span>Development</span>
                    <i data-feather="chevron-right" className={devOpen ? 'rotate-90' : ''}></i>
                  </button>

                  <div id="dev-children" className={`mt-2 ${devOpen ? '' : 'd-none'}`}>
                    <div className="d-grid gap-2 ps-3">
                      <button
                        className={`btn btn-sm text-start rounded-3 ${topic === 'dev_getting_started' ? 'btn-primary text-white' : 'btn-light'}`}
                        onClick={() => setTopic('dev_getting_started')}
                      >
                        Getting Started
                      </button>
                      <button
                        className={`btn btn-sm text-start rounded-3 ${topic === 'dev_running' ? 'btn-primary text-white' : 'btn-light'}`}
                        onClick={() => setTopic('dev_running')}
                      >
                        Running Locally
                      </button>
                      <button
                        className={`btn btn-sm text-start rounded-3 ${topic === 'dev_env' ? 'btn-primary text-white' : 'btn-light'}`}
                        onClick={() => setTopic('dev_env')}
                      >
                        Environment & Secrets
                      </button>
                    </div>
                  </div>
                </div>

              </div>
              <div className="flex-grow-1"></div>
            </div>
          </div>
        </div>

        {/* RIGHT: document as a full-height card with rounded outline */}
        <div className="col-12 col-lg-9 py-3 flex-col">
          <div className="card rounded-3 shadow-sm border h-100">
            <div className="card-body d-flex flex-column">
              <h1 className="h4 mb-3">{CONTENT[topic].title}</h1>
              <div className="text-body flex-grow-1 overflow-auto">
                {CONTENT[topic].body.split('\n').map((line, idx) => {
                  const t = line.trim();
                  if (!t) return <p key={idx} className="mb-2">&nbsp;</p>;
                  if (t.startsWith('- ')) {
                    return <p key={idx} className="mb-1">{t}</p>;
                  }
                  if (t.endsWith(':')) {
                    return <h2 key={idx} className="h6 mt-3">{t.replace(':','')}</h2>;
                  }
                  return <p key={idx} className="mb-2">{t}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
