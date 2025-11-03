// ESM Express server that returns MOCK Lincoln-style replies.
// No OpenAI key required. No external calls.

import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import morgan from 'morgan';

// Minimal structured logs
function logInfo(msg, meta = {}) {
  console.log(JSON.stringify({ level: 'info', time: new Date().toISOString(), msg, ...meta }));
}
function logError(msg, meta = {}) {
  console.error(JSON.stringify({ level: 'error', time: new Date().toISOString(), msg, ...meta }));
}

logInfo('boot', { msg: 'starting mock server/index.js' });

const app = express();

// Correlation ID per request
app.use((req, res, next) => {
  req.correlationId = crypto.randomUUID();
  res.setHeader('X-Correlation-ID', req.correlationId);
  next();
});

// Access logs
morgan.token('cid', (req) => req.correlationId);
app.use(morgan(':date[iso] cid=:cid :method :url :status :response-time ms'));

app.use(express.json());

// CORS (fine even if you use Vite proxy)
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));

// Health/debug
app.get('/api/health', (req, res) => res.json({ ok: true, cid: req.correlationId }));
app.get('/api/debug/env', (req, res) => {
  // For mocks, there is no key. Keep endpoint for parity.
  res.json({ openaiKeyPresent: false, cid: req.correlationId });
});

// --- Mock generator ---
// Returns a Lincoln-flavored response with light variation and a nod to the user's last line.
function makeLincolnMockReply(userText = '') {
  const trims = String(userText || '').trim();
  const fragments = [
    "My friend,",
    "If I may speak plainly,",
    "Permit me to observe,",
    "In truth,",
    "I would submit,"
  ];
  const closers = [
    "Let us proceed with firmness and good sense.",
    "May reason and charity guide us.",
    "I trust this helps to steady our course.",
    "That is my humble judgment.",
    "Let us act with both prudence and resolve."
  ];
  const picks = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const echo = trims ? ` You write: “${trims.slice(0, 140)}${trims.length > 140 ? '…' : ''}”` : '';

  return [
    picks(fragments),
    " I aim to answer in a spirit of clarity and union.",
    echo,
    " In the matters before us, weigh facts carefully, avoid haste, and keep faith with first principles.",
    " Where doubt persists, test your assumptions against experience and honest accounting.",
    " ",
    picks(closers)
  ].join('');
}

// Chat route — returns a mock reply after a short delay to feel realistic
app.post('/api/chat', async (req, res) => {
  const cid = req.correlationId;
  try {
    const { messages } = req.body || {};
    if (!Array.isArray(messages)) {
      return res.status(400).json({ success: false, error: 'messages must be an array', cid });
    }

    // Find the most recent user message from the payload
    const lastUser = [...messages]
      .reverse()
      .find((m) => (m?.role === 'user') && typeof m?.text === 'string');

    const reply = makeLincolnMockReply(lastUser?.text || '');

    // Simulate latency (feel like a real model)
    await new Promise((r) => setTimeout(r, 350));

    res.json({ success: true, reply, cid });
  } catch (err) {
    logError('mock_chat_failed', { cid, message: err?.message });
    res.status(500).json({ success: false, error: 'server_error', cid });
  }
});

// Start server
const port = Number(process.env.PORT || 5174);
const server = app.listen(port, () => {
  logInfo('listening', { port, mode: 'mock' });
});
server.on('error', (err) => {
  logError('listen_error', { message: err?.message, code: err?.code, port });
});
