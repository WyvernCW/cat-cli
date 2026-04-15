import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { logDebug } from '../utils/logger.js';

export interface Task {
  id: string;
  content: string;
  status: 'todo' | 'in_progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
}

const TODO_DIR = path.join(os.homedir(), '.cat', 'tasks');

function getTodoPath(sessionId: string): string {
  return path.join(TODO_DIR, `${sessionId}.json`);
}

export async function todo_write(args: { tasks: Task[] }, sessionId: string): Promise<any> {
  const filePath = getTodoPath(sessionId);
  logDebug(`Writing TODO tasks to: ${filePath}`);

  await fs.mkdir(TODO_DIR, { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(args.tasks, null, 2));

  return { success: true, tasks_written: args.tasks.length };
}

export async function todo_read(sessionId: string): Promise<Task[]> {
  const filePath = getTodoPath(sessionId);
  logDebug(`Reading TODO tasks from: ${filePath}`);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return [];
  }
}
