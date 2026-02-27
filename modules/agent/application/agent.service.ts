import { AGENT_POLICY } from './agent-policy';
import type { LLMClientContract } from './contracts/llm-client.contract';
import type { ToolDefinition } from './contracts/tool-definition';
import { ToolExecutionBlockedError, InvalidLLMOutputError } from '../domain-like/agent-errors';
import { parseLLMResponse } from '../infrastructure/llm/llm-response.parser';
import { attemptRepair } from '../infrastructure/llm/llm-repair.executor';
import { TOOL_REGISTRY } from '../infrastructure/tools/tool.registry';
import { ToolRouter } from '../infrastructure/tools/tool.router';
import { buildContext } from '../infrastructure/context/context.builder';

export class AgentService {
  constructor(
    private readonly toolRouter: { route: (params: { toolName: string; arguments: unknown; userId: string }) => Promise<unknown> } = new ToolRouter(),
    private readonly tools: Readonly<Record<string, ToolDefinition>> = TOOL_REGISTRY,
  ) {}

  async handleMessage(params: {
    userId: string;
    message: string;
    llmClient: LLMClientContract;
  }): Promise<{
    type: 'response' | 'tool';
    toolName?: string;
    content: unknown;
  }> {
    const { userId, message, llmClient } = params;

    const context = buildContext({
      userMessage: message,
      tools: this.tools,
    });

    const initialRawOutput = await llmClient.invoke(JSON.stringify({
      system: context.system,
      user: context.user,
    }));

    let envelope;
    try {
      envelope = parseLLMResponse(initialRawOutput);
    } catch (error) {
      if (!(error instanceof InvalidLLMOutputError)) {
        throw error;
      }

      envelope = await attemptRepair({
        rawInvalidText: initialRawOutput,
        llmClient,
      });
    }

    if (envelope.tool === null) {
      return {
        type: 'response',
        content: envelope.response,
      };
    }

    let executedToolsCount = 0;
    if (executedToolsCount >= AGENT_POLICY.maxToolsPerRequest) {
      throw new ToolExecutionBlockedError('Only one tool execution is allowed per message handling.');
    }

    executedToolsCount += 1;

    const toolResult = await this.toolRouter.route({
      toolName: envelope.tool,
      arguments: envelope.arguments,
      userId,
    });

    return {
      type: 'tool',
      toolName: envelope.tool,
      content: toolResult,
    };
  }
}
