export interface LLMClientContract {
  invoke(prompt: string, options?: unknown): Promise<string>;
}
