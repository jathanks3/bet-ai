// src/components/ChatInput.tsx
import { useState } from "react";
import "./ChatInput.css";

interface ChatInputProps {
  onSubmit: (question: string) => void;
}

export default function ChatInput({ onSubmit }: ChatInputProps) {
  const [question, setQuestion] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim().length === 0) return;
    onSubmit(question.trim());
  };

  return (
    <form className="chat-input-form" onSubmit={handleSubmit}>
      <input
        type="text"
        className="chat-input-field"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask about tonight's game..."
        aria-label="Ask BetAI about a team or matchup"
      />
      <button
        type="submit"
        className="chat-input-button"
        disabled={question.trim().length === 0}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="19" x2="12" y2="5" />
          <polyline points="5 12 12 5 19 12" />
        </svg>
        <span className="chat-input-button-text">Ask</span>
      </button>
    </form>
  );
}