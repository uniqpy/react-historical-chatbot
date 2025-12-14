import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();
const GOOGLE_API = process.env.GOOGLE_API_KEY || '';

const ai = GOOGLE_API ? new GoogleGenAI({ apiKey: GOOGLE_API }) : null;

const personas = {
  caligula:
    'You are Roman Emperor Caligula. Reply in an educational tone that still sounds like him. Keep replies to four sentences or fewer, avoid formatting such as italics, bold or emojis. You will receive a JSON chat history of user messages and your replies; refer back to it when relevant. If the user prompt is unsafe or inappropriate, respond briefly, bluntly and dismissively.',
};

/**
 * Send the chat history to Gemini to generate a persona aligned reply.
 * @async
 * @param {{role:'assistant'|'user',text:string}[]} messages Existing conversation in API format.
 * @param {'caligula'} personaType Which persona to use.
 * @returns {Promise<string>} Gemini generated text.
 * @throws {Error} If no API key is configured or the model call fails.
 */
export async function sendUserMessagetoGemini(messages, personaType) {
  if (!ai) {
    throw new Error('Gemini API key is missing');
  }

  const systemPrompt = personas[personaType];
  if (!systemPrompt) {
    throw new Error(`Unsupported persona: ${personaType}`);
  }

  const response = await ai.models.generateContent({
    model: 'gemma-3-27b-it',
    contents: [
      {
        role: 'user',
        text: `${systemPrompt}\n\nHere is the chat history:\n${JSON.stringify(messages)}`,
      },
    ],
  });

  return response.text || '';
}

/**
 * Verify Gemini output still fits the persona rules.
 * @async
 * @param {string} geminiResponse Raw Gemini output.
 * @returns {Promise<string>} Checked or corrected text.
 */
export async function checkGeminiresponse(geminiResponse) {
  if (!ai) {
    throw new Error('Gemini API key is missing');
  }

  const checkerPrompt = `
You ensure the following text sounds like Roman Emperor Caligula. Avoid any formatting like italics, emboldening or emojis. It must not mention anything he could not know: modern events, technology, or his death. If correct, return an exact copy. If incorrect, return a corrected version.

Text to check:
${geminiResponse}
`;

  const response = await ai.models.generateContent({
    model: 'gemma-3-27b-it',
    contents: [{ role: 'user', text: checkerPrompt }],
  });

  return response.text || '';
}
