'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { parseLLMResponse } = require('../../build/modules/agent/infrastructure/llm/llm-response.parser.js');
const { InvalidLLMOutputError } = require('../../build/modules/agent/domain-like/agent-errors.js');

test('parses valid tool invocation with arguments', () => {
  const input = JSON.stringify({ tool: 'create_task', arguments: { title: 'Nova task' } });
  const parsed = parseLLMResponse(input);

  assert.deepEqual(parsed, {
    tool: 'create_task',
    arguments: { title: 'Nova task' },
  });
});

test('parses valid natural response', () => {
  const input = JSON.stringify({ tool: null, response: 'Olá!' });
  const parsed = parseLLMResponse(input);

  assert.deepEqual(parsed, {
    tool: null,
    response: 'Olá!',
  });
});

test('rejects text before JSON', () => {
  const input = 'prefix ' + JSON.stringify({ tool: null, response: 'ok' });
  assert.throws(() => parseLLMResponse(input), InvalidLLMOutputError);
});

test('rejects text after JSON', () => {
  const input = JSON.stringify({ tool: null, response: 'ok' }) + ' suffix';
  assert.throws(() => parseLLMResponse(input), InvalidLLMOutputError);
});

test('rejects two JSON objects in sequence', () => {
  const input = JSON.stringify({ tool: null, response: 'ok' }) + JSON.stringify({ tool: null, response: 'again' });
  assert.throws(() => parseLLMResponse(input), InvalidLLMOutputError);
});

test('rejects malformed JSON', () => {
  const input = '{"tool":"create_task", "arguments": '; 
  assert.throws(() => parseLLMResponse(input), InvalidLLMOutputError);
});

test('rejects tool:string without arguments', () => {
  const input = JSON.stringify({ tool: 'create_task' });
  assert.throws(() => parseLLMResponse(input), InvalidLLMOutputError);
});

test('rejects tool:null without response', () => {
  const input = JSON.stringify({ tool: null });
  assert.throws(() => parseLLMResponse(input), InvalidLLMOutputError);
});

test('rejects tool:string with response', () => {
  const input = JSON.stringify({ tool: 'create_task', arguments: { title: 'x' }, response: 'nope' });
  assert.throws(() => parseLLMResponse(input), InvalidLLMOutputError);
});

test('rejects tool:null with arguments', () => {
  const input = JSON.stringify({ tool: null, response: 'ok', arguments: {} });
  assert.throws(() => parseLLMResponse(input), InvalidLLMOutputError);
});
