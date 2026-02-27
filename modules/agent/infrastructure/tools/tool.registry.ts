import type { ToolDefinition } from '../../application/contracts/tool-definition';

const TOOL_DEFINITIONS = {
  list_projects: {
    name: 'list_projects',
    description: 'Lista projetos do usuário.',
    kind: 'read',
    schema: null as unknown,
    execute: async () => {
      throw new Error('Not implemented yet');
    },
  },
  list_today_tasks: {
    name: 'list_today_tasks',
    description: 'Lista tarefas abertas para hoje.',
    kind: 'read',
    schema: null as unknown,
    execute: async () => {
      throw new Error('Not implemented yet');
    },
  },
  create_task: {
    name: 'create_task',
    description: 'Cria uma nova tarefa no projeto.',
    kind: 'mutation',
    schema: null as unknown,
    execute: async () => {
      throw new Error('Not implemented yet');
    },
  },
  change_project_status: {
    name: 'change_project_status',
    description: 'Altera o status de um projeto.',
    kind: 'mutation',
    schema: null as unknown,
    execute: async () => {
      throw new Error('Not implemented yet');
    },
  },
} as const satisfies Record<string, ToolDefinition>;

export type ToolRegistryKey = keyof typeof TOOL_DEFINITIONS;

export const TOOL_REGISTRY: Readonly<Record<ToolRegistryKey, ToolDefinition>> = Object.freeze(
  TOOL_DEFINITIONS,
);
