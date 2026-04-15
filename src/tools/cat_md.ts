import fs from 'node:fs/promises';
import path from 'node:path';
import { logDebug } from '../utils/logger.js';

export async function cat_md_update(args: { section: string; content: string }): Promise<any> {
  const filePath = path.join(process.cwd(), 'CAT.md');
  logDebug(`Updating CAT.md section: ${args.section}`);

  try {
    let content = await fs.readFile(filePath, 'utf8');
    const sectionHeader = `## ${args.section}`;
    
    if (content.includes(sectionHeader)) {
      // Find the end of the section (either another ## or end of file)
      const lines = content.split('\n');
      const startIdx = lines.findIndex(l => l.trim() === sectionHeader);
      let endIdx = lines.findIndex((l, i) => i > startIdx && l.trim().startsWith('## '));
      if (endIdx === -1) endIdx = lines.length;

      lines.splice(startIdx + 1, endIdx - startIdx - 1, args.content);
      content = lines.join('\n');
    } else {
      content += `\n\n${sectionHeader}\n${args.content}`;
    }

    await fs.writeFile(filePath, content, 'utf8');
    return { success: true, section_updated: args.section };
  } catch (error) {
    throw new Error('CAT.md not found in current directory. Run /init first.');
  }
}
