import { AgentLoop } from '../agent/loop.js';
import type { Config } from '../config/schema.js';

/**
 * Runs CAT in headless mode (no TUI, stream to stdout).
 */
export async function runHeadless(config: Config, task: string): Promise<void> {
  const agent = new AgentLoop(config);

  console.log(`(=^.^=) CAT is executing: ${task}`);

  await agent.run(task, {
    onTextChunk: (chunk: string) => {
      process.stdout.write(chunk);
    },
    onStatus: (status: string) => {
      process.stdout.write(`\n[${status}]\n`);
    }
  });

  process.stdout.write('\n\nCat ── done.\n');
}
