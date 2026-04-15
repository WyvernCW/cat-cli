import React from 'react';
import { Box, Text } from 'ink';
import type { Task } from '../tools/todo.js';

interface TodoWidgetProps {
  tasks: Task[];
}

export const TodoWidget: React.FC<TodoWidgetProps> = ({ tasks }) => {
  if (tasks.length === 0) return null;

  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <Box borderStyle="round" borderColor="gray" flexDirection="column" paddingX={1} marginBottom={1}>
      <Box flexDirection="row" justifyContent="space-between">
        <Text bold color="cyan">Tasks {completedCount}/{tasks.length}</Text>
      </Box>
      <Box flexDirection="row" overflowX="hidden">
        {tasks.map(task => (
          <Box key={task.id} marginRight={2}>
            <Text color={task.status === 'completed' ? 'green' : (task.status === 'in_progress' ? 'yellow' : 'white')}>
              {task.status === 'completed' ? '[✓]' : (task.status === 'in_progress' ? '[●]' : '[ ]')} {task.content}
            </Text>
          </Box>
        ))}
      </Box>
    </Box>
  );
};
