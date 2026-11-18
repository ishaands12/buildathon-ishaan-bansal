// The model selects a tool, never calculates numbers or performs actions.
export const ALLOWED_INTENTS = Object.freeze(['sales','cash','stock','udhaar','staff','unknown']);
export function parseModelIntent(response) {
  try {
    const parsed=typeof response==='string'?JSON.parse(response):response;
    return ALLOWED_INTENTS.includes(parsed?.intent)?parsed.intent:'unknown';
  } catch {return 'unknown'}
}
