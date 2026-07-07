// src/services/mockContent.ts
//
// Phrase banks for the mock analysis engine. Every finding, risk, edge, and
// improvement the app shows is picked at random from here rather than
// hard-coded, so repeated queries don't read like a template. When a real
// AI/sports-data backend replaces the mock service, this file (and the
// functions that consume it in analysisService.ts) is the only thing that
// gets deleted - nothing in the UI depends on it directly.
import type { FindingCategory, Impact, TrustTier } from "../types/shared";
import type { League } from "../types/betting";

export interface FindingSeed {
  category: FindingCategory;
  impact: Impact;
  title?: string;
  detail: string;
  meta?: string;
  trustTier?: TrustTier;
}

export function pick<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function chance(probability: number): boolean {
  return Math.random() < probability;
}

export function jitter(base: number, spread: number): number {
  return base + Math.round((Math.random() * 2 - 1) * spread);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

const STREAK_LENGTHS = [3, 4, 5, 6, 7];

export function teamInjuryFinding(team: string, sport: League): FindingSeed {
  const variants: FindingSeed[] = [
    {
      category: "injury",
      impact: "neutral",
      title: `${team} Injury Report`,
      detail: `${team} listed their full rotation as active with no restrictions heading into this matchup.`,
      meta: `${sport}.com Injury Report`,
      trustTier: "tier_1_official",
    },
    {
      category: "injury",
      impact: "positive",
      title: `${team} Injury Report`,
      detail: `${team} gets a key starter back off the injury list this week, a boost most bettors haven't priced in yet.`,
      meta: `${sport}.com Injury Report`,
      trustTier: "tier_1_official",
    },
    {
      category: "injury",
      impact: "negative",
      title: `${team} Injury Report`,
      detail: `${team} has a rotation piece listed as questionable - worth checking the final report before you lock this in.`,
      meta: `${sport}.com Injury Report`,
      trustTier: "tier_1_official",
    },
    {
      category: "injury",
      impact: "neutral",
      title: `${team} Injury Report`,
      detail: `${team}'s injury report is unchanged from last week - no new names added.`,
      meta: `${sport}.com Injury Report`,
      trustTier: "tier_1_official",
    },
  ];
  return pick(variants);
}

export function opponentInjuryFinding(opponent: string, sport: League): FindingSeed {
  const variants: FindingSeed[] = [
    {
      category: "injury",
      impact: "positive",
      title: `${opponent} Injury Report`,
      detail: `${opponent} has a starter listed as a game-time decision, which thins their rotation if he sits.`,
      meta: `${sport}.com Injury Report`,
      trustTier: "tier_1_official",
    },
    {
      category: "injury",
      impact: "positive",
      title: `${opponent} Injury Report`,
      detail: `${opponent} is already missing multiple regulars and will likely lean on bench depth tonight.`,
      meta: `${sport}.com Injury Report`,
      trustTier: "tier_1_official",
    },
    {
      category: "injury",
      impact: "neutral",
      title: `${opponent} Injury Report`,
      detail: `${opponent} reports a clean injury sheet - full strength expected.`,
      meta: `${sport}.com Injury Report`,
      trustTier: "tier_1_official",
    },
    {
      category: "injury",
      impact: "negative",
      title: `${opponent} Injury Report`,
      detail: `${opponent} gets a key piece back from injury, which makes this matchup tougher than the line suggests.`,
      meta: `${sport}.com Injury Report`,
      trustTier: "tier_1_official",
    },
  ];
  return pick(variants);
}

export function performanceTrendFinding(team: string): FindingSeed {
  const streak = pick(STREAK_LENGTHS);
  const variants: FindingSeed[] = [
    {
      category: "performance_trend",
      impact: "positive",
      title: team,
      detail: `${team} have won ${streak} of their last ${streak + 1} games and are playing with real momentum.`,
    },
    {
      category: "performance_trend",
      impact: "positive",
      title: team,
      detail: `${team} are covering the number at an above-average clip over their last ${streak} outings.`,
    },
    {
      category: "performance_trend",
      impact: "negative",
      title: team,
      detail: `${team} have dropped ${Math.max(2, streak - 3)} of their last ${streak} games, a cold stretch worth factoring in.`,
    },
    {
      category: "performance_trend",
      impact: "neutral",
      title: team,
      detail: `${team} have been inconsistent lately, splitting their last ${streak} games roughly evenly.`,
    },
  ];
  return pick(variants);
}

export function scheduleFinding(team: string, opponent: string): FindingSeed {
  const variants: FindingSeed[] = [
    {
      category: "schedule",
      impact: "positive",
      title: opponent,
      detail: `${opponent} are on the second night of a back-to-back, which historically saps second-half energy.`,
    },
    {
      category: "schedule",
      impact: "positive",
      title: team,
      detail: `${team} are well-rested off a bye stretch while ${opponent} are on the road for the third straight game.`,
    },
    {
      category: "schedule",
      impact: "negative",
      title: team,
      detail: `${team} just wrapped a long road trip, and travel fatigue has quietly hurt them in similar spots this season.`,
    },
    {
      category: "schedule",
      impact: "neutral",
      title: opponent,
      detail: `${opponent} are on a normal rest cycle - no schedule edge either way here.`,
    },
  ];
  return pick(variants);
}

export function oddsMovementFinding(team: string, opponent: string): FindingSeed {
  const variants: FindingSeed[] = [
    {
      category: "odds_movement",
      impact: "positive",
      detail: `The line has moved toward ${team} since opening, typically a sign sharper money is backing them.`,
    },
    {
      category: "odds_movement",
      impact: "negative",
      detail: `The line has drifted toward ${opponent}, suggesting the market sees more value on the other side.`,
    },
    {
      category: "odds_movement",
      impact: "neutral",
      detail: `The line has held steady since opening - the market isn't showing a strong lean either way.`,
    },
    {
      category: "odds_movement",
      impact: "positive",
      detail: `Total handle is lighter than ticket count on ${opponent}, a classic signal of the public on one side and sharps on the other.`,
    },
  ];
  return pick(variants);
}

export function publicSharpFinding(team: string): FindingSeed {
  const variants: FindingSeed[] = [
    {
      category: "public_sharp_signal",
      impact: "positive",
      detail: `Sharp bettors have been quietly stacking ${team} throughout the day according to market movement.`,
      trustTier: "tier_2_reported",
    },
    {
      category: "public_sharp_signal",
      impact: "negative",
      detail: `This game is drawing heavy public ticket volume, which can push lines away from the true number.`,
      trustTier: "tier_2_reported",
    },
    {
      category: "public_sharp_signal",
      impact: "neutral",
      detail: `Betting splits are close to even on both sides - no clear public or sharp lean yet.`,
      trustTier: "tier_2_reported",
    },
  ];
  return pick(variants);
}

const OUTDOOR_LEAGUES: League[] = ["NFL", "MLB"];

export function weatherFinding(team: string, opponent: string): FindingSeed | null {
  const variants: FindingSeed[] = [
    {
      category: "weather",
      impact: "negative",
      detail: `Forecasts show wind gusts over 20 mph at kickoff, which tends to suppress passing totals.`,
      trustTier: "tier_2_reported",
    },
    {
      category: "weather",
      impact: "neutral",
      detail: `Conditions look mild and dry - weather shouldn't be a factor in this one.`,
      trustTier: "tier_2_reported",
    },
    {
      category: "weather",
      impact: "positive",
      detail: `Clear skies and calm wind favor ${team}'s pass-heavy game plan over ${opponent}'s.`,
      trustTier: "tier_2_reported",
    },
  ];
  return pick(variants);
}

export function isOutdoorLeague(sport: League): boolean {
  return OUTDOOR_LEAGUES.includes(sport);
}

// ---- Summary phrasing (risk / edge / improvements) ----

export function biggestRiskPhrase(weakestLegLabel: string): string {
  const variants = [
    `${weakestLegLabel} is the shakiest piece here - a late scratch or lineup change would hurt this the most.`,
    `${weakestLegLabel} carries the most uncertainty of the group - keep an eye on news before lock.`,
    `If this bet misses, ${weakestLegLabel} is the most likely reason why.`,
    `${weakestLegLabel} is leaning on a trend that could break at any time - the softest leg in the group.`,
  ];
  return pick(variants);
}

export function biggestEdgePhrase(strongestLegLabel: string): string {
  const variants = [
    `${strongestLegLabel} carries the strongest combination of form and market movement.`,
    `${strongestLegLabel} is the clearest advantage in this analysis - the data and the line both point the same direction.`,
    `${strongestLegLabel} stands out as the leg with the least resistance working against it.`,
    `The strongest signal here is ${strongestLegLabel}, backed by both recent form and injury news.`,
  ];
  return pick(variants);
}

export function suggestedImprovements(isMultiLeg: boolean, weakestLegLabel?: string): string[] {
  if (isMultiLeg && weakestLegLabel) {
    const variants = [
      [`Consider removing ${weakestLegLabel} to meaningfully improve this parlay's odds of hitting.`],
      [`Swapping out ${weakestLegLabel} for a safer alternative would tighten this slip without giving up much payout.`],
      [`This parlay is carrying more risk than it needs to - ${weakestLegLabel} is the leg to reconsider first.`],
    ];
    return pick(variants);
  }

  const variants = [
    ["Consider comparing this line across multiple sportsbooks before betting - even half a point matters."],
    ["Waiting until closer to game time could get you a better number if the market keeps moving this direction."],
    ["This looks like a reasonable spot, but sizing it smaller than usual would account for the uncertainty above."],
  ];
  return pick(variants);
}
