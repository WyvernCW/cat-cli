#!/usr/bin/env node
import { Command } from 'commander';
import { loadConfig } from './config/loader.js';
import { runInteractive } from './commands/interactive.js';
import { runHeadless } from './commands/headless.js';
import { runDoctor } from './commands/doctor.js';
import { runSetup } from './commands/setup.js';
import { runMemoryManager } from './commands/memory.js';
import { runTaskViewer } from './commands/tasks.js';
import { runResume } from './commands/resume.js';

const program = new Command();

program
  .name('cat-ai')
  .description('CAT — Coding Agentic Terminal powered by Minimax M2.7')
  .version('1.0.0');

program
  .argument('[task]', 'Optional task to run in headless mode')
  .option('--no-welcome', 'Skip welcome screen')
  .option('--no-search', 'Disable web search')
  .option('--resume', 'Resume recent session')
  .action(async (task, options) => {
    const config = await loadConfig();

    if (options.resume) {
      await runResume(config);
      return;
    }

    if (task) {
      await runHeadless(config, task);
    } else {
      await runInteractive({
        ...config,
        welcome_enabled: options.welcome !== false,
        search_enabled: options.search !== false,
      });
    }
  });

program
  .command('doctor')
  .description('Run system diagnostics')
  .action(async () => {
    const config = await loadConfig();
    await runDoctor(config);
  });

program
  .command('memory')
  .description('Manage stored memories')
  .action(async () => {
    await runMemoryManager();
  });

program
  .command('tasks')
  .description('View all TODO lists')
  .action(async () => {
    await runTaskViewer();
  });

program.parse(process.argv);
