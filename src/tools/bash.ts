import { spawn } from 'node:child_process';
import { logDebug } from '../utils/logger.js';

export interface BashArgs {
  command: string;
  cwd?: string;
  timeout_ms?: number;
}

export interface BashResult {
  stdout: string;
  stderr: string;
  exit_code: number | null;
  duration_ms: number;
  timed_out: boolean;
}

export async function executeBash(args: BashArgs): Promise<BashResult> {
  const startTime = Date.now();
  const timeout = args.timeout_ms || 120000;
  const cwd = args.cwd || process.cwd();

  logDebug(`Executing bash command: ${args.command} in ${cwd}`);

  return new Promise((resolve) => {
    const child = spawn(args.command, {
      shell: true,
      cwd,
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

    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({
        stdout,
        stderr,
        exit_code: code,
        duration_ms: Date.now() - startTime,
        timed_out,
      });
    });

    child.on('error', (err) => {
      clearTimeout(timer);
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
