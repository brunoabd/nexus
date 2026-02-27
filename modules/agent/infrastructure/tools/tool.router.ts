import { ToolNotFoundError, ToolValidationError } from '../../domain-like/agent-errors';
import { TOOL_REGISTRY } from './tool.registry';

type RouterTool = {
  schema: unknown;
  execute: (input: { arguments: unknown; userId: string }) => Promise<unknown>;
};

type RouterRegistry = Readonly<Record<string, RouterTool>>;

function validateToolArguments(schema: unknown, args: unknown): void {
  if (schema === null || schema === undefined) {
    return;
  }

  try {
    if (typeof schema === 'function') {
      const valid = schema(args);
      if (valid === false) {
        throw new ToolValidationError('Tool arguments failed schema validation.');
      }
      return;
    }

    if (typeof schema === 'object') {
      const candidate = schema as {
        validate?: (input: unknown) => boolean;
        parse?: (input: unknown) => unknown;
      };

      if (typeof candidate.validate === 'function') {
        const valid = candidate.validate(args);
        if (!valid) {
          throw new ToolValidationError('Tool arguments failed schema validation.');
        }
        return;
      }

      if (typeof candidate.parse === 'function') {
        candidate.parse(args);
        return;
      }
    }

    throw new ToolValidationError('Unsupported tool schema validator.');
  } catch (error) {
    if (error instanceof ToolValidationError) {
      throw error;
    }
    throw new ToolValidationError('Tool arguments failed schema validation.');
  }
}

export class ToolRouter {
  constructor(private readonly registry: RouterRegistry = TOOL_REGISTRY) {}

  async route(params: { toolName: string; arguments: unknown; userId: string }): Promise<unknown> {
    const { toolName, arguments: toolArguments, userId } = params;

    const tool = this.registry[toolName];
    if (!tool) {
      throw new ToolNotFoundError(`Tool not found: ${toolName}`);
    }

    validateToolArguments(tool.schema, toolArguments);

    // Structured logging will be implemented in Commit 8.
    return tool.execute({ arguments: toolArguments, userId });
  }
}
