import fetch from 'node-fetch';
import { memory_write } from '../tools/memory_tool.js';
import type { Config } from '../config/schema.js';

export async function extractMemories(config: Config, userMsg: string, aiMsg: string): Promise<void> {
  if (!config.memory_enabled || !config.nvidia_api_key) return;

  const prompt = `Extract NEW facts about the user from this exchange. Return ONLY a raw JSON array of strings (max 5 items, ≤20 words each). Focus on: user preferences, skills, project names, workflow patterns. If nothing new, return [].

USER: ${userMsg}
CAT: ${aiMsg}`;

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.nvidia_api_key}`,
      },
      body: JSON.stringify({
        model: 'minimaxai/minimax-m2.7',
        messages: [{ role: 'system', content: prompt }],
        temperature: 0.1,
      }),
    });

    if (response.ok) {
      const json: any = await response.json();
      const content = json.choices[0].message.content;
      const facts = JSON.parse(content);
      if (Array.isArray(facts) && facts.length > 0) {
        await memory_write({ facts });
      }
    }
  } catch (error) {
    // Ignore silent failures for background memory extraction
  }
}
