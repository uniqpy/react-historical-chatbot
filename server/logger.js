// ESM tiny structured logger with ISO timestamps.

export function logInfo(msg, meta = {}) {
  console.log(JSON.stringify({ level: 'info', time: new Date().toISOString(), msg, ...meta }));
}

export function logError(msg, meta = {}) {
  console.error(JSON.stringify({ level: 'error', time: new Date().toISOString(), msg, ...meta }));
}
