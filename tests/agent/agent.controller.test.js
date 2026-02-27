'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');

class MockBadRequestException extends Error {}

const originalLoad = Module._load;
Module._load = function patchedLoad(request, parent, isMain) {
  if (request === '@nestjs/common') {
    return {
      BadRequestException: MockBadRequestException,
      Body: () => () => undefined,
      Controller: () => () => undefined,
      Inject: () => () => undefined,
      Module: () => () => undefined,
      Post: () => () => undefined,
      Req: () => () => undefined,
      UseGuards: () => () => undefined,
    };
  }

  if (request === '@nestjs/passport') {
    return {
      AuthGuard: () => class JwtAuthGuardMock {},
    };
  }

  if (request === 'class-validator') {
    return {
      IsNotEmpty: () => () => undefined,
      IsString: () => () => undefined,
      validateSync: (input) => {
        if (typeof input?.message === 'string' && input.message.trim().length > 0) {
          return [];
        }
        return [{ constraint: 'message required' }];
      },
    };
  }

  return originalLoad.call(this, request, parent, isMain);
};

const { AgentController } = require('../../build/modules/agent/agent.controller.js');

test('extracts userId from req.user.id and calls handleMessage with expected payload', async () => {
  let capturedParams = null;
  const mockAgentService = {
    handleMessage: async (params) => {
      capturedParams = params;
      return { type: 'response', content: 'ok' };
    },
  };

  const mockLlmClient = { invoke: async () => '{}' };
  const controller = new AgentController(mockAgentService, mockLlmClient);

  const req = { user: { id: 'jwt-user-1' } };
  const body = { message: 'hello', userId: 'malicious-body-user' };

  const result = await controller.chat(req, body);

  assert.deepEqual(result, { type: 'response', content: 'ok' });
  assert.deepEqual(capturedParams, {
    userId: 'jwt-user-1',
    message: 'hello',
    llmClient: mockLlmClient,
  });
});

test('rejects body without message', async () => {
  const mockAgentService = {
    handleMessage: async () => ({ type: 'response', content: 'ok' }),
  };
  const controller = new AgentController(mockAgentService, { invoke: async () => '{}' });

  await assert.rejects(
    () => controller.chat({ user: { id: 'jwt-user-2' } }, {}),
    MockBadRequestException,
  );
});
