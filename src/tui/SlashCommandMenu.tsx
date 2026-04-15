import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';

interface SlashCommandMenuProps {
  onSelect: (command: string) => void;
}

export const SlashCommandMenu: React.FC<SlashCommandMenuProps> = ({ onSelect }) => {
  const items = [
    { label: '/init    - Create CAT.md', value: '/init' },
    { label: '/help    - Show help', value: '/help' },
    { label: '/clear   - Clear conversation', value: '/clear' },
    { label: '/memory  - Manage memory', value: '/memory' },
    { label: '/tasks   - Show task list', value: '/tasks' },
    { label: '/theme   - Change theme', value: '/theme' },
    { label: '/exit    - Exit CAT', value: '/exit' },
  ];

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1} width={40}>
      <Text bold color="cyan">Available Commands:</Text>
      <SelectInput items={items} onSelect={(item) => onSelect(item.value)} />
    </Box>
  );
};
