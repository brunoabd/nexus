/**
 * Envelope contract returned by the LLM.
 *
 * Rules:
 * - If tool !== null, arguments is required.
 * - If tool === null, response is required.
 * - No other fields should exist.
 *
 * Validation is intentionally not implemented in this commit.
 */
export type ToolInvocationEnvelope =
  | {
      tool: string;
      arguments: unknown;
      response?: never;
    }
  | {
      tool: null;
      response: string;
      arguments?: never;
    };
