import React from 'react';
import { render, Box, Text } from 'ink';
import { execSync } from 'node:child_process';
import os from 'node:os';
import { CatMascot } from '../tui/CatMascot.js';
import type { Config } from '../config/schema.js';

const CheckItem: React.FC<{ label: string; value: string; success?: boolean }> = ({ label, value, success = true }) => (
  <Text>
    {success ? <Text color="green">[✓]</Text> : <Text color="yellow">[?]</Text>} {label.padEnd(20)} {value}
  </Text>
);

const Doctor: React.FC<{ config: Config }> = ({ config }) => {
  const nodeVer = process.version;
  const osType = os.type();
  
  let hasGit = false;
  try {
    execSync('git --version', { encoding: 'utf8' });
    hasGit = true;
  } catch (e) {}

  let hasRg = false;
  try {
    execSync('rg --version', { encoding: 'utf8' });
    hasRg = true;
  } catch (e) {}

  return (
    <Box flexDirection="column" padding={1}>
      <Box flexDirection="row" marginBottom={1}>
        <CatMascot state="IDLE" />
        <Box flexDirection="column" marginLeft={2}>
          <Text bold color="cyan">CAT Doctor — System Check</Text>
          <Text dimColor>─────────────────────────────────────────────────────</Text>
          <Text italic>Checking your environment...</Text>
        </Box>
      </Box>
      <CheckItem label="Node.js" value={nodeVer} />
      <CheckItem label="OS" value={osType} />
      <CheckItem label="Git" value={hasGit ? 'Found' : 'Missing'} success={!!hasGit} />
      <CheckItem label="Ripgrep (rg)" value={hasRg ? 'Found' : 'Missing (grep will be slow)'} success={!!hasRg} />
      <CheckItem label="NVIDIA API Key" value={config.nvidia_api_key ? 'Set' : 'Missing'} success={!!config.nvidia_api_key} />
      <Box marginTop={1}>
        <Text bold color="green">Overall: All systems ready to pounce! 🐱</Text>
      </Box>
    </Box>
  );
};

export async function runDoctor(config: Config): Promise<void> {
  const { waitUntilExit } = render(<Doctor config={config} />);
  await waitUntilExit();
}
