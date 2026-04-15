import fs from 'node:fs/promises';
import path from 'node:path';
import fetch from 'node:fetch';
import { detectProject } from '../utils/detect.js';
import { getGitContext } from '../utils/git.js';
import type { Config } from '../config/schema.js';

/**
 * Analyzes the project and generates a rich CAT.md via AI.
 */
export async function generateCatMd(config: Config): Promise<string> {
  const cwd = process.cwd();
  const projectInfo = await detectProject(cwd);
  const gitContext = await getGitContext(cwd);

  const prompt = `You are an expert software architect. Generate a comprehensive CAT.md (Coding Agentic Terminal instructions) for this project.
  
PROJECT DETAILS:
- Type: ${projectInfo.type}
- Language: ${projectInfo.language}
- Framework: ${projectInfo.framework || 'None'}
- Scripts: ${JSON.stringify(projectInfo.scripts)}
- Git Branch: ${gitContext?.branch || 'main'}

CAT.md structure should include:
1. Project Overview
2. Key Technologies
3. Architecture Notes (Placeholders)
4. Coding Conventions
5. Common Commands (autofilled from detected scripts)
6. Important Files
7. Persona Overrides (style: technical, etc.)

Return ONLY raw markdown content. No conversational text.`;

  if (!config.nvidia_api_key) {
    throw new Error('NVIDIA API Key not configured. Run cat-ai config first.');
  }

  const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.nvidia_api_key}`,
    },
    body: JSON.stringify({
      model: 'minimaxai/minimax-m2.7',
      messages: [{ role: 'system', content: prompt }],
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`AI Generation failed: ${response.status} ${errText}`);
  }

  const json: any = await response.json();
  const content = json.choices[0].message.content;

  // Save the generated file
  const filePath = path.join(cwd, 'CAT.md');
  await fs.writeFile(filePath, content, 'utf8');

  return content;
}
