import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const responses = require('./local-responses.json');

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function wordCount(text) {
  return text.split(/\s+/).filter(Boolean).length;
}

function matchesTrigger(text, trigger) {
  const pattern = new RegExp(`\\b${escapeRegex(trigger)}\\b`, 'i');
  return pattern.test(text);
}

function weightedPick(options) {
  const total = options.reduce((sum, opt) => sum + (opt.weight || 1), 0);
  let roll = Math.random() * total;
  for (const opt of options) {
    roll -= opt.weight || 1;
    if (roll <= 0) return opt.text;
  }
  return options[options.length - 1]?.text || '';
}

/**
 * Returns a canned reply for short/simple user inputs.
 * @param {string} userText
 */
export function getLocalReply(userText) {
  if (!userText || typeof userText !== 'string') return null;
  const cleaned = userText.toLowerCase().trim().replace(/[^\w\s']/g, ' ');
  const words = wordCount(cleaned);

  for (const pattern of responses.patterns) {
    if (pattern.maxWords && words > pattern.maxWords) continue;
    if (!Array.isArray(pattern.triggers)) continue;

    const hit = pattern.triggers.some((trigger) => matchesTrigger(cleaned, trigger));
    if (!hit) continue;

    return { text: weightedPick(pattern.responses), source: pattern.id };
  }

  return null;
}
