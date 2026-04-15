import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

interface ToolCallDisplayProps {
  name: string;
  args: any;
  result?: any;
  isExecuting?: boolean;
}

export const ToolCallDisplay: React.FC<ToolCallDisplayProps> = ({ name, args, result, isExecuting }) => {
  return (
    <Box flexDirection="column" marginLeft={2} marginBottom={1}>
      <Box flexDirection="row">
        <Text color="cyan" bold>◆ {name}</Text>
        <Text dimColor> {JSON.stringify(args).slice(0, 80)}</Text>
      </Box>
      {isExecuting && (
        <Box flexDirection="row" marginLeft={2}>
          <Spinner type="dots" />
          <Text dimColor> Running...</Text>
        </Box>
      )}
      {result && (
        <Box flexDirection="column" marginLeft={2} borderStyle="single" borderColor="gray" paddingX={1}>
          <Text dimColor>
            {typeof result === 'string' ? result.slice(0, 1000) : JSON.stringify(result, null, 2).slice(0, 1000)}
            {result.length > 1000 && '... [TRUNCATED]'}
          </Text>
        </Box>
      )}
    </Box>
  );
};
