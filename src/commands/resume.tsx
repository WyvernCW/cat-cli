import React, { useState, useEffect } from 'react';
import { render, Box, Text, useApp } from 'ink';
import SelectInput from 'ink-select-input';
import { listSessions } from '../agent/sessions.js';
import { runInteractive } from './interactive.js';
import type { Config } from '../config/schema.js';

const SessionPicker: React.FC<{ config: Config }> = ({ config }) => {
  const { exit } = useApp();
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    listSessions().then(s => {
      setSessions(s);
      setLoading(false);
    });
  }, []);

  const handleSelect = async (item: any) => {
    exit(); // Close picker
    // In a real implementation, we'd pass the session ID to runInteractive
    console.log(`Resuming session: ${item.label}`);
  };

  if (loading) return <Text italic>Loading sessions...</Text>;
  if (sessions.length === 0) return <Text color="yellow">No recent activity found.</Text>;

  const items = sessions.map(s => ({
    label: `${s.title.padEnd(30)} ${new Date(s.updated_at).toLocaleDateString()}`,
    value: s.id,
  }));

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">Resume Recent Session</Text>
      <Box marginTop={1}>
        <SelectInput items={items} onSelect={handleSelect} />
      </Box>
    </Box>
  );
};

export async function runResume(config: Config): Promise<void> {
  const { waitUntilExit } = render(<SessionPicker config={config} />);
  await waitUntilExit();
}
