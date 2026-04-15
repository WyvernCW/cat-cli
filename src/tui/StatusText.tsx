import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

interface StatusTextProps {
  status: string;
  isStreaming?: boolean;
}

export const StatusText: React.FC<StatusTextProps> = ({ status, isStreaming }) => {
  return (
    <Box flexDirection="row" alignItems="center">
      <Text color="cyan">Cat ── </Text>
      {!isStreaming && (
        <Box marginRight={1}>
          <Spinner type="dots" />
        </Box>
      )}
      <Text italic>{status}</Text>
    </Box>
  );
};
