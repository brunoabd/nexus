import type { ToolInvocationEnvelope } from '../../modules/agent/application/contracts/tool-invocation-envelope';

const invocationWithTool: ToolInvocationEnvelope = {
  tool: 'create_task',
  arguments: { title: 'Task' },
};

const invocationWithoutTool: ToolInvocationEnvelope = {
  tool: null,
  response: 'Resposta natural',
};

const invalidInvocation: ToolInvocationEnvelope = {
  // @ts-expect-error tool must be string or null
  tool: 123,
};

void invocationWithTool;
void invocationWithoutTool;
void invalidInvocation;
