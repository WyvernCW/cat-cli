import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { logDebug } from '../utils/logger.js';

const MEMORY_FILE = path.join(os.homedir(), '.cat', 'memory.json');

export async function memory_read(): Promise<any> {
  logDebug('Reading memories');
  try {
    const content = await fs.readFile(MEMORY_FILE, 'utf8');
    const data = JSON.parse(content);
    return { memories: data.memories || [], total: (data.memories || []).length, enabled: data.enabled !== false };
  } catch (error) {
    return { memories: [], total: 0, enabled: true };
  }
}

export async function memory_write(args: { facts: string[] }): Promise<any> {
  logDebug(`Writing ${args.facts.length} memories`);
  const current = await memory_read();
  const memories = [...new Set([...current.memories, ...args.facts])].slice(-50); // LRU: keep last 50

  await fs.mkdir(path.dirname(MEMORY_FILE), { recursive: true });
  await fs.writeFile(MEMORY_FILE, JSON.stringify({ memories, enabled: current.enabled, last_updated: new Date().toISOString() }, null, 2));

  return { added: args.facts.length, total: memories.length };
}

export async function ask_user(args: { question: string; options?: string[] }): Promise<any> {
  // This tool is handled specially by the agent loop to pause execution and wait for TUI input
  return { question: args.question, options: args.options };
}
