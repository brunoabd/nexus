'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { attemptRepair } = require('../../build/modules/agent/infrastructure/llm/llm-repair.executor.js');
const { InvalidLLMOutputError } = require('../../build/modules/agent/domain-like/agent-errors.js');

function createMockClient(response) {
  return {
    invoke: async () => response,
  };
}

test('attemptRepair succeeds when LLM returns valid JSON envelope', async () => {
  const llmClient = createMockClient(JSON.stringify({ tool: null, response: 'ok' }));

  const result = await attemptRepair({
    rawInvalidText: 'not-json',
    llmClient,
  });

  assert.deepEqual(result, { tool: null, response: 'ok' });
});

test('attemptRepair fails when repaired output remains invalid', async () => {
  const llmClient = createMockClient('still invalid');

  await assert.rejects(
    () =>
      attemptRepair({
        rawInvalidText: 'not-json',
        llmClient,
      }),
    InvalidLLMOutputError,
  );
});

test('attemptRepair performs only one invoke call', async () => {
  let invokeCount = 0;
  const llmClient = {
    invoke: async () => {
      invokeCount += 1;
      return 'still invalid';
    },
  };

  await assert.rejects(
    () =>
      attemptRepair({
        rawInvalidText: 'broken',
        llmClient,
      }),
    InvalidLLMOutputError,
  );

  assert.equal(invokeCount, 1);
});
