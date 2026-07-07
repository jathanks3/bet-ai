// src/ui/FindingCard.tsx
import type { Impact } from "../types/shared";
import type { FindingCategory } from "../types/shared";
import "./FindingCard.css";

interface FindingCardProps {
  impact: Impact;
  category?: FindingCategory;
  title?: string;
  detail: string;
  meta?: string;
}

function CategoryIcon({ category }: { category?: FindingCategory }) {
  const common = {
    width: 15,
    height: 15,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (category) {
    case "injury":
      return (
        <svg {...common}>
          <path d="M9 3v4M15 3v4M6 7h12l-1 13H7L6 7Z" />
          <path d="M10 11h4M12 9v4" />
        </svg>
      );
    case "performance_trend":
      return (
        <svg {...common}>
          <path d="M3 17l6-6 4 4 8-8" />
          <path d="M15 6h6v6" />
        </svg>
      );
    case "odds_movement":
      return (
        <svg {...common}>
          <path d="M4 6h16M4 12h10M4 18h16" />
          <path d="M17 15l3 3 3-3" />
        </svg>
      );
    case "schedule":
      return (
        <svg {...common}>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      );
    case "public_sharp_signal":
      return (
        <svg {...common}>
          <path d="M12 2 3 7l9 5 9-5-9-5Z" />
          <path d="M3 12l9 5 9-5M3 17l9 5 9-5" />
        </svg>
      );
    case "weather":
      return (
        <svg {...common}>
          <path d="M7.5 16A4.5 4.5 0 1 1 9 7.2 5.5 5.5 0 0 1 19 10a4 4 0 0 1-1 8H7.5Z" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 8v5M12 16.5v.01" />
        </svg>
      );
  }
}

export default function FindingCard({ impact, category, title, detail, meta }: FindingCardProps) {
  return (
    <div className={`finding-card impact-${impact}`}>
      <div className="finding-impact-icon">
        <CategoryIcon category={category} />
      </div>
      <div className="finding-body">
        {title && <div className="finding-title-row">{title}</div>}
        <div className="finding-detail">{detail}</div>
        {meta && <div className="finding-meta">{meta}</div>}
      </div>
    </div>
  );
}