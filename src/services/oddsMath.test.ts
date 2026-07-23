import { describe, expect, it } from "vitest";
import { americanToDecimal, breakEvenPercent, profitForStake } from "./oddsMath";

describe("odds math", () => {
  it("converts and pays positive American odds", () => {
    expect(americanToDecimal(150)).toBe(2.5);
    expect(profitForStake(100, 150)).toBe(150);
    expect(breakEvenPercent(150)).toBeCloseTo(40);
  });

  it("converts and pays negative American odds", () => {
    expect(americanToDecimal(-110)).toBeCloseTo(1.90909);
    expect(profitForStake(110, -110)).toBeCloseTo(100);
    expect(breakEvenPercent(-110)).toBeCloseTo(52.38095);
  });

  it("rejects zero odds", () => {
    expect(() => americanToDecimal(0)).toThrow(/non-zero/);
  });
});
