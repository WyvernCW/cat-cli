import { execSync } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs/promises';

export interface GitContext {
  branch: string;
  status: string;
  lastCommits: string;
  isRepo: boolean;
}

/**
 * Retrieves git-related context from the current directory.
 */
export async function getGitContext(cwd: string = process.cwd()): Promise<GitContext | null> {
  try {
    const gitDir = path.join(cwd, '.git');
    const stats = await fs.stat(gitDir).catch(() => null);
    if (!stats) return { branch: '', status: '', lastCommits: '', isRepo: false };

    let branch = '';
    try {
      branch = execSync('git rev-parse --abbrev-ref HEAD', { cwd, encoding: 'utf8' }).trim();
    } catch (e) {}

    let status = '';
    try {
      status = execSync('git status --short', { cwd, encoding: 'utf8' }).trim();
    } catch (e) {}

    let lastCommits = '';
    try {
      lastCommits = execSync('git log --oneline -5', { cwd, encoding: 'utf8' }).trim();
    } catch (e) {}

    return { branch, status, lastCommits, isRepo: true };
  } catch (error) {
    return { branch: '', status: '', lastCommits: '', isRepo: false };
  }
}
