import { nanoid } from 'nanoid';
import { streamFromNvidia, type ToolCall } from './stream.js';
import { executeTool } from '../tools/executor.js';
import { TOOL_SCHEMAS } from '../tools/registry.js';
import { buildSystemPrompt } from './prompt.js';
import { logDebug } from '../utils/logger.js';
import { compactContext } from './compaction.js';
import { saveSession, generateSessionTitle } from './sessions.js';
import { extractMemories } from './memory.js';
import type { Config } from '../config/schema.js';

export interface Message {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: any;
  tool_call_id?: string;
  name?: string;
}

export interface SessionState {
  id: string;
  title: string;
  messages: Message[];
  turns: number;
  created_at: number;
  updated_at: number;
}

export interface LoopCallbacks {
  onThinkChunk?: (chunk: string) => void;
  onTextChunk?: (chunk: string) => void;
  onStatus?: (status: string) => void;
  onMascotState?: (state: any) => void;
  onToolCall?: (call: ToolCall) => void;
  onToolResult?: (call: ToolCall, result: any) => void;
}

/**
 * The Master Agentic Loop (the heart of CAT).
 * Follows the Think -> Act -> Observe pattern.
 */
export class AgentLoop {
  private state: SessionState;
  private config: Config;

  constructor(config: Config, existingState?: SessionState) {
    this.config = config;
    this.state = existingState || {
      id: nanoid(8),
      title: 'New Session',
      messages: [],
      turns: 0,
      created_at: Date.now(),
      updated_at: Date.now(),
    };
  }

  async run(userInput: string, callbacks?: LoopCallbacks): Promise<void> {
    // 1. Add user message
    this.state.messages.push({ role: 'user', content: userInput });
    this.state.turns++;
    this.state.updated_at = Date.now();

    // Trigger UI update immediately after user message added
    callbacks?.onTextChunk?.(''); 

    // Generate title if it's the first turn
    if (this.state.turns === 1 && this.state.title === 'New Session') {
      generateSessionTitle(this.config, userInput).then(title => {
        this.state.title = title;
        saveSession(this.state);
      });
    }

    await saveSession(this.state);

    while (true) {
      // 2. Build system prompt
      const systemPrompt = await buildSystemPrompt(this.config, this.state.id);
      
      // 3. Stream from AI
      callbacks?.onMascotState?.('THINKING');
      callbacks?.onStatus?.('Thinking...');

      // Create a placeholder for the assistant message to support streaming
      const assistantMessage: Message = { role: 'assistant', content: '' };
      this.state.messages.push(assistantMessage);

      const response = await streamFromNvidia(
        this.config.nvidia_api_key,
        systemPrompt,
        this.state.messages.slice(0, -1), // Exclude the placeholder
        TOOL_SCHEMAS,
        {
          onThinkChunk: (chunk) => {
            callbacks?.onThinkChunk?.(chunk);
          },
          onTextChunk: (chunk) => {
            assistantMessage.content += chunk;
            callbacks?.onMascotState?.('STREAMING');
            callbacks?.onTextChunk?.(chunk);
          },
        }
      );

      // 4. Update assistant message with final content
      assistantMessage.content = response.textContent;
      await saveSession(this.state);

      // 5. Check if we need to execute tools
      if (response.toolCalls.length === 0) {
        // No tools? Turn ends.
        callbacks?.onMascotState?.('SUCCESS');
        
        // Background: extract memories
        extractMemories(this.config, userInput, response.textContent).catch(() => {});
        break;
      }

      // 6. Execute tools sequentially
      callbacks?.onMascotState?.('WORKING');
      
      for (const call of response.toolCalls) {
        callbacks?.onStatus?.(`Executing ${call.name}...`);
        callbacks?.onToolCall?.(call);

        try {
          // Note: In a real implementation, we'd check permissions here.
          // For now, we execute all tools.
          const result = await executeTool(call.name, call.arguments, this.state.id, this.config);
          
          this.state.messages.push({
            role: 'tool',
            tool_call_id: call.id,
            name: call.name,
            content: typeof result === 'string' ? result : JSON.stringify(result),
          });

          callbacks?.onToolResult?.(call, result);
        } catch (error: any) {
          logDebug(`Tool execution failed: ${call.name}`, error);
          this.state.messages.push({
            role: 'tool',
            tool_call_id: call.id,
            name: call.name,
            content: JSON.stringify({ error: error.message }),
          });
          callbacks?.onToolResult?.(call, { error: error.message });
        }
      }

      // 7. Check for context compaction
      this.state.messages = await compactContext(this.state.messages);
      
      await saveSession(this.state);

      // 8. Turn limit safety (prevent infinite loops)
      if (this.state.turns > 20) {
        this.state.messages.push({ role: 'system', content: 'Turn limit reached.' });
        break;
      }
      
      this.state.turns++;
      this.state.updated_at = Date.now();
    }
  }

  getState(): SessionState {
    return this.state;
  }
}
