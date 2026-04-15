import React, { useState, useEffect, useRef } from 'react';
import { Box, useInput, useApp, Text } from 'ink';
import { Header } from './Header.js';
import { MessageList } from './MessageList.js';
import { ThinkBlock } from './ThinkBlock.js';
import { InputBar } from './InputBar.js';
import { WelcomeScreen } from './WelcomeScreen.js';
import { TodoWidget } from './TodoWidget.js';
import { SlashCommandMenu } from './SlashCommandMenu.js';
import { HelpOverlay, StylePicker, ThemePicker } from './Overlays.js';
import { StatusText } from './StatusText.js';
import { AgentLoop, type Message } from '../agent/loop.js';
import { todo_read, type Task } from '../tools/todo.js';
import { memory_read } from '../tools/memory_tool.js';
import type { Config } from '../config/schema.js';
import type { MascotState } from './CatMascot.js';

interface AppProps {
  config: Config;
}

export const App: React.FC<AppProps> = ({ config: initialConfig }) => {
  const { exit } = useApp();
  const [config, setConfig] = useState(initialConfig);
  const [showWelcome, setShowWelcome] = useState(config.welcome_enabled);
  const [messages, setMessages] = useState<Message[]>([]);
  const [mascotState, setMascotState] = useState<MascotState>('IDLE');
  const [status, setStatus] = useState('Ready');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [memoryCount, setMemoryCount] = useState(0);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showStylePicker, setShowStylePicker] = useState(false);
  const [showThemePicker, setShowThemePicker] = useState(false);
  
  const [agent] = useState(() => new AgentLoop(config));
  const messageListRef = useRef<any>(null);

  // Sync state periodically or on change
  useEffect(() => {
    const sync = async () => {
      const currentTasks = await todo_read(agent.getState().id);
      setTasks(currentTasks);
      const currentMemories = await memory_read();
      setMemoryCount(currentMemories.total);
    };
    sync();
    const interval = setInterval(sync, 2000);
    return () => clearInterval(interval);
  }, [agent]);

  // Global Keybindings (Section 23)
  useInput((input, key) => {
    if (showWelcome) return;

    if (input === '/') setShowSlashMenu(true);
    if (input === '?') setShowHelp(true);
    if (key.ctrl && input === 'l') setMessages([]);
    if (input === 's' && !showSlashMenu) setShowStylePicker(true);
    if (input === 'x' && !showSlashMenu) setShowThemePicker(true);
    if (input === 'm' && !showSlashMenu) {/* Memory panel */}
    if (input === 'q' && messages.length === 0) exit();
  });

  const [currentThink, setCurrentThink] = useState('');
  const [thinkElapsed, setThinkElapsed] = useState(0);
  const thinkStartTime = useRef<number>(0);

  const handleInput = async (value: string) => {
    setShowSlashMenu(false);
    setShowHelp(false);
    setShowStylePicker(false);
    setShowThemePicker(false);

    if (value.startsWith('/')) {
      handleSlashCommand(value);
      return;
    }

    setCurrentThink('');
    setThinkElapsed(0);
    thinkStartTime.current = Date.now();
    setStatus('Thinking...');
    
    await agent.run(value, {
      onMascotState: setMascotState,
      onStatus: setStatus,
      onTextChunk: () => {
        setMessages([...agent.getState().messages]);
      },
      onThinkChunk: (chunk) => {
        setCurrentThink(prev => prev + chunk);
        setThinkElapsed(Date.now() - thinkStartTime.current);
      },
    });
    
    setMessages([...agent.getState().messages]);
    setCurrentThink(''); // Clear thinking after done
    setStatus('Done');
    setTimeout(() => {
      setStatus('Ready');
      setMascotState('IDLE');
    }, 2000);
  };

  const handleSlashCommand = (cmd: string) => {
    const parts = cmd.split(' ');
    const command = parts[0];

    switch (command) {
      case '/clear': setMessages([]); break;
      case '/help': setShowHelp(true); break;
      case '/exit': exit(); break;
      case '/style': setShowStylePicker(true); break;
      case '/theme': setShowThemePicker(true); break;
      // Add more as needed
      default: handleInput(`I want to run command: ${cmd}`); // Fallback to AI
    }
  };

  if (showWelcome) {
    return (
      <Box flexDirection="column" alignItems="center" justifyContent="center" height="100%">
        <WelcomeScreen onComplete={() => setShowWelcome(false)} name={config.custom_about_user} />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" height="100%" paddingX={1}>
      <Header 
        config={config} 
        sessionId={agent.getState().id} 
        turnCount={agent.getState().turns} 
        memoryCount={memoryCount} 
      />
      
      <TodoWidget tasks={tasks} />
      
      <Box flexGrow={1} flexDirection="column" minHeight={0}>
        <MessageList messages={messages} currentMascotState={mascotState} />
        {currentThink && (
          <ThinkBlock content={currentThink} isStreaming={true} elapsedMs={thinkElapsed} />
        )}
      </Box>

      {/* Overlays */}
      {showSlashMenu && (
        <Box position="absolute" bottom={4} left={2}>
          <SlashCommandMenu onSelect={handleInput} />
        </Box>
      )}
      {showHelp && (
        <Box position="absolute" top={5} left={10}>
          <HelpOverlay />
        </Box>
      )}
      {showStylePicker && (
        <Box position="absolute" bottom={4} left={5}>
          <StylePicker onSelect={(s) => { setConfig({...config, style: s as any}); setShowStylePicker(false); }} />
        </Box>
      )}
      {showThemePicker && (
        <Box position="absolute" bottom={4} left={5}>
          <ThemePicker onSelect={(t) => { setConfig({...config, theme: t as any}); setShowThemePicker(false); }} />
        </Box>
      )}

      <Box flexDirection="column" marginTop={1}>
        <StatusText status={status} isStreaming={mascotState === 'STREAMING'} />
        <InputBar onSubmit={handleInput} onExit={exit} />
      </Box>
    </Box>
  );
};
