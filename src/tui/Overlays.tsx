import React from 'react';
import { Box, Text } from 'ink';
import SelectInput from 'ink-select-input';

export const HelpOverlay: React.FC = () => {
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      <Text bold color="cyan">CAT Help & Keybindings</Text>
      <Text marginTop={1}>Enter      → send message</Text>
      <Text>/          → open slash command menu</Text>
      <Text>Ctrl+C     → interrupt or exit</Text>
      <Text>T          → toggle expand/collapse latest think block</Text>
      <Text>?          → show help</Text>
    </Box>
  );
};

export const StylePicker: React.FC<{ onSelect: (style: string) => void }> = ({ onSelect }) => {
  const styles = [
    { label: 'Default', value: 'default' },
    { label: 'Technical', value: 'technical' },
    { label: 'Casual', value: 'casual' },
    { label: 'Formal', value: 'formal' },
    { label: 'Concise', value: 'concise' },
  ];
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      <Text bold color="cyan">Choose a Style:</Text>
      <SelectInput items={styles} onSelect={(item) => onSelect(item.value)} />
    </Box>
  );
};

export const ThemePicker: React.FC<{ onSelect: (theme: string) => void }> = ({ onSelect }) => {
  const themes = [
    { label: 'Default (Cyan)', value: 'default' },
    { label: 'Midnight', value: 'midnight' },
    { label: 'Forest (Green)', value: 'forest' },
    { label: 'Hacker (Bright Green)', value: 'hacker' },
  ];
  return (
    <Box flexDirection="column" borderStyle="round" borderColor="cyan" padding={1}>
      <Text bold color="cyan">Choose a Theme:</Text>
      <SelectInput items={themes} onSelect={(item) => onSelect(item.value)} />
    </Box>
  );
};
