import type { OddsMarket, OddsProvider } from "../types/odds";
import { requireEntitlement, type SubscriptionPlan } from "./entitlementService";
import { createOddsProvider } from "./oddsProvider";
import { env } from "./env";
import type { WagerContext } from "../types/betting";

interface CacheEntry {
  market: OddsMarket;
  cachedAt: number;
}

export class OddsComparisonService {
  private readonly cache = new Map<string, CacheEntry>();
  private readonly provider: OddsProvider;
  private readonly cacheTtlMs: number;

  constructor(provider: OddsProvider = createOddsProvider(), cacheTtlMs = env.oddsCacheTtlMs) {
    this.provider = provider;
    this.cacheTtlMs = cacheTtlMs;
  }

  async getMarket(plan: SubscriptionPlan, wager: WagerContext, forceRefresh = false) {
    requireEntitlement(plan, "sportsbook_odds_comparison");
    const cacheKey = `${wager.description}:${wager.americanOdds}:${wager.numberOfLegs}`;
    const cached = this.cache.get(cacheKey);
    if (!forceRefresh && cached && Date.now() - cached.cachedAt < this.cacheTtlMs) {
      return { market: cached.market, fromCache: true };
    }
    const market = await this.provider.getMarket(wager);
    this.cache.set(cacheKey, { market, cachedAt: Date.now() });
    return { market, fromCache: false };
  }
}

export const oddsComparisonService = new OddsComparisonService();
