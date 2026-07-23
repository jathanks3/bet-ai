import { describe, expect, it } from "vitest";
import { analysisService } from "./analysisService";

describe("analysis wager context", () => {
  it("populates a single bet with parsed stake and odds", async () => {
    const analysis = await analysisService.analyzeBetSlipText(
      "Anthony Edwards Over 28.5 Points\nStake: $25\nOdds: -115",
    );
    expect(analysis.legs).toHaveLength(1);
    expect(analysis.wager).toMatchObject({
      description: "Anthony Edwards Over 28.5 Points",
      stake: 25,
      americanOdds: -115,
      betType: "player_prop",
      numberOfLegs: 1,
    });
    expect(analysis.wager.decimalOdds).toBeCloseTo(1.869565);
  });

  it("populates parlay context with combined odds and leg summary", async () => {
    const analysis = await analysisService.analyzeBetSlipText(
      "Lakers -4.5\nChiefs Moneyline\nStake: $40\nCombined Odds: +450",
    );
    expect(analysis.wager).toMatchObject({
      description: "2-Leg Parlay",
      stake: 40,
      americanOdds: 450,
      betType: "parlay",
      numberOfLegs: 2,
      legSummary: ["Lakers -4.5", "Chiefs Moneyline"],
    });
  });
});
