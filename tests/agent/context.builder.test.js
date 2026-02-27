'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildContext } = require('../../build/modules/agent/infrastructure/context/context.builder.js');

test('buildContext returns system, user and metadata.toolNames', () => {
  const context = buildContext({
    userMessage: 'Quero listar meus projetos',
    tools: {
      list_projects: {
        name: 'list_projects',
        description: 'Lista projetos do usuário.',
        kind: 'read',
        schema: null,
        execute: async () => null,
      },
      create_task: {
        name: 'create_task',
        description: 'Cria tarefa em projeto.',
        kind: 'mutation',
        schema: null,
        execute: async () => null,
      },
    },
  });

  assert.equal(typeof context.system, 'string');
  assert.equal(context.user, 'Quero listar meus projetos');
  assert.deepEqual(context.metadata.toolNames, ['list_projects', 'create_task']);
  assert.equal(context.system.includes('Retorne exatamente 1 objeto JSON válido'), true);
  assert.equal(context.system.includes('list_projects: Lista projetos do usuário.'), true);
  assert.equal(context.system.includes('create_task: Cria tarefa em projeto.'), true);
});
