import React, { useState } from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';

interface ThinkBlockProps {
  content: string;
  isStreaming: boolean;
  elapsedMs: number;
}

export const ThinkBlock: React.FC<ThinkBlockProps> = ({ content, isStreaming, elapsedMs }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!content && isStreaming) {
    return (
      <Box flexDirection="row" marginLeft={2}>
        <Spinner type="dots" />
        <Text italic dimColor> Thinking...</Text>
      </Box>
    );
  }

  const lines = content.split('\n');
  const preview = lines.slice(0, 3).join('\n');
  const showToggle = lines.length > 3 || content.length > 500;

  return (
    <Box flexDirection="column" marginLeft={2} marginBottom={1}>
      <Box borderStyle="round" borderColor="gray" paddingLeft={1} flexDirection="column">
        <Text italic dimColor>
          {isExpanded ? content : preview}
          {!isExpanded && showToggle && ' ...'}
        </Text>
      </Box>
      {!isStreaming && (
        <Box flexDirection="row">
          <Text dimColor>╰─ Thought for {(elapsedMs / 1000).toFixed(1)}s </Text>
          {showToggle && (
            <Text color="cyan" underline onAction={() => setIsExpanded(!isExpanded)}>
               · [T] {isExpanded ? 'collapse' : 'expand'}
            </Text>
          )}
        </Box>
      )}
    </Box>
  );
};
