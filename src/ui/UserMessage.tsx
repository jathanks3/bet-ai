// src/ui/UserMessage.tsx
import type { ReactNode } from "react";
import "./UserMessage.css";

interface UserMessageProps {
  children: ReactNode;
}

export default function UserMessage({ children }: UserMessageProps) {
  return (
    <div className="user-message-row">
      <div className="user-message-bubble">{children}</div>
    </div>
  );
}
