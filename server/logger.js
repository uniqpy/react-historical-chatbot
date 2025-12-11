// ESM tiny structured logger with ISO timestamps.

/**
 * @func
 * @param {*} msg 
 * @param {*} meta 
 * @description Prints to console logging actions that are performed and when it happened. 
 */
export function logInfo(msg, meta = {}) {
  console.log(JSON.stringify({ level: 'info', time: new Date().toISOString(), msg, ...meta }));
}

/**
 * @func
 * @param {*} msg 
 * @param {*} meta 
 * @description Prints to console logging errors that occur and when it happened. 
 */
export function logError(msg, meta = {}) {
  console.error(JSON.stringify({ level: 'error', time: new Date().toISOString(), msg, ...meta }));
}
