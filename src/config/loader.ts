import { cosmiconfig } from 'cosmiconfig';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { DEFAULTS } from './defaults.js';
import type { Config } from './schema.js';

const CONFIG_DIR = path.join(os.homedir(), '.cat');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

export async function loadConfig(): Promise<Config> {
  // Ensure required directories exist (Section 27)
  const dirs = [
    CONFIG_DIR,
    path.join(CONFIG_DIR, 'sessions'),
    path.join(CONFIG_DIR, 'tasks'),
    path.join(CONFIG_DIR, 'tmp')
  ];
  
  for (const dir of dirs) {
    await fs.mkdir(dir, { recursive: true });
  }

  const explorer = cosmiconfig('cat', {
    searchPlaces: [
      'config.json',
      '.catrc',
      '.catrc.json',
      '.catrc.yaml',
      '.catrc.yml',
      '.catrc.js',
      '.catrc.cjs',
    ],
    stopDir: os.homedir(),
  });

  try {
    const result = await explorer.search(CONFIG_DIR);
    if (result && result.config) {
      return { ...DEFAULTS, ...result.config };
    }
  } catch (error) {
    console.error('Error loading config:', error);
  }

  return DEFAULTS;
}

export async function saveConfig(config: Config): Promise<void> {
  try {
    await fs.mkdir(CONFIG_DIR, { recursive: true });
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
  } catch (error) {
    console.error('Error saving config:', error);
  }
}

export function getConfigDir(): string {
  return CONFIG_DIR;
}
