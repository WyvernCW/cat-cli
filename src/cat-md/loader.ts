import fs from 'node:fs/promises';
import path from 'node:path';
import { logDebug } from '../utils/logger.js';

/**
 * Searches for CAT.md starting from the current directory and walking UP.
 * Returns the content of the first CAT.md found, or null.
 */
export async function loadCatMd(cwd: string = process.cwd()): Promise<string | null> {
  let currentDir = path.resolve(cwd);
  const homeDir = path.resolve(process.env.HOME || process.env.USERPROFILE || '/');

  while (true) {
    const catMdPath = path.join(currentDir, 'CAT.md');
    try {
      const stats = await fs.stat(catMdPath).catch(() => null);
      if (stats && stats.isFile()) {
        logDebug(`CAT.md loaded from: ${catMdPath}`);
        return await fs.readFile(catMdPath, 'utf8');
      }
    } catch (error) {
      // Ignore errors during directory traversal
    }

    // Stop if we've reached the root or home directory (to avoid scanning too far)
    if (currentDir === homeDir || currentDir === path.dirname(currentDir)) {
      break;
    }

    currentDir = path.dirname(currentDir);
  }

  // Also check ~/.cat/CAT.md for global instructions (Section 06)
  const globalPath = path.join(homeDir, '.cat', 'CAT.md');
  try {
    const globalStats = await fs.stat(globalPath).catch(() => null);
    if (globalStats && globalStats.isFile()) {
      logDebug(`Global CAT.md loaded from: ${globalPath}`);
      return await fs.readFile(globalPath, 'utf8');
    }
  } catch (e) {}

  return null;
}
