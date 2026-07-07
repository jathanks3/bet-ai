// src/types/shared.ts

// Universal types used across multiple products/features, not specific to any one domain.

// Whether something helps, hurts, or is neutral toward a recommendation/outcome.
// Used broadly: betting picks, deal risk flags, lead scores, compliance findings, etc.
export type Impact = "positive" | "negative" | "neutral";

// How trustworthy is the underlying source of a piece of information.
// Tier 1 = official (league/team sites), Tier 2 = reported (verified media),
// Tier 3 = unverified (social media, rumor, unconfirmed reports).
export type TrustTier = "tier_1_official" | "tier_2_reported" | "tier_3_unverified";

// A generic wrapper for any async operation's state.
// Used by any component/hook that fetches data and needs to show
// loading, error, or success states consistently across the app.
export type AsyncState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; data: T };

// The category of evidence a single Finding represents.
// This list is intentionally broad now so future categories (e.g. "referee_tendency",
// "travel_fatigue") can be added without changing any component's structure -
// components render based on `impact`, not `category`, so new categories are free.
export type FindingCategory =
  | "injury"
  | "performance_trend"
  | "odds_movement"
  | "schedule"
  | "public_sharp_signal"
  | "weather"
  | "other";