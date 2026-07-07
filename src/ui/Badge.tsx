// src/ui/Badge.tsx
import "./Badge.css";

export type BadgeIntent = "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  intent?: BadgeIntent;
}

export default function Badge({ children, intent = "neutral" }: BadgeProps) {
  return <span className={`badge badge-${intent}`}>{children}</span>;
}