'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { AgentService } = require('../../build/modules/agent/application/agent.service.js');
const { InvalidLLMOutputError } = require('../../build/modules/agent/domain-like/agent-errors.js');

function createLLMClientFromResponses(responses) {
  let index = 0;
  return {
    invoke: async () => {
      const value = responses[index];
      index += 1;
      return value;
    },
  };
}

test('handleMessage returns response when envelope has tool=null', async () => {
  const service = new AgentService(
    {
      route: async () => {
        throw new Error('route should not be called for natural response');
      },
    },
    {
      list_projects: {
        name: 'list_projects',
        description: 'Lista projetos do usuário.',
        kind: 'read',
        schema: null,
        execute: async () => null,
      },
    },
  );

  const llmClient = createLLMClientFromResponses([
    JSON.stringify({ tool: null, response: 'Resposta natural' }),
  ]);

  const result = await service.handleMessage({
    userId: 'user-1',
    message: 'Oi',
    llmClient,
  });

  assert.deepEqual(result, {
    type: 'response',
    content: 'Resposta natural',
  });
});

test('handleMessage routes tool invocation and returns tool result', async () => {
  let routeCalls = 0;
  let routeParams;

  const service = new AgentService(
    {
      route: async (params) => {
        routeCalls += 1;
        routeParams = params;
        return { ok: true };
      },
    },
    {
      create_task: {
        name: 'create_task',
        description: 'Cria tarefa.',
        kind: 'mutation',
        schema: null,
        execute: async () => null,
      },
    },
  );

  const llmClient = createLLMClientFromResponses([
    JSON.stringify({ tool: 'create_task', arguments: { title: 'Task' } }),
  ]);

  const result = await service.handleMessage({
    userId: 'user-2',
    message: 'Crie uma task',
    llmClient,
  });

  assert.equal(routeCalls, 1);
  assert.deepEqual(routeParams, {
    toolName: 'create_task',
    arguments: { title: 'Task' },
    userId: 'user-2',
  });
  assert.deepEqual(result, {
    type: 'tool',
    toolName: 'create_task',
    content: { ok: true },
  });
});

test('handleMessage repairs once when first output is invalid and second is valid', async () => {
  const service = new AgentService(
    {
      route: async () => {
        throw new Error('route should not be called for natural response');
      },
    },
    {
      list_projects: {
        name: 'list_projects',
        description: 'Lista projetos.',
        kind: 'read',
        schema: null,
        execute: async () => null,
      },
    },
  );

  const llmClient = createLLMClientFromResponses([
    'invalid-json',
    JSON.stringify({ tool: null, response: 'Corrigido' }),
  ]);

  const result = await service.handleMessage({
    userId: 'user-3',
    message: 'Olá',
    llmClient,
  });

  assert.deepEqual(result, {
    type: 'response',
    content: 'Corrigido',
  });
});

test('handleMessage throws InvalidLLMOutputError when invalid twice', async () => {
  const service = new AgentService(
    {
      route: async () => ({ ok: true }),
    },
    {
      list_projects: {
        name: 'list_projects',
        description: 'Lista projetos.',
        kind: 'read',
        schema: null,
        execute: async () => null,
      },
    },
  );

  const llmClient = createLLMClientFromResponses(['invalid-1', 'invalid-2']);

  await assert.rejects(
    () =>
      service.handleMessage({
        userId: 'user-4',
        message: 'Teste',
        llmClient,
      }),
    InvalidLLMOutputError,
  );
});

test('policy: maxToolsPerRequest=1 results in only one route execution per handleMessage call', async () => {
  let routeCalls = 0;

  const service = new AgentService(
    {
      route: async () => {
        routeCalls += 1;
        return { ok: true };
      },
    },
    {
      create_task: {
        name: 'create_task',
        description: 'Cria tarefa.',
        kind: 'mutation',
        schema: null,
        execute: async () => null,
      },
    },
  );

  const llmClient = createLLMClientFromResponses([
    JSON.stringify({ tool: 'create_task', arguments: { title: 'Task' } }),
  ]);

  await service.handleMessage({
    userId: 'user-5',
    message: 'Crie',
    llmClient,
  });

  assert.equal(routeCalls, 1);
});
