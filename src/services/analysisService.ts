// src/services/analysisService.ts
import type { BetSlipAnalysis, BetLeg, Finding, League, BetType, Verdict, WagerContext } from "../types/betting";
import { americanToDecimal } from "./oddsMath";
import type { TrustTier } from "../types/shared";
import { findTeamMatch, getAllTeams, type CatalogTeam } from "./teamCatalogService";
import { env } from "./env";
import {
  chance,
  clamp,
  jitter,
  isOutdoorLeague,
  teamInjuryFinding,
  opponentInjuryFinding,
  performanceTrendFinding,
  scheduleFinding,
  oddsMovementFinding,
  publicSharpFinding,
  weatherFinding,
  biggestRiskPhrase,
  biggestEdgePhrase,
  suggestedImprovements,
  type FindingSeed,
} from "./mockContent";

export interface ParlayPreferences {
  legCount: number;
  riskLevel: "safe" | "balanced" | "high_risk";
  sport?: League;
  propsOnly?: boolean;
}

// ---- THE INTERFACE ----
// One service, four entry points, all producing the same BetSlipAnalysis shape.
export interface AnalysisService {
  getRecommendation(query: string): Promise<BetSlipAnalysis>;
  analyzeBetSlipText(slipText: string): Promise<BetSlipAnalysis>;
  analyzeBetSlipImage(file: File): Promise<BetSlipAnalysis>;
  buildParlay(preferences: ParlayPreferences): Promise<BetSlipAnalysis>;
}

// ---- MOCK IMPLEMENTATION ----
class MockAnalysisService implements AnalysisService {
  async getRecommendation(query: string): Promise<BetSlipAnalysis> {
    await delay();
    const match = findTeamMatch(query);
    if (!match) {
      throw new Error(
        "We couldn't find a matching team for that question. Try naming a specific team, like \"Lakers\" or \"Chiefs.\""
      );
    }
    const leg = buildLegForTeam(match.team, match.opponent, match.sport);
    return buildAnalysis([leg], query);
  }

  async analyzeBetSlipText(slipText: string): Promise<BetSlipAnalysis> {
    await delay();

    const allLines = slipText
      .split(/\n|,/)
      .map((line) => line.trim())
      .filter(Boolean);
    const lines = allLines.filter((line) => !/^(stake|wager|odds|combined odds)\s*:/i.test(line));

    if (lines.length === 0) {
      throw new Error(
        "We couldn't read any bets from that text. Try pasting each leg on its own line."
      );
    }

    const legs: BetLeg[] = lines.map((line) => {
      const match = findTeamMatch(line);
      return match
        ? buildLegForTeam(match.team, match.opponent, match.sport, line)
        : buildUnmatchedLeg(line);
    });

    return buildAnalysis(legs, slipText, parseWagerDetails(allLines));
  }

  async analyzeBetSlipImage(): Promise<BetSlipAnalysis> {
    await delay(300);
    throw new Error(
      "Image analysis is coming soon. For now, try pasting your bet slip as text."
    );
  }

  async buildParlay(preferences: ParlayPreferences): Promise<BetSlipAnalysis> {
    await delay();

    const pool = getAllTeams().filter(
      (t) => !preferences.sport || t.league === preferences.sport
    );

    const legs: BetLeg[] = [];
    const used = new Set<string>();

    for (let i = 0; i < preferences.legCount; i++) {
      const candidates = pool.filter((t) => !used.has(t.name));
      const team = pickRandom(candidates);
      if (!team) break;
      used.add(team.name);

      const opponentCandidates = pool.filter(
        (t) => t.league === team.league && t.name !== team.name
      );
      const opponent = pickRandom(opponentCandidates) ?? team;

      legs.push(
        buildLegForTeam(team, opponent, team.league, undefined, preferences.propsOnly)
      );
    }

    if (legs.length === 0) {
      throw new Error("We couldn't build a parlay with those preferences. Try a different sport.");
    }

    return buildAnalysis(legs);
  }
}

// ---- SHARED HELPERS ----

