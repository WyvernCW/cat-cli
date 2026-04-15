import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';

interface InputBarProps {
  onSubmit: (value: string) => void;
  onExit: () => void;
}

export const InputBar: React.FC<InputBarProps> = ({ onSubmit, onExit }) => {
  const [value, setValue] = useState('');

  const handleSubmit = (val: string) => {
    if (val === '/exit' || val === '/quit') {
      onExit();
      return;
    }
    onSubmit(val);
    setValue('');
  };

  return (
    <Box flexDirection="row" borderStyle="single" borderBottom={false} borderLeft={false} borderRight={false} borderColor="gray" paddingTop={1}>
      <Box marginRight={1}>
        <Text bold color="cyan"> &gt; </Text>
      </Box>
      <Box flexGrow={1}>
        <TextInput value={value} onChange={setValue} onSubmit={handleSubmit} placeholder="Type a message or /command..." />
      </Box>
      <Box marginLeft={1}>
        <Text dimColor>[/] commands  [?] help</Text>
      </Box>
    </Box>
  );
};
