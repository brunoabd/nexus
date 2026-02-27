import { AgentResponse } from "../types/agent.types";

export async function sendMessage(message: string): Promise<AgentResponse> {
  const response = await fetch("/agent/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(errorText || `HTTP ${response.status}`);
  }

  return (await response.json()) as AgentResponse;
}
