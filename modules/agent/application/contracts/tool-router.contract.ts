export interface ToolRouterContract {
  route(params: {
    toolName: string;
    arguments: unknown;
    userId: string;
  }): Promise<unknown>;
}
