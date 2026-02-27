"use client";

import { ChatMessage } from "../../lib/types/agent.types";
import { MessageItem } from "./MessageItem";

type Props = {
  messages: ChatMessage[];
  isLoading: boolean;
};

export function MessageList({ messages, isLoading }: Props) {
  return (
    <div className="message-list">
      {messages.map((message) => (
        <MessageItem key={message.id} message={message} />
      ))}
      {isLoading && (
        <div className="message-row assistant">
          <div className="message-bubble">Pensando...</div>
        </div>
      )}
    </div>
  );
}
