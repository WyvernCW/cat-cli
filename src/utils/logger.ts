import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';

const LOG_FILE = path.join(os.homedir(), '.cat', 'debug.log');

/**
 * Logs a debug message to ~/.cat/debug.log
 */
export async function logDebug(message: string, context?: any): Promise<void> {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}${context ? '\n' + (typeof context === 'string' ? context : JSON.stringify(context, null, 2)) : ''}\n`;

  try {
    await fs.mkdir(path.dirname(LOG_FILE), { recursive: true });
    await fs.appendFile(LOG_FILE, logEntry);
  } catch (error) {
    // Silently fail to avoid crashing the application during TUI rendering
  }
}

/**
 * Clears the debug log file.
 */
export async function clearDebugLog(): Promise<void> {
  try {
    await fs.writeFile(LOG_FILE, '');
  } catch (error) {
    // Ignore errors
  }
}
