import { describe, expect, it } from "vitest";
import { calculateProjection } from "./bettingCalculator";

describe("betting projection", () => {
  it("calculates expected value for negative odds", () => {
    const result = calculateProjection({
      wagerAmount: 110,
      americanOdds: -110,
      expectedWinPercent: 55,
      numberOfBets: 10,
      period: "weekly",
      startingBankroll: 1_000,
    });
    expect(result.expectedWins).toBe(5.5);
    expect(result.expectedLosses).toBe(4.5);
    expect(result.expectedProfit).toBeCloseTo(55);
    expect(result.endingBankroll).toBeCloseTo(1_055);
    expect(result.expectedRoiPercent).toBeCloseTo(5);
  });

  it("calculates expected value for positive odds", () => {
    const result = calculateProjection({
      wagerAmount: 100,
      americanOdds: 150,
      expectedWinPercent: 45,
      numberOfBets: 20,
      period: "monthly",
    });
    expect(result.profitPerWin).toBe(150);
    expect(result.expectedProfit).toBe(250);
    expect(result.yearlyProfit).toBe(3_000);
  });

  it("makes the break-even scenario net to zero", () => {
    const result = calculateProjection({
      wagerAmount: 100,
      americanOdds: -150,
      expectedWinPercent: 20,
      numberOfBets: 100,
      period: "yearly",
      scenario: "break_even",
    });
    expect(result.expectedProfit).toBeCloseTo(0, 8);
  });

  it("labels all-win math through its distinct scenario", () => {
    const result = calculateProjection({
      wagerAmount: 100,
      americanOdds: 100,
      expectedWinPercent: 0,
      numberOfBets: 10,
      period: "weekly",
      scenario: "all_wins",
    });
    expect(result.expectedWins).toBe(10);
    expect(result.expectedLosses).toBe(0);
    expect(result.expectedProfit).toBe(1_000);
  });
});
