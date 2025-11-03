import { useEffect, useState } from 'react';
import feather from 'feather-icons';

const CONTENT = {
  overview: {
    title: 'About',
    body: `
This project is a Vite + React (JavaScript) frontend styled with Bootstrap. I maintain a full-page chat UI alongside a docs-style About section. During development, the backend runs as a local Express server. For now it returns mock Abraham Lincoln responses so I can iterate on the interface without requiring a paid API key. When I am ready, I can switch the backend to call the real OpenAI API.
`
  },

  // ===== Infrastructure =====
  infra_fe: {
    title: 'Infrastructure • Front End',
    body: `
Stack
- React + Vite (JavaScript).
- Bootstrap 5 for layout and components.
- Feather icons for inline icons.
- React Router for routing.

Structure
- The chat page uses a full-height layout with a bottom input card.
- The About page uses a two-column layout: a left tree navigation and a right document pane.
- The Vite dev proxy maps /api/* calls to the backend server to avoid CORS during development.
`
  },
  infra_be: {
    title: 'Infrastructure • Back End',
    body: `
Development Server
- Express (Node.js) runs locally.
- The server currently returns mock Abraham Lincoln-style replies.
- When real OpenAI calls are enabled, the same /api/chat route proxies to the OpenAI API.

Routes
- GET /api/health: health check.
- POST /api/chat: chat endpoint consumed by the frontend.

Security
- I keep API keys and any other secrets on the server only. The client never holds secrets.
`
  },
  infra_db: {
    title: 'Infrastructure • Database',
    body: `
Current State
- No database is required for the mock-only setup.

Future
- If I extend the app, I can add a MariaDB-backed Express service using the official MariaDB or mysql2 driver.
- I will keep connection strings in server/.env and never expose them to the client.
- I will use prepared statements and a minimal DAO layer to keep things safe and testable.
`
  },
  infra_api: {
    title: 'Infrastructure • API',
    body: `
Local API
- Provided by the Express server under /api/*.
- Vite proxy forwards frontend requests to the Express server to avoid CORS during development.

OpenAI (Optional)
- When I switch from mock to real, the backend will call the OpenAI API from the server only.
- This requires a paid API key stored in server/.env.
`
  },

  // ===== GPT & Billing =====
  gpt_billing: {
    title: 'GPT & Billing (Notes)',
    body: `
The OpenAI API does not provide a free developer tier. A paid API key is required to call models such as gpt-4o-mini. I default to a mock backend so I can build and refine the interface without cost.

Steps to enable real API later
1) Add a payment method on the OpenAI platform.
2) Create a project and API key.
3) Add OPENAI_API_KEY=sk-... to server/.env and restart the server.
4) Replace the mock /api/chat handler with the real OpenAI call.
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
- For real OpenAI integration later: npm i openai

Layout
- src/              React + Vite frontend
- server/           Express backend (mock by default)
- vite.config.js    Dev proxy for /api
- package.json
- server/.env       Backend secrets when using real APIs
`
  },
  dev_running: {
    title: 'Development • Running Locally',
    body: `
Backend (Mock Mode)
- node server/index.js
- Expect a log line indicating the server is listening, default port 5174, mode: mock.

Proxy
- vite.config.js maps "/api" to "http://localhost:5174".

Frontend
- npm run dev
- Open http://localhost:5173

Health Checks
- Backend health:  http://localhost:5174/api/health  -> { ok: true }
- Backend debug:   http://localhost:5174/api/debug/env -> mock mode returns openaiKeyPresent: false

Behavior
- The chat page sends messages to /api/chat and receives mock Abraham Lincoln-style responses.
`
  },
  dev_env: {
    title: 'Development • Environment & Secrets',
    body: `
Mock Mode
- No secrets required. The server does not call external APIs.

Real OpenAI Mode
- Create server/.env with:
  OPENAI_API_KEY=sk-... (paid key)
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
