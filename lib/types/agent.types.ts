export type AgentResponse =
  | { type: "response"; content: string }
  | { type: "tool"; toolName: string; content: unknown };

export type ChatMessage =
  | { id: string; role: "user"; content: string }
  | { id: string; role: "assistant"; type: "response"; content: string }
  | { id: string; role: "assistant"; type: "tool"; toolName: string; content: unknown };

export type ChatState = {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
};
