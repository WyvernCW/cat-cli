import { AgentLoop, type Message } from './loop.js';
import type { Config } from '../config/schema.js';
import { logDebug } from '../utils/logger.js';

/**
 * Runs an isolated sub-agent task.
 * (Section 14, TOOL 19)
 */
export async function runSubAgent(
  config: Config,
  task: string,
  parentSessionId: string,
  callbacks?: any
): Promise<string> {
  logDebug(`Spawning sub-agent for task: ${task}`);

  // Create a sub-agent with its own session state
  const subAgent = new AgentLoop(config);
  
  // Inject sub-agent system instructions
  subAgent.getState().messages.push({
    role: 'system',
    content: `You are a specialized sub-agent task to handle: "${task}". 
Focus exclusively on this task. Return your results as a concise summary string once complete.`,
  });

  // Use parent callbacks for TUI visibility, or a custom "⤷ Sub-task" label
  const subCallbacks = {
    ...callbacks,
    onStatus: (status: string) => callbacks?.onStatus?.(`⤷ ${status}`),
  };

  try {
    await subAgent.run(task, subCallbacks);

    // Extract the final assistant response as the result
    const assistantMessages = subAgent.getState().messages.filter(m => m.role === 'assistant');
    const finalResponse = assistantMessages[assistantMessages.length - 1]?.content || 'Task completed with no output.';

    return typeof finalResponse === 'string' ? finalResponse : JSON.stringify(finalResponse);
  } catch (error: any) {
    logDebug('Sub-agent execution failed:', error);
    return `Error in sub-agent: ${error.message}`;
  }
}
