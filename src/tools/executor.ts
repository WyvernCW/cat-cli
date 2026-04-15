import { executeBash } from './bash.js';
import { read_file, write_file, edit_file, create_dir, delete_file } from './files.js';
import { list_dir } from './listdir.js';
import { glob, grep } from './search.js';
import { executePython } from './python.js';
import { web_search, web_fetch } from './web.js';
import { todo_write, todo_read } from './todo.js';
import { deliver_files } from './deliver.js';
import { memory_write, memory_read, ask_user } from './memory_tool.js';
import { cat_md_update } from './cat_md.js';
import type { Config } from '../config/schema.js';

export async function executeTool(
  name: string,
  args: any,
  sessionId: string,
  config: Config
): Promise<any> {
  switch (name) {
    case 'bash': return await executeBash(args);
    case 'read_file': return await read_file(args);
    case 'write_file': return await write_file(args);
    case 'edit_file': return await edit_file(args);
    case 'create_dir': return await create_dir(args);
    case 'delete_file': return await delete_file(args);
    case 'list_dir': return await list_dir(args);
    case 'glob': return await glob(args);
    case 'grep': return await grep(args);
    case 'python': return await executePython(args);
    case 'web_search': return await web_search(args, config.brave_search_api_key || '');
    case 'web_fetch': return await web_fetch(args);
    case 'todo_write': return await todo_write(args, sessionId);
    case 'todo_read': return await todo_read(sessionId);
    case 'deliver_files': return await deliver_files(args);
    case 'memory_write': return await memory_write(args);
    case 'memory_read': return await memory_read();
    case 'ask_user': return await ask_user(args);
    case 'cat_md_update': return await cat_md_update(args);
    default: throw new Error(`Tool ${name} not implemented.`);
  }
}

export function getToolPermissionLevel(name: string): 'auto' | 'ask' {
  const askTools = ['bash', 'write_file', 'edit_file', 'delete_file', 'python', 'cat_md_update'];
  return askTools.includes(name) ? 'ask' : 'auto';
}
