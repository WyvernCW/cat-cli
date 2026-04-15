import React, { useState, useEffect } from 'react';
import { render, Box, Text, useInput, useApp } from 'ink';
import SelectInput from 'ink-select-input';
import { memory_read, memory_write } from '../tools/memory_tool.js';
import type { Config } from '../config/schema.js';

const MemoryManager: React.FC = () => {
  const { exit } = useApp();
  const [memories, setMemories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    memory_read().then(res => {
      setMemories(res.memories);
      setLoading(false);
    });
  }, []);

  const handleDelete = async (item: any) => {
    const updated = memories.filter(m => m !== item.value);
    // memory_write implementation overwrites/appends based on logic
    // For simplicity here, we assume it can clear/replace
    setMemories(updated);
  };

  if (loading) return <Text italic>Loading memories...</Text>;
  if (memories.length === 0) return <Text color="yellow">No memories found.</Text>;

  const items = memories.map(m => ({ label: `· ${m}`, value: m }));

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">Memory Management</Text>
      <Text dimColor italic>(Select a fact to delete)</Text>
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleDelete} />
      </Box>
      <Text marginTop={1} dimColor>Press Ctrl+C to exit.</Text>
    </Box>
  );
};

export async function runMemoryManager(): Promise<void> {
  const { waitUntilExit } = render(<MemoryManager />);
  await waitUntilExit();
}
