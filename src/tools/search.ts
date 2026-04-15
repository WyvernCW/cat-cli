import fglob from 'fast-glob';
import { execSync } from 'node:child_process';
import { logDebug } from '../utils/logger.js';
import { resolvePath } from '../utils/paths.js';

export async function glob(args: { pattern: string; cwd?: string; ignore?: string[] }): Promise<any> {
  const cwd = args.cwd ? resolvePath(args.cwd) : process.cwd();
  logDebug(`Glob search: ${args.pattern} in ${cwd}`);

  const matches = await fglob(args.pattern, {
    cwd,
    ignore: args.ignore || ['**/node_modules/**', '**/.git/**'],
    absolute: true,
  });

  return { matches, total: matches.length };
}

export async function grep(args: { pattern: string; path?: string; case_insensitive?: boolean }): Promise<any> {
  const searchPath = args.path ? resolvePath(args.path) : process.cwd();
  logDebug(`Grep search: ${args.pattern} in ${searchPath}`);

  try {
    const flags = args.case_insensitive ? '-i' : '';
    const cmd = `rg --column --line-number --no-heading --color never ${flags} "${args.pattern}" "${searchPath}"`;
    const output = execSync(cmd, { encoding: 'utf8' });
    const lines = output.split('\n').filter(Boolean);

    const matches = lines.map(line => {
      const [file, line_number, column, ...contentParts] = line.split(':');
      return {
        file,
        line_number: parseInt(line_number),
        column: parseInt(column),
        line_content: contentParts.join(':'),
      };
    });

    return { matches: matches.slice(0, 500), total: matches.length };
  } catch (error: any) {
    if (error.status === 1) return { matches: [], total: 0 }; // rg found no matches
    throw error;
  }
}
