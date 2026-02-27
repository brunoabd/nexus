export type ToolKind = 'read' | 'mutation';

/**
 * A Tool must execute only one explicit action.
 * A Tool must not execute multiple implicit mutations.
 */
export interface ToolDefinition {
  name: string;
  description: string;
  kind: ToolKind;
  schema: unknown;
  execute: (...args: any[]) => Promise<any>;
}
