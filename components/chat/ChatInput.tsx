"use client";

import { FormEvent, useState } from "react";

type Props = {
  onSend: (message: string) => Promise<void>;
  disabled: boolean;
};

export function ChatInput({ onSend, disabled }: Props) {
  const [value, setValue] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || disabled) return;

    setValue("");
    await onSend(trimmed);
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder="Digite sua mensagem..."
        disabled={disabled}
      />
      <button type="submit" disabled={disabled || !value.trim()}>
        Enviar
      </button>
    </form>
  );
}
