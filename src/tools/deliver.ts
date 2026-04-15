import fs from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import path from 'node:path';
import archiver from 'archiver';
import { logDebug } from '../utils/logger.js';
import { resolvePath } from '../utils/paths.js';

export async function deliver_files(args: { 
  files: Array<{ filename: string; content: string }>;
  output_dir?: string;
  zip_name?: string;
}): Promise<any> {
  const outputDir = resolvePath(args.output_dir || './');
  logDebug(`Delivering ${args.files.length} files to ${outputDir}`);

  await fs.mkdir(outputDir, { recursive: true });

  const delivered = [];
  for (const file of args.files) {
    const filePath = path.join(outputDir, file.filename);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, file.content, 'utf8');
    const stat = await fs.stat(filePath);
    delivered.push({
      filename: file.filename,
      path: filePath,
      size_bytes: stat.size,
    });
  }

  let zipPath: string | undefined;
  if (args.files.length > 1 || args.zip_name) {
    const zipName = args.zip_name || `cat_delivery_${Date.now()}.zip`;
    zipPath = path.join(outputDir, zipName);
    
    await new Promise((resolve, reject) => {
      const output = createWriteStream(zipPath!);
      const archive = archiver('zip', { zlib: { level: 9 } });

      output.on('close', resolve);
      archive.on('error', reject);

      archive.pipe(output);
      for (const file of args.files) {
        archive.append(file.content, { name: file.filename });
      }
      archive.finalize();
    });
  }

  return { delivered, zip_path: zipPath, total: delivered.length };
}
