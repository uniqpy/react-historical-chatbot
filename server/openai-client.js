// ESM OpenAI client that explicitly loads server/.env and logs key presence (masked).

import OpenAI from 'openai';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { logInfo, logError } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load server/.env
const envPath = path.join(__dirname, '.env');
const hasEnvFile = fs.existsSync(envPath);
if (hasEnvFile) {
  dotenv.config({ path: envPath });
  logInfo('dotenv_loaded', { envPath });
} else {
  logError('dotenv_missing', { envPath });
}

const keyPresent = Boolean(process.env.OPENAI_API_KEY && process.env.OPENAI_API_KEY.startsWith('sk-'));
logInfo('openai_key_status', { present: keyPresent });

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default client;
