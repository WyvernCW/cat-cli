import React from 'react';
import { Box, Text } from 'ink';
import type { Config } from '../config/schema.js';

interface HeaderProps {
  config: Config;
  sessionId: string;
  turnCount: number;
  memoryCount: number;
}

export const Header: React.FC<HeaderProps> = ({ config, sessionId, turnCount, memoryCount }) => {
  return (
    <Box flexDirection="column" borderStyle="single" borderColor="gray" paddingX={1} marginBottom={1}>
      <Box flexDirection="row" justifyContent="space-between">
        <Box>
          <Text bold color="cyan">(=^.^=) CAT </Text>
          <Text dimColor> · minimax-m2.7 </Text>
          <Text color="yellow"> · [${config.style}] </Text>
          <Text color={config.search_enabled ? 'green' : 'red'}> · 🔍 Search:${config.search_enabled ? 'ON' : 'OFF'}</Text>
        </Box>
        <Box>
          <Text dimColor>Session: {sessionId} </Text>
          <Text dimColor> · Turns: {turnCount} </Text>
          <Text dimColor> · Mem: {memoryCount} facts</Text>
        </Box>
      </Box>
      <Box flexDirection="row">
        <Text dimColor>~/my-project </Text>
        <Text color="green"> · CAT.md: loaded ✓ </Text>
        <Text color="green"> · python3 ✓ </Text>
        <Text color="green"> · rg ✓ </Text>
      </Box>
    </Box>
  );
};
