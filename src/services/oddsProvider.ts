import { env } from "./env";
import type { OddsMarket, OddsProvider, SportsbookQuote } from "../types/odds";
import type { WagerContext } from "../types/betting";

export class OddsProviderError extends Error {
  readonly code: "missing_api_key" | "provider_outage" | "rate_limited";
  readonly retryAfterSeconds?: number;

  constructor(
    code: "missing_api_key" | "provider_outage" | "rate_limited",
    message: string,
    retryAfterSeconds?: number,
  ) {
    super(message);
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
    this.name = "OddsProviderError";
  }
}

const fixtureQuotes: Array<Omit<SportsbookQuote, "updatedAt"> & { ageMinutes: number }> = [
  { sportsbookId: "fanduel", sportsbookName: "FanDuel", americanOdds: -105, status: "live", ageMinutes: 1 },
  { sportsbookId: "draftkings", sportsbookName: "DraftKings", americanOdds: -110, status: "live", ageMinutes: 2 },
  { sportsbookId: "betmgm", sportsbookName: "BetMGM", americanOdds: -115, status: "live", ageMinutes: 3 },
  { sportsbookId: "caesars", sportsbookName: "Caesars", americanOdds: -108, status: "live", ageMinutes: 2 },
  { sportsbookId: "espn_bet", sportsbookName: "ESPN BET", americanOdds: -112, status: "live", ageMinutes: 4 },
  { sportsbookId: "fanatics", sportsbookName: "Fanatics", americanOdds: -110, status: "stale", ageMinutes: 18 },
];

export class FixtureOddsProvider implements OddsProvider {
  readonly name = "Demo fixture";

  async getMarket(wager: WagerContext): Promise<OddsMarket> {
    const now = Date.now();
    const adjustment = wager.numberOfLegs > 1 ? wager.americanOdds + 10 : wager.americanOdds;
    const quoteOffsets = [5, 0, -5, 2, -2, 0];
    return {
      id: wager.description.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      label: wager.description,
      fixture: true,
      quotes: fixtureQuotes.map(({ ageMinutes, ...quote }, index) => ({
        ...quote,
        americanOdds: adjustment + quoteOffsets[index],
        updatedAt: new Date(now - ageMinutes * 60_000).toISOString(),
      })),
    };
  }
}

export class ApiOddsProvider implements OddsProvider {
  readonly name = env.oddsProvider;

  async getMarket(): Promise<OddsMarket> {
    if (!env.oddsApiKeyConfigured) {
      throw new OddsProviderError("missing_api_key", "Odds provider API key is not configured.");
    }
    throw new OddsProviderError(
      "provider_outage",
      "The configured provider adapter is not implemented. Demo data remains available.",
    );
  }
}

export function createOddsProvider(): OddsProvider {
  return env.oddsProvider === "fixture" ? new FixtureOddsProvider() : new ApiOddsProvider();
}
