import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';

export type MascotState = 'IDLE' | 'THINKING' | 'WORKING' | 'SUCCESS' | 'ERROR' | 'STREAMING';

interface CatMascotProps {
  state: MascotState;
}

const FRAMES: Record<MascotState, string[][]> = {
  IDLE: [
    [' /\\_/\\ ', '( o.o )', ' > ^ < ', '/|   |\\'],
    [' /\\_/\\ ', '( -.- )', ' > ^ < ', '/|   |\\'],
  ],
  THINKING: [
    [' /\\_/\\ ', '( >.< )', ' > ^ < ', '/|   |\\'],
    [' /\\_/\\ ', '( o.> )', ' > ^ < ', '/|   |\\'],
    [' /\\_/\\ ', '( <.o )', ' > ^ < ', '/|   |\\'],
  ],
  WORKING: [
    [' /\\_/\\ ', '( *.* )', ' > ^ < ', '/|_  |\\'],
    [' /\\_/\\ ', '( o.* )', ' > ^ < ', '/|   |\\'],
  ],
  SUCCESS: [
    [' /\\_/\\ ', '( ^.^ )', ' > ^ < ', '/|   |\\'],
    [' /\\_/\\ ', '( ^o^ )', ' > U < ', '/|   |\\'],
  ],
  ERROR: [
    [' /\\_/\\ ', '( x.x )', ' > ^ < ', '/|   |\\'],
  ],
  STREAMING: [
    [' /\\_/\\ ~', '( o.o ) ', ' > ^ < |', '/|   |\\ '],
    [' /\\_/\\  ', '( o.o ) ~', ' > ^ < |', '/|   |\\ '],
  ],
};

const TIMEOUTS: Record<MascotState, number> = {
  IDLE: 1200,
  THINKING: 400,
  WORKING: 300,
  SUCCESS: 500,
  ERROR: 1000,
  STREAMING: 500,
};

export const CatMascot: React.FC<CatMascotProps> = ({ state }) => {
  const [frameIndex, setFrameIndex] = useState(0);

  useEffect(() => {
    const frames = FRAMES[state];
    const interval = setInterval(() => {
      setFrameIndex(prev => (prev + 1) % frames.length);
    }, TIMEOUTS[state]);

    return () => clearInterval(interval);
  }, [state]);

  const currentFrame = FRAMES[state][frameIndex] || FRAMES[state][0];

  return (
    <Box flexDirection="column" width={8}>
      {currentFrame.map((line, i) => (
        <Text key={i}>{line}</Text>
      ))}
    </Box>
  );
};
