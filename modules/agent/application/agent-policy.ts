/**
 * These policies are structural NON-GOALS of the MVP.
 * Any change requires architectural review.
 */
export const AGENT_POLICY = Object.freeze({
  maxToolsPerRequest: 1,
  maxRepairAttempts: 1,
  strictSingleJsonObject: true,
} as const);
