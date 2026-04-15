import chalk from 'chalk';

/**
 * Renders a simple visual diff (+/-) between two strings for terminal output.
 */
export function renderDiff(oldStr: string, newStr: string): string {
  if (oldStr === newStr) return chalk.dim('(No changes)');

  const oldLines = oldStr.split('\n');
  const newLines = newStr.split('\n');

  let output = '';
  
  // Minimal line-by-line diff implementation
  const maxLines = Math.max(oldLines.length, newLines.length);
  for (let i = 0; i < maxLines; i++) {
    if (oldLines[i] !== newLines[i]) {
      if (i < oldLines.length) {
        output += chalk.red(`- ${oldLines[i]}\n`);
      }
      if (i < newLines.length) {
        output += chalk.green(`+ ${newLines[i]}\n`);
      }
    } else if (oldLines[i] !== undefined) {
      // Show some context around changes? For now just show differences.
    }
  }

  return output || chalk.dim('(Structural change, no clear line diff)');
}
