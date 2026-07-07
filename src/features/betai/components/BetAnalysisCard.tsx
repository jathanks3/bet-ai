// src/features/betai/components/BetAnalysisCard.tsx
import type { BetSlipAnalysis, BetLeg, Verdict } from "../../../types/betting";
import Card from "../../../ui/Card";
import Badge from "../../../ui/Badge";
import type { BadgeIntent } from "../../../ui/Badge";
import SignalMeter from "../../../ui/SignalMeter";
import FindingCard from "../../../ui/FindingCard";
import "./BetAnalysisCard.css";

interface BetAnalysisCardProps {
  analysis: BetSlipAnalysis;
}

function humanize(value: string): string {
  return value
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function verdictIntent(verdict: Verdict): BadgeIntent {
  switch (verdict) {
    case "bet":
      return "success";
    case "lean":
      return "info";
    case "pass":
      return "warning";
    case "avoid":
      return "danger";
  }
}

function verdictAccentVar(verdict: Verdict): string {
  switch (verdict) {
    case "bet":
      return "var(--accent-signal)";
    case "lean":
      return "var(--accent-trust)";
    case "pass":
      return "var(--accent-risk)";
    case "avoid":
      return "var(--accent-danger)";
  }
}

function reliabilityLabel(tier: string): string {
  switch (tier) {
    case "tier_1_official":
      return "Tier 1 - Official Source";
    case "tier_2_reported":
      return "Tier 2 - Reported/Media";
    case "tier_3_unverified":
      return "Tier 3 - Unverified";
    default:
      return tier;
  }
}

function LegSection({ leg, index, isMultiLeg }: { leg: BetLeg; index: number; isMultiLeg: boolean }) {
  return (
    <div className="leg-section">
      <div className="leg-header">
        <div className="leg-label">
          {isMultiLeg && <span className="leg-number">LEG {index + 1}</span>}
          {leg.label}
        </div>
        <div className="leg-meta-row">
          <span className="leg-bet-type">{humanize(leg.betType)}</span>
          <span className="leg-rating">{leg.legRating}/100</span>
        </div>
      </div>
      <div className="rec-list">
        {leg.findings.map((finding) => (
          <FindingCard
            key={finding.id}
            impact={finding.impact}
            title={finding.title}
            detail={finding.detail}
            meta={finding.meta}
          />
        ))}
      </div>
    </div>
  );
}

export default function BetAnalysisCard({ analysis }: BetAnalysisCardProps) {
  const isMultiLeg = analysis.legs.length > 1;

  return (
    <Card accentColor={verdictAccentVar(analysis.verdict)}>
      {analysis.sourceQuestion && (
        <div className="rec-question">"{analysis.sourceQuestion}"</div>
      )}
      <div className="rec-eyebrow">
        {isMultiLeg ? "AI PARLAY ANALYSIS" : "AI BET ANALYSIS"}
      </div>

      <div className="rec-pick-row">
        <h2 className="rec-pick-name">
          {isMultiLeg ? `${analysis.legs.length}-Leg Parlay` : analysis.legs[0].label}
        </h2>
        <Badge intent={verdictIntent(analysis.verdict)}>{humanize(analysis.verdict)}</Badge>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <SignalMeter
          label="OVERALL RATING"
          score={analysis.overallRating}
          zones={["WEAK", "SOLID", "STRONG"]}
        />
      </div>
      <div style={{ marginBottom: "28px" }}>
        <SignalMeter label="AI CONFIDENCE" score={analysis.confidence} />
      </div>

      <div className="rec-callouts">
        <div className="rec-callout rec-callout-edge">
          <span className="rec-callout-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 17l6-6 4 4 8-8" />
              <path d="M15 6h6v6" />
            </svg>
          </span>
          <div>
            <h3 className="rec-callout-label">Biggest Edge</h3>
            <p className="rec-callout-text">{analysis.biggestEdge}</p>
          </div>
        </div>

        <div className="rec-callout rec-callout-risk">
          <span className="rec-callout-icon" aria-hidden="true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 9v4M12 16.5v.01" />
              <path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z" />
            </svg>
          </span>
          <div>
            <h3 className="rec-callout-label">Biggest Risk</h3>
            <p className="rec-callout-text">{analysis.biggestRisk}</p>
          </div>
        </div>
      </div>

      {analysis.legs.map((leg, idx) => (
        <div className="rec-section" key={leg.id}>
          <h3 className="rec-section-label">
            <span className="rec-section-dot dot-trust" />
            {isMultiLeg ? `LEG ${idx + 1} BREAKDOWN` : "KEY FINDINGS"}
          </h3>
          <LegSection leg={leg} index={idx} isMultiLeg={isMultiLeg} />
        </div>
      ))}

      {analysis.suggestedImprovements.length > 0 && (
        <div className="rec-section">
          <h3 className="rec-section-label">
            <span className="rec-section-dot dot-signal" />
            SUGGESTED IMPROVEMENTS
          </h3>
          <ul className="rec-list">
            {analysis.suggestedImprovements.map((tip, idx) => (
              <li key={idx} className="rec-list-item">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rec-section">
        <h3 className="rec-section-label">
          <span className="rec-section-dot dot-trust" />
          SOURCE TRUST
        </h3>
        <div className="rec-list-item">
          <Badge intent="info">{reliabilityLabel(analysis.overallReliabilityTier)}</Badge>{" "}
          Official league and team sources are weighted highest in this analysis.
        </div>
      </div>

      <div className="rec-disclaimer">
        <span className="rec-disclaimer-label">RESPONSIBLE GAMBLING</span>
        {analysis.disclaimer}
      </div>
    </Card>
  );
}
