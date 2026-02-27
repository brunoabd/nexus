'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { ToolRouter } = require('../../build/modules/agent/infrastructure/tools/tool.router.js');
const {
  ToolNotFoundError,
  ToolValidationError,
} = require('../../build/modules/agent/domain-like/agent-errors.js');

function createRouterWithRegistry(registry) {
  return new ToolRouter(registry);
}

test('happy path: read tool executes correctly', async () => {
  const router = createRouterWithRegistry({
    list_projects: {
      schema: null,
      execute: async ({ arguments: args, userId }) => ({ ok: true, type: 'read', args, userId }),
    },
  });

  const result = await router.route({
    toolName: 'list_projects',
    arguments: { page: 1 },
    userId: 'user-1',
  });

  assert.deepEqual(result, {
    ok: true,
    type: 'read',
    args: { page: 1 },
    userId: 'user-1',
  });
});

test('happy path: mutation tool executes correctly', async () => {
  const router = createRouterWithRegistry({
    create_task: {
      schema: null,
      execute: async ({ arguments: args, userId }) => ({ ok: true, type: 'mutation', args, userId }),
    },
  });

  const result = await router.route({
    toolName: 'create_task',
    arguments: { title: 'Task' },
    userId: 'user-2',
  });

  assert.deepEqual(result, {
    ok: true,
    type: 'mutation',
    args: { title: 'Task' },
    userId: 'user-2',
  });
});

test('throws ToolNotFoundError when tool does not exist', async () => {
  const router = createRouterWithRegistry({});

  await assert.rejects(
    () =>
      router.route({
        toolName: 'unknown_tool',
        arguments: {},
        userId: 'user-1',
      }),
    ToolNotFoundError,
  );
});

test('allows multiple executions because router is stateless', async () => {
  let executeCalls = 0;
  const router = createRouterWithRegistry({
    list_projects: {
      schema: null,
      execute: async () => {
        executeCalls += 1;
        return { ok: true };
      },
    },
  });

  await router.route({
    toolName: 'list_projects',
    arguments: {},
    userId: 'user-1',
  });

  await router.route({
    toolName: 'list_projects',
    arguments: {},
    userId: 'user-1',
  });

  assert.equal(executeCalls, 2);
});

test('throws ToolValidationError when schema validation fails', async () => {
  let executeCalls = 0;
  const router = createRouterWithRegistry({
    create_task: {
      schema: {
        validate: () => false,
      },
      execute: async () => {
        executeCalls += 1;
        return { ok: true };
      },
    },
  });

  await assert.rejects(
    () =>
      router.route({
        toolName: 'create_task',
        arguments: { title: '' },
        userId: 'user-3',
      }),
    ToolValidationError,
  );

  assert.equal(executeCalls, 0);
});
