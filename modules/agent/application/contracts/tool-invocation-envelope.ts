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
export interface ToolInvocationEnvelope {
  tool: string | null;
  arguments?: unknown;
  response?: string;
}
