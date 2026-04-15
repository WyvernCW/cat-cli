import React, { useState } from 'react';
import { render, Box, Text, useApp } from 'ink';
import TextInput from 'ink-text-input';
import { saveConfig } from '../config/loader.js';
import { DEFAULTS } from '../config/defaults.js';

const SetupWizard: React.FC = () => {
  const { exit } = useApp();
  const [step, setStep] = useState(0);
  const [apiKey, setApiKey] = useState('');

  const handleApiKey = async (val: string) => {
    setApiKey(val);
    const config = { ...DEFAULTS, nvidia_api_key: val };
    await saveConfig(config);
    setStep(1);
  };

  if (step === 0) {
    return (
      <Box flexDirection="column" padding={1}>
        <Text bold color="cyan">Welcome to CAT — Coding Agentic Terminal!</Text>
        <Text marginTop={1}>Enter your NVIDIA API key:</Text>
        <TextInput value={apiKey} onChange={setApiKey} onSubmit={handleApiKey} mask="*" />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="green">✓ CAT is ready!</Text>
      <Text marginTop={1}>Get started by running:</Text>
      <Text color="cyan">  cat-ai</Text>
      <Text marginTop={1}>Press Ctrl+C to exit setup.</Text>
    </Box>
  );
};

export async function runSetup(): Promise<void> {
  const { waitUntilExit } = render(<SetupWizard />);
  await waitUntilExit();
}
