import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import { CatMascot } from './CatMascot.js';

interface WelcomeScreenProps {
  onComplete: () => void;
  name?: string;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onComplete, name }) => {
  const [lines, setLines] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLines(prev => {
        if (prev >= 15) {
          clearInterval(timer);
          setTimeout(onComplete, 5000); // Auto-dismiss after 5s
          return 15;
        }
        return prev + 1;
      });
    }, 20);

    return () => clearInterval(timer);
  }, []);

  return (
    <Box flexDirection="column" borderStyle="double" borderColor="cyan" padding={1} width={80}>
      <Text bold color="cyan">CAT v1.0.0</Text>
      <Box flexDirection="row" marginTop={1}>
        <Box width={26} flexDirection="column" borderStyle="single" borderTop={false} borderBottom={false} borderLeft={false} borderColor="gray">
          <Text bold color="cyan">Welcome back{name ? `, ${name}` : ''}!</Text>
          <Box marginTop={1} height={5}>
            <CatMascot state="IDLE" />
          </Box>
          <Text dimColor marginTop={1}>tacAI-1.0</Text>
          <Text dimColor>NVIDIA API</Text>
        </Box>
        <Box flexDirection="column" marginLeft={2} flexGrow={1}>
          <Text bold color="cyan">Tips for getting started</Text>
          <Text dimColor>────────────────────────</Text>
          <Text>· Run /init to create a CAT.md file.</Text>
          <Text>· Run /help to see all slash commands.</Text>
          <Text marginTop={1} bold color="cyan">Recent activity</Text>
          <Text dimColor>────────────────</Text>
          <Text>· No recent activity</Text>
        </Box>
      </Box>
      <Text marginTop={1} dimColor italic>Press any key to start Cat...</Text>
    </Box>
  );
};
