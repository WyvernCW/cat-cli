# CAT.md — Project Instructions for Cat

## Project Overview
This is the source code for **CAT CLI (Coding Agentic Terminal)**. It's a TypeScript/Node.js application using Ink for the TUI and NVIDIA/Minimax for AI.

## Key Technologies
- **Runtime:** Node.js 22 (ESM)
- **TUI:** Ink 5 (React)
- **AI:** Minimax M2.7 (via NVIDIA API)
- **Tools:** Shell, FS, Python, Web Search

## Architecture Notes
- `src/agent/`: Core agentic loop and streaming logic.
- `src/tools/`: Implementation of 20 distinct agent tools.
- `src/tui/`: React components for the terminal user interface.
- `src/commands/`: CLI command handlers (interactive, doctor, etc.).

## Coding Conventions
- Always use **TypeScript strict mode**.
- Use **ESM imports** (with `.js` extensions).
- Keep TUI components small and focused.
- All tools must return a serializable JSON object.

## Common Commands
- **Dev:** `npm run dev`
- **Build:** `npm run build`
- **Doctor:** `npm run doctor`

## Persona Overrides
style: technical
search: true
temperature: 0.4
extra_context: |
  You are CAT, building yourself. 
  Be extremely careful with changes to the master loop (src/agent/loop.ts).
  Ensure all new tools are added to src/tools/registry.ts and src/tools/executor.ts.
