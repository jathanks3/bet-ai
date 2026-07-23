// src/types/betting.ts
import type { Impact, TrustTier, FindingCategory } from "./shared";

// ---- Sports & bet-type vocabulary ----
export type League = "NBA" | "WNBA" | "NFL" | "MLB" | "NHL" | "NCAA";

export type BetType = "moneyline" | "spread" | "total" | "player_prop";

// The AI's overall verdict on a bet or slip.
export type Verdict = "bet" | "lean" | "pass" | "avoid";

// ---- Finding: one piece of evidence ----
// Replaces the old separate InjuryNote / PerformanceTrend / OddsMovement /
// OverlookedFactor types. Every kind of evidence is now the same shape,
// distinguished by `category`. This is what lets us add new categories
// (schedule, weather, public/sharp signals) without new UI code.
export interface Finding {
  id: string;
  category: FindingCategory;
  impact: Impact;
  title?: string;
  detail: string;
  meta?: string;
  trustTier?: TrustTier;
}

// ---- BetLeg: one single bet ----
// A leg is the atomic unit. A single straight bet, and each leg of a parlay,
// are both just one BetLeg. This is what lets "Find a Bet," "Analyze My Bet,"
// and "Build My Parlay" all reuse the same rendering and scoring logic.
export interface BetLeg {
  id: string;
  label: string;           // e.g. "Lakers -4.5" or "LeBron James Over 25.5 Points"
  sport: League;
  betType: BetType;
  legRating: number;        // 0-100, this specific leg's strength
  findings: Finding[];
}

export interface WagerContext {
  description: string;
  stake: number;
  americanOdds: number;
  decimalOdds: number;
  betType: BetType | "parlay";
  numberOfLegs: number;
  legSummary: string[];
}

// ---- BetSlipAnalysis: the full result ----
// The one result type for all three workflows. "Find a Bet" produces one
// with a single leg. "Build My Parlay" and "Analyze My Bet" (multi-leg
// slips) produce one with multiple legs.
export interface BetSlipAnalysis {
  id: string;
  sourceQuestion?: string;        // what the user typed or pasted, if applicable
  legs: BetLeg[];
  overallRating: number;           // 0-100
  verdict: Verdict;
  confidence: number;              // 0-100, distinct from rating: "how sure is the AI"
  strongestLegId?: string;
  weakestLegId?: string;
  biggestRisk: string;
  biggestEdge: string;
  suggestedImprovements: string[];
  suggestedReplacements?: string[];
  overallReliabilityTier: TrustTier;
  disclaimer: string;
  generatedAt: string;
  wager: WagerContext;
}
