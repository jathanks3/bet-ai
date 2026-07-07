// src/ui/Card.tsx
import type { CSSProperties } from "react";
import "./Card.css";

interface CardProps {
  children: React.ReactNode;
  maxWidth?: number;
  accentColor?: string;
}

export default function Card({ children, maxWidth = 640, accentColor }: CardProps) {
  const style: CSSProperties & { "--card-accent"?: string } = {
    maxWidth: `${maxWidth}px`,
  };
  if (accentColor) {
    style["--card-accent"] = accentColor;
  }

  return (
    <div className="ui-card" style={style}>
      {children}
    </div>
  );
}
