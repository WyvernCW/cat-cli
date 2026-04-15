import fs from 'node:fs/promises';
import path from 'node:path';

export interface ProjectInfo {
  type: string;
  framework?: string;
  language: string;
  scripts: Record<string, string>;
}

/**
 * Detects the project type, language, and framework based on files in the CWD.
 */
export async function detectProject(cwd: string = process.cwd()): Promise<ProjectInfo> {
  const info: ProjectInfo = {
    type: 'Generic',
    language: 'Unknown',
    scripts: {},
  };

  try {
    // Detect Node.js
    const pkgPath = path.join(cwd, 'package.json');
    const pkgExists = await fs.stat(pkgPath).catch(() => null);
    if (pkgExists) {
      const pkg = JSON.parse(await fs.readFile(pkgPath, 'utf8'));
      info.type = 'Node.js';
      info.language = (pkg.devDependencies?.typescript || pkg.dependencies?.typescript) ? 'TypeScript' : 'JavaScript';
      info.scripts = pkg.scripts || {};

      if (pkg.dependencies?.next) info.framework = 'Next.js';
      else if (pkg.dependencies?.express) info.framework = 'Express';
      else if (pkg.dependencies?.fastify) info.framework = 'Fastify';
      else if (pkg.dependencies?.react) info.framework = 'React';
    }

    // Detect Python
    const pyProject = path.join(cwd, 'pyproject.toml');
    const requirements = path.join(cwd, 'requirements.txt');
    if ((await fs.stat(pyProject).catch(() => null)) || (await fs.stat(requirements).catch(() => null))) {
      info.type = 'Python';
      info.language = 'Python';
      const content = await fs.readFile(pyProject, 'utf8').catch(() => '');
      if (content.includes('django')) info.framework = 'Django';
      else if (content.includes('fastapi')) info.framework = 'FastAPI';
      else if (content.includes('flask')) info.framework = 'Flask';
    }

    // Detect Rust
    const cargoPath = path.join(cwd, 'Cargo.toml');
    if (await fs.stat(cargoPath).catch(() => null)) {
      info.type = 'Rust';
      info.language = 'Rust';
    }

    // Detect Go
    const goModPath = path.join(cwd, 'go.mod');
    if (await fs.stat(goModPath).catch(() => null)) {
      info.type = 'Go';
      info.language = 'Go';
    }
  } catch (error) {
    // Silently continue with defaults if detection fails
  }

  return info;
}
