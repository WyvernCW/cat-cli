import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { logDebug } from '../utils/logger.js';
import type { SessionState } from './loop.js';

const SESSION_DIR = path.join(os.homedir(), '.cat', 'sessions');

/**
 * Saves the session state to ~/.cat/sessions/{id}.json
 */
export async function saveSession(state: SessionState): Promise<void> {
  try {
    await fs.mkdir(SESSION_DIR, { recursive: true });
    const filePath = path.join(SESSION_DIR, `${state.id}.json`);
    
    const data = {
      ...state,
      updated_at: Date.now(),
    };

    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    logDebug('Error saving session:', error);
  }
}

/**
 * Loads a session state by ID.
 */
export async function loadSession(id: string): Promise<SessionState | null> {
  const filePath = path.join(SESSION_DIR, `${id}.json`);
  try {
    const content = await fs.readFile(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return null;
  }
}

/**
 * Lists all available sessions, sorted by last updated.
 */
export async function listSessions(): Promise<any[]> {
  try {
    const files = await fs.readdir(SESSION_DIR);
    const sessions = [];
    
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      try {
        const content = await fs.readFile(path.join(SESSION_DIR, file), 'utf8');
        sessions.push(JSON.parse(content));
      } catch (e) {
        // Skip malformed files
      }
    }
    
    return sessions.sort((a, b) => (b.updated_at || 0) - (a.updated_at || 0));
  } catch (error) {
    return [];
  }
}

/**
 * Generates a title for the session based on the first message.
 * (Section 19: silent non-streaming call)
 */
export async function generateSessionTitle(config: any, firstMessage: string): Promise<string> {
  if (!config.nvidia_api_key) return 'New Session';

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.nvidia_api_key}`,
      },
      body: JSON.stringify({
        model: 'minimaxai/minimax-m2.7',
        messages: [{ 
          role: 'system', 
          content: 'Summarize the following user request in 5 words max. Title only. No quotes.' 
        }, { 
          role: 'user', 
          content: firstMessage 
        }],
        temperature: 0.1,
      }),
    });

    if (response.ok) {
      const json: any = await response.json();
      return json.choices[0].message.content.trim() || 'Chat Session';
    }
  } catch (error) {
    // Fallback
  }
  
  return firstMessage.slice(0, 30) + (firstMessage.length > 30 ? '...' : '');
}
