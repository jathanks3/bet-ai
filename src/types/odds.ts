export type SportsbookId =
  | "fanduel"
  | "draftkings"
  | "betmgm"
  | "caesars"
  | "espn_bet"
  | "fanatics";

export type OddsStatus = "live" | "stale" | "unavailable";

export interface SportsbookQuote {
  sportsbookId: SportsbookId;
  sportsbookName: string;
  americanOdds: number;
  updatedAt: string;
  status: OddsStatus;
}

export interface OddsMarket {
  id: string;
  label: string;
  fixture: boolean;
  quotes: SportsbookQuote[];
}

export type OddsProviderErrorCode =
  | "missing_api_key"
  | "provider_outage"
  | "rate_limited";

export interface OddsProvider {
  readonly name: string;
  getMarket(marketId: string): Promise<OddsMarket>;
}
