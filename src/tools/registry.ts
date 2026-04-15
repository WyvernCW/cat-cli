/**
 * CAT CLI Tool Registry (OpenAI Function Schema format)
 */
export const TOOL_SCHEMAS = [
  {
    name: 'bash',
    description: 'Execute a shell command in the terminal.',
    parameters: {
      type: 'object',
      properties: {
        command: { type: 'string', description: 'The shell command to run.' },
        cwd: { type: 'string', description: 'Directory to run command in.' },
      },
      required: ['command'],
    },
  },
  {
    name: 'read_file',
    description: 'Read the contents of a file.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to the file.' },
        start_line: { type: 'number' },
        end_line: { type: 'number' },
      },
      required: ['path'],
    },
  },
  {
    name: 'write_file',
    description: 'Create or overwrite a file.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to the file.' },
        content: { type: 'string', description: 'Content to write.' },
        create_dirs: { type: 'boolean', description: 'Create parent directories if they don\'t exist.' },
      },
      required: ['path', 'content'],
    },
  },
  {
    name: 'edit_file',
    description: 'Edit a file using string replacement (str_replace).',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to the file.' },
        old_str: { type: 'string', description: 'The exact string to replace.' },
        new_str: { type: 'string', description: 'The string to replace it with.' },
      },
      required: ['path', 'old_str', 'new_str'],
    },
  },
  {
    name: 'create_dir',
    description: 'Create a directory.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to the directory.' },
      },
      required: ['path'],
    },
  },
  {
    name: 'delete_file',
    description: 'Delete a file or directory.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to delete.' },
      },
      required: ['path'],
    },
  },
  {
    name: 'list_dir',
    description: 'List contents of a directory.',
    parameters: {
      type: 'object',
      properties: {
        path: { type: 'string', description: 'Path to the directory.' },
        recursive: { type: 'boolean' },
        max_depth: { type: 'number' },
      },
      required: ['path'],
    },
  },
  {
    name: 'glob',
    description: 'Find files matching a glob pattern.',
    parameters: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Glob pattern (e.g. src/**/*.ts).' },
        cwd: { type: 'string' },
      },
      required: ['pattern'],
    },
  },
  {
    name: 'grep',
    description: 'Search for a pattern in file contents.',
    parameters: {
      type: 'object',
      properties: {
        pattern: { type: 'string', description: 'Regex pattern.' },
        path: { type: 'string', description: 'File or directory to search.' },
        case_insensitive: { type: 'boolean' },
      },
      required: ['pattern'],
    },
  },
  {
    name: 'python',
    description: 'Execute Python code.',
    parameters: {
      type: 'object',
      properties: {
        code: { type: 'string', description: 'Python code to execute.' },
      },
      required: ['code'],
    },
  },
  {
    name: 'web_search',
    description: 'Search the web using Brave Search.',
    parameters: {
      type: 'object',
      properties: {
        query: { type: 'string', description: 'Search query.' },
        num_results: { type: 'number' },
      },
      required: ['query'],
    },
  },
  {
    name: 'web_fetch',
    description: 'Fetch and extract text from a URL.',
    parameters: {
      type: 'object',
      properties: {
        url: { type: 'string', description: 'URL to fetch.' },
      },
      required: ['url'],
    },
  },
  {
    name: 'todo_write',
    description: 'Update the session task list.',
    parameters: {
      type: 'object',
      properties: {
        tasks: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              content: { type: 'string' },
              status: { type: 'string', enum: ['todo', 'in_progress', 'completed'] },
              priority: { type: 'string', enum: ['low', 'medium', 'high'] },
            },
            required: ['id', 'content', 'status'],
          },
        },
      },
      required: ['tasks'],
    },
  },
  {
    name: 'todo_read',
    description: 'Read the session task list.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'deliver_files',
    description: 'Bundle multiple files and deliver them (creates a zip).',
    parameters: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              filename: { type: 'string' },
              content: { type: 'string' },
            },
            required: ['filename', 'content'],
          },
        },
        output_dir: { type: 'string' },
        zip_name: { type: 'string' },
      },
      required: ['files'],
    },
  },
  {
    name: 'memory_write',
    description: 'Store new facts about the user or project.',
    parameters: {
      type: 'object',
      properties: {
        facts: { type: 'array', items: { type: 'string' } },
      },
      required: ['facts'],
    },
  },
  {
    name: 'memory_read',
    description: 'Read stored memories.',
    parameters: { type: 'object', properties: {} },
  },
  {
    name: 'ask_user',
    description: 'Ask the user a question to clarify something.',
    parameters: {
      type: 'object',
      properties: {
        question: { type: 'string' },
        options: { type: 'array', items: { type: 'string' } },
      },
      required: ['question'],
    },
  },
  {
    name: 'run_task',
    description: 'Spawn a sub-agent to handle an isolated task.',
    parameters: {
      type: 'object',
      properties: {
        task: { type: 'string' },
      },
      required: ['task'],
    },
  },
  {
    name: 'cat_md_update',
    description: 'Update a section in CAT.md.',
    parameters: {
      type: 'object',
      properties: {
        section: { type: 'string' },
        content: { type: 'string' },
      },
      required: ['section', 'content'],
    },
  },
];
