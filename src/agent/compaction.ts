import { logDebug } from '../utils/logger.js';
import { estimateTokens } from '../utils/tokens.js';
import type { Message } from './loop.js';

/**
 * Manages context window by summarizing or truncating old messages
 * when the token count exceeds the threshold.
 */
export async function compactContext(messages: Message[]): Promise<Message[]> {
  const tokenEstimate = estimateTokens(JSON.stringify(messages));
  
  // Threshold: ~100k tokens (using 100,000 as defined in spec)
  if (tokenEstimate < 100000) {
    return messages;
  }

  logDebug(`Context threshold exceeded (${tokenEstimate} tokens). Compacting...`);

  // Keep the system prompt (index 0 usually) and the last 10 messages
  const systemPrompt = messages[0]?.role === 'system' ? messages[0] : null;
  const recentMessages = messages.slice(-10);
  
  const summaryMessage: Message = {
    role: 'system',
    content: '(=^.^=) Context compacted. The conversation history has been summarized to stay within limits.'
  };

  const compacted = systemPrompt 
    ? [systemPrompt, summaryMessage, ...recentMessages]
    : [summaryMessage, ...recentMessages];

  logDebug(`Context compacted to ${compacted.length} messages.`);
  return compacted;
}
