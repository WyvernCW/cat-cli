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
    <Box flexDirection="row" justifyContent="space-between" borderStyle="single" borderTop={false} borderLeft={false} borderRight={false} borderColor="gray" paddingBottom={1} marginBottom={1}>
      <Box>
        <Text bold color="cyan">CAT </Text>
        <Text dimColor>· tacAI-1.0 </Text>
        <Text color="yellow">· [${config.style}] </Text>
      </Box>
      <Box>
        <Text color={config.search_enabled ? 'green' : 'red'}>🔍 Search:${config.search_enabled ? 'ON' : 'OFF'} </Text>
        <Text dimColor>· Mem: {memoryCount}</Text>
      </Box>
    </Box>
  );
};
