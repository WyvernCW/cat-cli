import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';
import { CatMascot } from './CatMascot.js';

interface PermissionDialogProps {
  toolName: string;
  command: string;
  onChoice: (choice: 'yes' | 'always' | 'no' | 'block') => void;
}

export const PermissionDialog: React.FC<PermissionDialogProps> = ({ toolName, command, onChoice }) => {
  const items = [
    { label: '[Y] Yes, once', value: 'yes' },
    { label: '[A] Always allow', value: 'always' },
    { label: '[N] No', value: 'no' },
    { label: '[B] Block', value: 'block' },
  ];

  return (
    <Box flexDirection="column" borderStyle="round" borderColor="yellow" padding={1}>
      <Box flexDirection="row" marginBottom={1}>
        <CatMascot state="IDLE" />
        <Box flexDirection="column" marginLeft={2}>
          <Text bold color="yellow">Permission Request</Text>
          <Text>Cat wants to run:</Text>
          <Text color="cyan">{toolName} → {command.slice(0, 100)}</Text>
        </Box>
      </Box>
      <SelectInput items={items} onSelect={(item) => onChoice(item.value as any)} />
    </Box>
  );
};
