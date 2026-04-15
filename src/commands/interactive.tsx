import React, { useState, useEffect } from 'react';
import { render, Box, useInput, useApp } from 'ink';
import { App } from '../tui/App.js';
import { loadConfig } from '../config/loader.js';
import type { Config } from '../config/schema.js';

/**
 * Controller for the interactive TUI mode.
 * Handles initial data loading and root rendering.
 */
const InteractiveController: React.FC<{ initialConfig: Config }> = ({ initialConfig }) => {
  const [config, setConfig] = useState(initialConfig);
  const { exit } = useApp();

  // Handle global shortcuts
  useInput((input, key) => {
    // Ctrl+C is handled by Ink by default, but we can intercept it if needed
    if (input === 'q' && !key.ctrl && !key.meta) {
      // exit(); // Only quit if no input is active (handled in App.tsx usually)
    }
  });

  return (
    <Box width="100%" height={process.stdout.rows || 40} flexDirection="column">
      <App config={config} />
    </Box>
  );
};

/**
 * Launches the interactive TUI mode.
 */
export async function runInteractive(config: Config): Promise<void> {
  const { waitUntilExit } = render(<InteractiveController initialConfig={config} />);
  await waitUntilExit();
}
