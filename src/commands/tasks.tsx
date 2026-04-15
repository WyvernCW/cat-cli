import React, { useState, useEffect } from 'react';
import { render, Box, Text, useApp } from 'ink';
import { listSessions } from '../agent/sessions.js';
import { todo_read, type Task } from '../tools/todo.js';

const TaskViewer: React.FC = () => {
  const [sessionTasks, setSessionTasks] = useState<Record<string, Task[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAll = async () => {
      const sessions = await listSessions();
      const all: Record<string, Task[]> = {};
      for (const s of sessions) {
        const tasks = await todo_read(s.id);
        if (tasks.length > 0) all[s.title] = tasks;
      }
      setSessionTasks(all);
      setLoading(false);
    };
    loadAll();
  }, []);

  if (loading) return <Text italic>Loading tasks...</Text>;
  if (Object.keys(sessionTasks).length === 0) return <Text color="yellow">No active tasks found in any session.</Text>;

  return (
    <Box flexDirection="column" padding={1}>
      <Text bold color="cyan">Global Task Overview</Text>
      {Object.entries(sessionTasks).map(([title, tasks]) => (
        <Box key={title} flexDirection="column" marginTop={1}>
          <Text underline>{title}</Text>
          {tasks.map(t => (
            <Text key={t.id} marginLeft={2}>
              {t.status === 'completed' ? '✓' : '○'} {t.content}
            </Text>
          ))}
        </Box>
      ))}
    </Box>
  );
};

export async function runTaskViewer(): Promise<void> {
  const { waitUntilExit } = render(<TaskViewer />);
  await waitUntilExit();
}
