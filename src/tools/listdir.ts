import fs from 'node:fs/promises';
import path from 'node:path';
import { logDebug } from '../utils/logger.js';
import { resolvePath } from '../utils/paths.js';

export async function list_dir(args: { path: string; recursive?: boolean; max_depth?: number }): Promise<any> {
  const dirPath = resolvePath(args.path);
  logDebug(`Listing directory: ${dirPath}`);

  const entries: any[] = [];
  const maxDepth = args.max_depth || 3;

  async function walk(currentPath: string, depth: number) {
    if (depth > maxDepth) return;

    const files = await fs.readdir(currentPath, { withFileTypes: true });
    for (const file of files) {
      if (['node_modules', '.git', '.cat'].includes(file.name)) continue;

      const fullPath = path.join(currentPath, file.name);
      const stat = await fs.stat(fullPath);

      entries.push({
        name: file.name,
        type: file.isDirectory() ? 'directory' : 'file',
        size_bytes: stat.size,
        modified: stat.mtime,
        path: fullPath,
      });

      if (args.recursive && file.isDirectory()) {
        await walk(fullPath, depth + 1);
      }
    }
  }

  await walk(dirPath, 1);
  return { entries: entries.slice(0, 500), total: entries.length, truncated: entries.length > 500 };
}
