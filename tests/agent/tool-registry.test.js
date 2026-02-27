'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { TOOL_REGISTRY } = require('../../build/modules/agent/infrastructure/tools/tool.registry.js');

const REQUIRED_TOOLS = [
  'list_projects',
  'list_today_tasks',
  'create_task',
  'change_project_status',
];

test('TOOL_REGISTRY is frozen', () => {
  assert.equal(Object.isFrozen(TOOL_REGISTRY), true);
});

test('TOOL_REGISTRY rejects runtime tool additions', () => {
  assert.throws(() => {
    TOOL_REGISTRY.extra_tool = {
      name: 'extra_tool',
      description: 'Should not be added',
      kind: 'read',
      schema: null,
      execute: async () => null,
    };
  }, TypeError);
});

test('all required tools exist with valid structure', () => {
  for (const toolName of REQUIRED_TOOLS) {
    const tool = TOOL_REGISTRY[toolName];

    assert.ok(tool);
    assert.equal(typeof tool.name, 'string');
    assert.equal(typeof tool.description, 'string');
    assert.ok(['read', 'mutation'].includes(tool.kind));
    assert.equal(typeof tool.execute, 'function');
  }
});

test('execute handlers are async functions', () => {
  for (const toolName of REQUIRED_TOOLS) {
    const tool = TOOL_REGISTRY[toolName];
    assert.equal(tool.execute.constructor.name, 'AsyncFunction');
  }
});
