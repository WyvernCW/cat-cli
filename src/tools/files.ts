import fs from 'node:fs/promises';
import path from 'node:path';
import { logDebug } from '../utils/logger.js';
import { resolvePath } from '../utils/paths.js';

export async function read_file(args: { path: string; start_line?: number; end_line?: number }): Promise<any> {
  const filePath = resolvePath(args.path);
  logDebug(`Reading file: ${filePath}`);

  const content = await fs.readFile(filePath, 'utf8');
  const lines = content.split('\n');

  let result = content;
  if (args.start_line !== undefined || args.end_line !== undefined) {
    const start = (args.start_line || 1) - 1;
    const end = args.end_line || lines.length;
    result = lines.slice(start, end).join('\n');
  }

  const MAX_SIZE = 100 * 1024; // 100KB
  let truncated = false;
  if (result.length > MAX_SIZE) {
    result = result.slice(0, MAX_SIZE) + '\n... [TRUNCATED]';
    truncated = true;
  }

  return {
    content: result,
    total_lines: lines.length,
    size_bytes: Buffer.byteLength(content),
    truncated,
    path_resolved: filePath,
  };
}

export async function write_file(args: { path: string; content: string; create_dirs?: boolean }): Promise<any> {
  const filePath = resolvePath(args.path);
  logDebug(`Writing file: ${filePath}`);

  if (args.create_dirs) {
    await fs.mkdir(path.dirname(filePath), { recursive: true });
  }

  await fs.writeFile(filePath, args.content, 'utf8');
  return { success: true, bytes_written: Buffer.byteLength(args.content), path_resolved: filePath };
}

export async function edit_file(args: { path: string; old_str: string; new_str: string }): Promise<any> {
  const filePath = resolvePath(args.path);
  logDebug(`Editing file: ${filePath}`);

  const content = await fs.readFile(filePath, 'utf8');
  const matches = content.split(args.old_str).length - 1;

  if (matches === 0) {
    throw new Error(`String "${args.old_str}" not found in file.`);
  }
  if (matches > 1) {
    throw new Error(`String "${args.old_str}" is ambiguous (${matches} matches found). Provide more context.`);
  }

  const newContent = content.replace(args.old_str, args.new_str);
  await fs.writeFile(filePath, newContent, 'utf8');

  return { success: true, matches_found: 1, path_resolved: filePath };
}

export async function create_dir(args: { path: string }): Promise<any> {
  const dirPath = resolvePath(args.path);
  logDebug(`Creating directory: ${dirPath}`);
  await fs.mkdir(dirPath, { recursive: true });
  return { success: true, path_resolved: dirPath };
}

export async function delete_file(args: { path: string }): Promise<any> {
  const filePath = resolvePath(args.path);
  logDebug(`Deleting file: ${filePath}`);
  await fs.rm(filePath, { force: true });
  return { success: true, path_resolved: filePath };
}
