// ESM Express server that returns Caligula style responses from a gemini model.

import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import morgan from 'morgan';
import {sendUserMessagetoGemini} from './googlegemini-client.js';

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
  res.json({ GeminiKeyPresent: false, cid: req.correlationId });
});

// Chat route
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

    console.log(lastUser);

    const AIresponse = await sendUserMessagetoGemini(lastUser.text);
    console.log(AIresponse)
    res.json({ success: true, reply: AIresponse, cid });
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

