import { AGENT_POLICY } from '../../application/agent-policy';
import type { LLMClientContract } from '../../application/contracts/llm-client.contract';
import type { ToolInvocationEnvelope } from '../../application/contracts/tool-invocation-envelope';
import { InvalidLLMOutputError } from '../../domain-like/agent-errors';
import { parseLLMResponse } from './llm-response.parser';
import { buildRepairPrompt } from './repair-prompt.factory';

export async function attemptRepair(params: {
  rawInvalidText: string;
  llmClient: LLMClientContract;
}): Promise<ToolInvocationEnvelope> {
  const { rawInvalidText, llmClient } = params;

  if (AGENT_POLICY.maxRepairAttempts !== 1) {
    throw new InvalidLLMOutputError('Repair policy misconfigured for MVP.');
  }

  const repairPrompt = buildRepairPrompt(rawInvalidText);
  const repairedOutput = await llmClient.invoke(repairPrompt);

  try {
    return parseLLMResponse(repairedOutput);
  } catch {
    throw new InvalidLLMOutputError('LLM repair attempt failed.');
  }
}
