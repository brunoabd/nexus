"use client";

import { ChatMessage } from "../../lib/types/agent.types";
import { ToolResponseRenderer } from "./ToolResponseRenderer";

type Props = {
  message: ChatMessage;
};

export function MessageItem({ message }: Props) {
  const isUser = message.role === "user";

  return (
    <div className={`message-row ${isUser ? "user" : "assistant"}`}>
      <div className="message-bubble">
        {isUser ? (
          <p>{message.content}</p>
        ) : message.type === "tool" ? (
          <ToolResponseRenderer toolName={message.toolName} content={message.content} />
        ) : (
          <p>{message.content}</p>
        )}
      </div>
    </div>
  );
}
