import { marked } from 'marked';
import TerminalRenderer from 'marked-terminal';

// Configure marked to use terminal renderer for standard CLI output
marked.setOptions({
  renderer: new TerminalRenderer({
    code: (code: string) => `\n${code}\n`,
    blockquote: (quote: string) => `\n> ${quote}\n`,
    heading: (text: string, level: number) => `\n${'#'.repeat(level)} ${text}\n`,
    table: (header: string, body: string) => `\n${header}${body}\n`,
    tab: 2,
  }),
});

/**
 * Renders markdown strings to ANSI-colored terminal output.
 */
export function renderMarkdown(content: string): string {
  if (!content) return '';
  try {
    return marked.parse(content) as string;
  } catch (error) {
    return content;
  }
}
