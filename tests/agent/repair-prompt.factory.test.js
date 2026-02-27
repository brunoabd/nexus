'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { buildRepairPrompt } = require('../../build/modules/agent/infrastructure/llm/repair-prompt.factory.js');

test('repair prompt includes only summarized contract and invalid output', () => {
  const invalidOutput = 'INVALID JSON OUTPUT';
  const prompt = buildRepairPrompt(invalidOutput);

  assert.equal(prompt.includes('Retorne exatamente 1 objeto JSON válido no formato abaixo.'), true);
  assert.equal(prompt.includes('"tool": string | null'), true);
  assert.equal(prompt.includes('"arguments": object (obrigatório se tool != null)'), true);
  assert.equal(prompt.includes('"response": string (obrigatório se tool == null)'), true);

  assert.equal(prompt.includes('---INVALID_OUTPUT_START---'), true);
  assert.equal(prompt.includes(invalidOutput), true);
  assert.equal(prompt.includes('---INVALID_OUTPUT_END---'), true);

  assert.equal(prompt.toLowerCase().includes('project'), false);
  assert.equal(prompt.toLowerCase().includes('histórico'), false);
  assert.equal(prompt.toLowerCase().includes('history'), false);
});
