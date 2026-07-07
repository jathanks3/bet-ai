// src/ui/ThinkingIndicator.tsx
import { useEffect, useState } from "react";
import "./ThinkingIndicator.css";

interface ThinkingIndicatorProps {
  phrases: string[];
}

export default function ThinkingIndicator({ phrases }: ThinkingIndicatorProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (phrases.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, 1400);
    return () => clearInterval(interval);
  }, [phrases]);

  return (
    <div className="thinking-indicator" role="status" aria-live="polite">
      <span className="thinking-indicator-dots">
        <span />
        <span />
        <span />
      </span>
      <span className="thinking-indicator-text">{phrases[index]}</span>
    </div>
  );
}
