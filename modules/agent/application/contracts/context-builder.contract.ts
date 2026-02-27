export interface ContextBuilderContract {
  buildContext(params: {
    userId: string;
    message: string;
    activeProjectId?: string;
  }): Promise<string>;
}
