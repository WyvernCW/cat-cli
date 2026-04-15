import fetch from 'node-fetch';
import type { Response } from 'node-fetch';

export interface ToolCall {
  id: string;
  name: string;
  arguments: any;
}

export interface StreamResponse {
  thinkContent: string;
  textContent: string;
  toolCalls: ToolCall[];
  elapsed_ms: number;
}

export interface StreamCallbacks {
  onThinkChunk?: (chunk: string) => void;
  onTextChunk?: (chunk: string) => void;
  onToolCallChunk?: (toolCalls: ToolCall[]) => void;
}

export async function streamFromNvidia(
  apiKey: string,
  systemPrompt: string,
  messages: any[],
  tools: any[],
  callbacks?: StreamCallbacks,
  retries = 3
): Promise<StreamResponse> {
  const startTime = Date.now();
  let attempt = 0;

  while (attempt < retries) {
    try {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'minimaxai/minimax-m2.7',
          messages: [
            { role: 'system', content: systemPrompt },
            ...messages
          ],
          tools: tools.length > 0 ? tools : undefined,
          stream: true,
          max_tokens: 8192,
          temperature: 0.72,
          top_p: 0.95,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`NVIDIA API error: ${response.status} ${errText}`);
      }

      const result: StreamResponse = {
        thinkContent: '',
        textContent: '',
        toolCalls: [],
        elapsed_ms: 0,
      };

      let buffer = '';
      let inThink = false;
      const toolCallsAcc: Record<number, any> = {};

      return await new Promise((resolve, reject) => {
        response.body!.on('data', (chunk: Buffer) => {
          const text = chunk.toString();
          buffer += text;

          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (!line.startsWith('data: ')) continue;
            const dataStr = line.slice(6).trim();
            if (dataStr === '[DONE]') {
              result.elapsed_ms = Date.now() - startTime;
              resolve(result);
              return;
            }

            try {
              const json = JSON.parse(dataStr);
              const delta = json.choices[0].delta;

              // Handle <think> tags
              if (delta.content) {
                let content = delta.content;

                // Handle start of <think>
                if (!inThink && content.includes('<think>')) {
                  const parts = content.split('<think>');
                  if (parts[0]) {
                    result.textContent += parts[0];
                    callbacks?.onTextChunk?.(parts[0]);
                  }
                  inThink = true;
                  content = parts[1] || '';
                }

                // Handle end of </think>
                if (inThink && content.includes('</think>')) {
                  const parts = content.split('</think>');
                  if (parts[0]) {
                    result.thinkContent += parts[0];
                    callbacks?.onThinkChunk?.(parts[0]);
                  }
                  inThink = false;
                  content = parts[1] || '';
                }

                if (content) {
                  if (inThink) {
                    result.thinkContent += content;
                    callbacks?.onThinkChunk?.(content);
                  } else {
                    result.textContent += content;
                    callbacks?.onTextChunk?.(content);
                  }
                }
              }

              // Handle tool calls
              if (delta.tool_calls) {
                for (const toolCall of delta.tool_calls) {
                  const index = toolCall.index;
                  if (!toolCallsAcc[index]) {
                    toolCallsAcc[index] = { id: '', name: '', arguments: '' };
                  }
                  if (toolCall.id) toolCallsAcc[index].id = toolCall.id;
                  if (toolCall.function?.name) toolCallsAcc[index].name = toolCall.function.name;
                  if (toolCall.function?.arguments) toolCallsAcc[index].arguments += toolCall.function.arguments;
                }
                // Map accumulator to result toolCalls
                result.toolCalls = Object.values(toolCallsAcc).map(tc => ({
                  id: tc.id,
                  name: tc.name,
                  arguments: tc.arguments ? JSON.parse(tc.arguments) : {},
                }));
                callbacks?.onToolCallChunk?.(result.toolCalls);
              }

            } catch (e) {
              // Ignore parse errors for incomplete chunks
            }
          }
        });

        response.body!.on('end', () => {
          result.elapsed_ms = Date.now() - startTime;
          resolve(result);
        });

        response.body!.on('error', (e) => {
          if (e.code === 'ECONNRESET') {
            reject(e); // Allow retry loop to catch it
          } else {
            reject(e);
          }
        });
      });
    } catch (error: any) {
      attempt++;
      if (attempt >= retries) throw error;
      await new Promise(res => setTimeout(res, 1000 * attempt)); // Fixed: changed resolve to res
    }
  }
  throw new Error('Streaming failed after max retries.');
}
