"use client";

import { useState } from "react";
import { sendMessage } from "../../lib/api/agent.client";
import { ChatMessage, ChatState } from "../../lib/types/agent.types";
import { initialChatState } from "../../state/chat.state";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./MessageList";

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random()}`;
}

export function ChatContainer() {
  const [state, setState] = useState<ChatState>(initialChatState);

  const handleSend = async (message: string) => {
    const userMessage: ChatMessage = { id: createId(), role: "user", content: message };

    setState((prev) => ({
      ...prev,
      error: undefined,
      isLoading: true,
      messages: [...prev.messages, userMessage],
    }));

    try {
      const reply = await sendMessage(message);
      const assistantMessage: ChatMessage =
        reply.type === "tool"
          ? {
              id: createId(),
              role: "assistant",
              type: "tool",
              toolName: reply.toolName,
              content: reply.content,
            }
          : {
              id: createId(),
              role: "assistant",
              type: "response",
              content: reply.content,
            };

      setState((prev) => ({
        ...prev,
        isLoading: false,
        messages: [...prev.messages, assistantMessage],
      }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : "Erro ao enviar mensagem.",
      }));
    }
  };

  return (
    <section className="chat-container">
      <header className="chat-header">
        <h1>NEXUS Chat</h1>
      </header>

      <MessageList messages={state.messages} isLoading={state.isLoading} />

      {state.error && <p className="chat-error">{state.error}</p>}

      <ChatInput onSend={handleSend} disabled={state.isLoading} />
    </section>
  );
}
