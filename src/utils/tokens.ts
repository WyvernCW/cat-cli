/**
 * Rough estimation of token count based on string length.
 * Standard heuristic is ~4 characters per token.
 */
export function estimateTokens(input: string | any): number {
  if (typeof input !== 'string') {
    input = JSON.stringify(input);
  }
  return Math.ceil(input.length / 4);
}

/**
 * Truncates a string to fit within a specified token limit.
 */
export function truncateToTokens(input: string, maxTokens: number): string {
  const maxChars = maxTokens * 4;
  if (input.length <= maxChars) return input;
  return input.slice(0, maxChars) + '... [TRUNCATED]';
}
