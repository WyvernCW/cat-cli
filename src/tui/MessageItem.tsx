import React from 'react';
import { Box, Text } from 'ink';
import { CatMascot, type MascotState } from './CatMascot.js';
import { renderMarkdown } from '../utils/markdown.js';

interface MessageItemProps {
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
  name?: string;
  mascotState?: MascotState;
}

export const MessageItem: React.FC<MessageItemProps> = ({ role, content, name, mascotState = 'IDLE' }) => {
  if (role === 'system') return null;

  if (role === 'user') {
    return (
      <Box flexDirection="column" marginBottom={1}>
        <Box flexDirection="row" borderStyle="single" borderTop={false} borderLeft={false} borderRight={false} borderColor="cyan">
          <Text bold color="cyan">You ──</Text>
        </Box>
        <Box paddingLeft={2}>
          <Text>{content}</Text>
        </Box>
      </Box>
    );
  }

  if (role === 'assistant') {
    return (
      <Box flexDirection="row" marginBottom={1}>
        <Box width={8}>
          <CatMascot state={mascotState} />
        </Box>
        <Box flexDirection="column" flexGrow={1} marginLeft={1}>
          <Box flexDirection="row" borderStyle="single" borderTop={false} borderLeft={false} borderRight={false} borderColor="cyan">
            <Text bold color="cyan">Cat ──</Text>
          </Box>
          <Box paddingLeft={1}>
            <Text>{renderMarkdown(content)}</Text>
          </Box>
        </Box>
      </Box>
    );
  }

  return null;
};
