'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {
  InvalidLLMOutputError,
  ToolNotFoundError,
  ToolValidationError,
  ToolExecutionBlockedError,
} = require('../../build/modules/agent/domain-like/agent-errors.js');

test('InvalidLLMOutputError has stable code', () => {
  const error = new InvalidLLMOutputError();
  assert.equal(error.code, 'INVALID_LLM_OUTPUT');
});

test('ToolNotFoundError has stable code', () => {
  const error = new ToolNotFoundError();
  assert.equal(error.code, 'TOOL_NOT_FOUND');
});

test('ToolValidationError has stable code', () => {
  const error = new ToolValidationError();
  assert.equal(error.code, 'TOOL_VALIDATION_ERROR');
});

test('ToolExecutionBlockedError has stable code', () => {
  const error = new ToolExecutionBlockedError();
  assert.equal(error.code, 'TOOL_EXECUTION_BLOCKED');
});
