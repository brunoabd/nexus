import { InvalidLLMOutputError } from '../../domain-like/agent-errors';
import type { ToolInvocationEnvelope } from '../../application/contracts/tool-invocation-envelope';

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function parseLLMResponse(rawText: string): ToolInvocationEnvelope {
  if (typeof rawText !== 'string') {
    throw new InvalidLLMOutputError('LLM output must be a string.');
  }

  const trimmed = rawText.trim();

  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) {
    throw new InvalidLLMOutputError('LLM output must be exactly one JSON object.');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    throw new InvalidLLMOutputError('LLM output is not valid JSON.');
  }

  if (!isPlainObject(parsed)) {
    throw new InvalidLLMOutputError('LLM output must be a JSON object.');
  }

  const keys = Object.keys(parsed);
  const allowedKeys = new Set(['tool', 'arguments', 'response']);
  for (const key of keys) {
    if (!allowedKeys.has(key)) {
      throw new InvalidLLMOutputError('LLM output contains unsupported fields.');
    }
  }

  const tool = parsed.tool;

  if (typeof tool === 'string') {
    if (!Object.prototype.hasOwnProperty.call(parsed, 'arguments')) {
      throw new InvalidLLMOutputError('Tool invocation requires arguments.');
    }

    if (Object.prototype.hasOwnProperty.call(parsed, 'response')) {
      throw new InvalidLLMOutputError('Tool invocation must not include response.');
    }

    return {
      tool,
      arguments: parsed.arguments,
    };
  }

  if (tool === null) {
    if (!Object.prototype.hasOwnProperty.call(parsed, 'response')) {
      throw new InvalidLLMOutputError('Natural response requires response text.');
    }

    if (typeof parsed.response !== 'string') {
      throw new InvalidLLMOutputError('Natural response must be a string.');
    }

    if (Object.prototype.hasOwnProperty.call(parsed, 'arguments')) {
      throw new InvalidLLMOutputError('Natural response must not include arguments.');
    }

    return {
      tool: null,
      response: parsed.response,
    };
  }

  throw new InvalidLLMOutputError('Invalid tool field in LLM output.');
}
