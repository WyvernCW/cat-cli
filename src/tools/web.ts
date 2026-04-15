import fetch from 'node-fetch';
import { logDebug } from '../utils/logger.js';

export async function web_search(args: { query: string; num_results?: number }, apiKey: string): Promise<any> {
  logDebug(`Web search: ${args.query}`);
  if (!apiKey) throw new Error('Brave Search API key not set.');

  const count = args.num_results || 5;
  const url = `https://api.search.brave.com/res/v1/web/search?q=${encodeURIComponent(args.query)}&count=${count}`;

  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'X-Subscription-Token': apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(`Brave Search error: ${response.status} ${await response.text()}`);
  }

  const json: any = await response.json();
  const results = json.web?.results?.map((r: any) => ({
    title: r.title,
    url: r.url,
    snippet: r.description,
  })) || [];

  return { results, total: results.length };
}

export async function web_fetch(args: { url: string }): Promise<any> {
  logDebug(`Web fetch: ${args.url}`);
  const response = await fetch(args.url, {
    headers: { 'User-Agent': 'cat-cli/1.0.0' },
    timeout: 10000,
  });

  if (!response.ok) {
    throw new Error(`Web fetch error: ${response.status} ${response.statusText}`);
  }

  const content = await response.text();
  // Strip HTML (extremely basic)
  const plainText = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const truncated = plainText.length > 10000;
  
  return {
    content: truncated ? plainText.slice(0, 10000) + '... [TRUNCATED]' : plainText,
    title: args.url,
    url: args.url,
    status_code: response.status,
  };
}
