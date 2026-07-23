import { describe, expect, it, vi } from "vitest";
import type { OddsProvider } from "../types/odds";
import { EntitlementError } from "./entitlementService";
import { OddsComparisonService } from "./oddsComparisonService";

const market = {
  id: "market",
  label: "Test market",
  fixture: true,
  quotes: [],
};
const wager = {
  description: "Anthony Edwards Over 28.5 Points",
  stake: 25,
  americanOdds: -115,
  decimalOdds: 1.869565,
  betType: "player_prop" as const,
  numberOfLegs: 1,
  legSummary: ["Anthony Edwards Over 28.5 Points"],
};

describe("odds comparison service", () => {
  it("enforces entitlement before calling the provider", async () => {
    const getMarket = vi.fn(async () => market);
    const service = new OddsComparisonService({ name: "test", getMarket } satisfies OddsProvider);
    await expect(service.getMarket("free", wager)).rejects.toBeInstanceOf(EntitlementError);
    expect(getMarket).not.toHaveBeenCalled();
  });

  it("caches results and supports manual refresh", async () => {
    const getMarket = vi.fn(async () => market);
    const service = new OddsComparisonService({ name: "test", getMarket } satisfies OddsProvider, 60_000);
    expect((await service.getMarket("platinum", wager)).fromCache).toBe(false);
    expect((await service.getMarket("platinum", wager)).fromCache).toBe(true);
    expect((await service.getMarket("platinum", wager, true)).fromCache).toBe(false);
    expect(getMarket).toHaveBeenCalledTimes(2);
  });
});
