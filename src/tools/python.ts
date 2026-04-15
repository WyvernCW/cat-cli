import { spawn } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import { logDebug } from '../utils/logger.js';

export async function executePython(args: { code: string; timeout_ms?: number }): Promise<any> {
  const startTime = Date.now();
  const timeout = args.timeout_ms || 120000;
  const tempFile = path.join(os.tmpdir(), `cat_py_${Date.now()}.py`);

  logDebug(`Executing python code: ${args.code.slice(0, 100)}...`);

  await fs.writeFile(tempFile, args.code);

  return new Promise((resolve) => {
    const child = spawn('python3', [tempFile], {
      env: process.env,
    });

    let stdout = '';
    let stderr = '';
    let timed_out = false;

    const timer = setTimeout(() => {
      timed_out = true;
      child.kill();
    }, timeout);

    child.stdout.on('data', (data) => {
      stdout += data.toString();
    });

    child.stderr.on('data', (data) => {
      stderr += data.toString();
    });

    child.on('close', async (code) => {
      clearTimeout(timer);
      await fs.rm(tempFile, { force: true });
      resolve({
        stdout,
        stderr,
        exit_code: code,
        duration_ms: Date.now() - startTime,
        timed_out,
      });
    });

    child.on('error', async (err) => {
      clearTimeout(timer);
      await fs.rm(tempFile, { force: true });
      resolve({
        stdout,
        stderr: err.message,
        exit_code: 1,
        duration_ms: Date.now() - startTime,
        timed_out,
      });
    });
  });
}
