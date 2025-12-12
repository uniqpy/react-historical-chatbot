import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import morgan from 'morgan';
import {sendUserMessagetoGemini,checkGeminiresponse} from './googlegemini-client.js';
import { getLocalReply } from './local-engine.js';

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

/**
 * @async
 * @description This route handles when the user on the frontend sends a message to the backend, using a try catch
 * The input is used to generate the Gemini response, this response is then sent back to gemini for verification. It is then packed into a JSON format so it can be sent back to the frontend to be displayed
 * If it fails at any point, it will instead return an error message to the front end. 
 */
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

    if (!lastUser) {
      return res.status(400).json({ success: false, error: 'no_user_message', cid });
    }

    // Try semantic based JSON engine reply first to see if we have applicable response before we try gemini api.
    const localReply = getLocalReply(lastUser.text);
    if (localReply?.text) {
      logInfo('local_reply', { cid, source: localReply.source });
      //simulate latency
      await new Promise((r) => setTimeout(r, 900));
      return res.json({ success: true, reply: localReply.text, cid, source: 'local' });
    }

      //sends user input to AI
    const preCheckedAIresponse = await sendUserMessagetoGemini(messages,"caligula"); //user input then which roman figure user wants to talk to

    //before sending output to the front end, we need to perform a check on the answer generated...
    const AIresponse = await checkGeminiresponse(preCheckedAIresponse);

    //now we peformed all checks, we can send GenAI output to user...
    console.log(AIresponse)
    res.json({ success: true, reply: AIresponse, cid });
  } catch (err) {
    logError('mock_chat_failed', { cid, message: err?.message });
    res.status(500).json({ success: false, error: 'server_error', cid });
  }
});

//used to for frontend to check if back end is online
app.post("/api/checker", async (req,res) => {
  return res.json({ success: true, cid});
});

// Start server
const port = Number(process.env.PORT || 5174);
const server = app.listen(port, () => {
  logInfo('listening', { port, mode: 'mock' });
});
server.on('error', (err) => {
  logError('listen_error', { message: err?.message, code: err?.code, port });
});
