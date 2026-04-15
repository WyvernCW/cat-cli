import React from 'react';
import { Box } from 'ink';
import { MessageItem } from './MessageItem.js';
import type { Message } from '../agent/loop.js';
import type { MascotState } from './CatMascot.js';

interface MessageListProps {
  messages: Message[];
  currentMascotState: MascotState;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, currentMascotState }) => {
  return (
    <Box flexDirection="column" flexGrow={1} overflowY="scroll">
      {messages.map((msg, i) => (
        <MessageItem
          key={i}
          role={msg.role}
          content={msg.content}
          name={msg.name}
          mascotState={i === messages.length - 1 ? currentMascotState : 'IDLE'}
        />
      ))}
    </Box>
  );
};