function delay(ms = env.mockDelayMs + Math.random() * 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let idCounter = 0;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}-${Date.now()}-${idCounter}`;
}

function buildLegForTeam(
  team: CatalogTeam,
  opponent: CatalogTeam,
  sport: League,
  customLabel?: string,
  propsOnly = false
): BetLeg {
  const seed = team.name.length + opponent.name.length;

  const betType: BetType = propsOnly
    ? "player_prop"
    : seed % 2 === 0
    ? "spread"
    : "moneyline";

  const label =
    customLabel ??
    (betType === "player_prop"
      ? `${team.name} Starter Over ${(seed % 15) + 15}.5 Points`
      : betType === "spread"
      ? `${team.name} -${(seed % 6) + 1}.5`
      : `${team.name} Moneyline`);

  const findingSeeds: FindingSeed[] = [
    teamInjuryFinding(team.name, sport),
    opponentInjuryFinding(opponent.name, sport),
    performanceTrendFinding(team.name),
    scheduleFinding(team.name, opponent.name),
    oddsMovementFinding(team.name, opponent.name),
  ];

  if (chance(0.6)) {
    findingSeeds.push(publicSharpFinding(team.name));
  }

  if (isOutdoorLeague(sport) && chance(0.6)) {
    const weather = weatherFinding(team.name, opponent.name);
    if (weather) findingSeeds.push(weather);
  }

  const findings: Finding[] = findingSeeds.map((seed) => ({
    id: nextId("finding"),
    ...seed,
  }));

  const impactScore = findings.reduce((sum, f) => {
    if (f.impact === "positive") return sum + 1;
    if (f.impact === "negative") return sum - 1;
    return sum;
  }, 0);

  const legRating = clamp(jitter(58 + impactScore * 8, 5), 30, 97);

  return {
    id: nextId("leg"),
    label,
    sport,
    betType,
    legRating,
    findings,
  };
}

function buildUnmatchedLeg(label: string): BetLeg {
  const betType: BetType = /\b(over|under)\b.*\b(points?|rebounds?|assists?|yards?|goals?)\b/i.test(label)
    ? "player_prop"
    : /\b(over|under)\b/i.test(label)
    ? "total"
    : /[+-]\d+(?:\.\d+)?/.test(label)
    ? "spread"
    : "moneyline";
  return {
    id: nextId("leg"),
    label,
    sport: "NBA",
    betType,
    legRating: 50,
    findings: [
      {
        id: nextId("finding"),
        category: "other",
        impact: "neutral",
        detail:
          "We couldn't match this leg to a known team yet. Treating it as neutral until more data is available.",
      },
    ],
  };
}

function pickRandom<T>(items: T[]): T | undefined {
  if (items.length === 0) return undefined;
  return items[Math.floor(Math.random() * items.length)];
}

function verdictFromRating(rating: number): Verdict {
  if (rating >= 75) return "bet";
  if (rating >= 60) return "lean";
  if (rating >= 45) return "pass";
  return "avoid";
}

interface ParsedWagerDetails {
  stake?: number;
  americanOdds?: number;
}

function parseWagerDetails(lines: string[]): ParsedWagerDetails {
  const source = lines.join(" ");
  const stakeMatch = source.match(/(?:stake|wager)\s*:\s*\$?(\d+(?:\.\d{1,2})?)/i);
  const oddsMatch = source.match(/(?:combined\s+)?odds\s*:\s*([+-]\d{3,5})/i);
  return {
    stake: stakeMatch ? Number(stakeMatch[1]) : undefined,
    americanOdds: oddsMatch ? Number(oddsMatch[1]) : undefined,
  };
}

function buildAnalysis(
  legs: BetLeg[],
  sourceQuestion?: string,
  parsed: ParsedWagerDetails = {},
): BetSlipAnalysis {
  const overallRating = Math.round(
    legs.reduce((sum, leg) => sum + leg.legRating, 0) / legs.length
  );
  const confidence = clamp(jitter(overallRating - 5, 6), 35, 97);

  const sortedByRating = [...legs].sort((a, b) => b.legRating - a.legRating);
  const strongest = sortedByRating[0];
  const weakest = sortedByRating[sortedByRating.length - 1];
  const isMultiLeg = legs.length > 1;

  const allOfficial = legs.every((leg) =>
    leg.findings.every((f) => !f.trustTier || f.trustTier === "tier_1_official")
  );
  const overallReliabilityTier: TrustTier = allOfficial ? "tier_1_official" : "tier_2_reported";
  const defaultOdds = isMultiLeg ? 450 : -110;
  const americanOdds = parsed.americanOdds ?? defaultOdds;
  const wager: WagerContext = {
    description: isMultiLeg ? `${legs.length}-Leg Parlay` : legs[0].label,
    stake: parsed.stake ?? 25,
    americanOdds,
    decimalOdds: americanToDecimal(americanOdds),
    betType: isMultiLeg ? "parlay" : legs[0].betType,
    numberOfLegs: legs.length,
    legSummary: legs.map((leg) => leg.label),
  };

  return {
    id: nextId("analysis"),
    sourceQuestion,
    legs,
    overallRating,
    verdict: verdictFromRating(overallRating),
    confidence,
    strongestLegId: strongest?.id,
    weakestLegId: weakest?.id,
    biggestRisk: weakest ? biggestRiskPhrase(weakest.label) : "No significant risks identified.",
    biggestEdge: strongest ? biggestEdgePhrase(strongest.label) : "No standout edge identified.",
    suggestedImprovements: suggestedImprovements(isMultiLeg, weakest?.label),
    overallReliabilityTier,
    disclaimer:
      "This is not financial advice and no outcome is guaranteed. Bet only what you can afford to lose. If gambling stops being fun, please seek help at 1-800-GAMBLER.",
    generatedAt: new Date().toISOString(),
    wager,
  };
}

// Singleton instance the rest of the app imports and uses.
export const analysisService: AnalysisService = new MockAnalysisService();
