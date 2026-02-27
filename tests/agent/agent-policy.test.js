'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const { AGENT_POLICY } = require('../../build/modules/agent/application/agent-policy.js');

test('AGENT_POLICY exposes expected values', () => {
  assert.equal(AGENT_POLICY.maxToolsPerRequest, 1);
  assert.equal(AGENT_POLICY.maxRepairAttempts, 1);
  assert.equal(AGENT_POLICY.strictSingleJsonObject, true);
});

test('AGENT_POLICY is readonly/frozen at runtime', () => {
  assert.equal(Object.isFrozen(AGENT_POLICY), true);

  assert.throws(() => {
    AGENT_POLICY.maxToolsPerRequest = 2;
  }, TypeError);
});
