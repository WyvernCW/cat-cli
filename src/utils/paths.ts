import path from 'node:path';
import os from 'node:os';

/**
 * Resolves ~ to the user's home directory.
 */
export function resolvePath(inputPath: string): string {
  if (!inputPath) return process.cwd();
  if (inputPath.startsWith('~')) {
    return path.join(os.homedir(), inputPath.slice(1));
  }
  return path.resolve(inputPath);
}

/**
 * Returns the path relative to the home directory if applicable, using ~
 */
export function tildify(absolutePath: string): string {
  const home = os.homedir();
  if (absolutePath.startsWith(home)) {
    return '~' + absolutePath.slice(home.length);
  }
  return absolutePath;
}
