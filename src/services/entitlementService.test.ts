import { describe, expect, it } from "vitest";
import { EntitlementError, hasEntitlement, requireEntitlement } from "./entitlementService";

describe("centralized entitlements", () => {
  it("allows Platinum and denies free accounts", () => {
    expect(hasEntitlement("platinum", "sportsbook_odds_comparison")).toBe(true);
    expect(hasEntitlement("free", "sportsbook_odds_comparison")).toBe(false);
    expect(() => requireEntitlement("free", "sportsbook_odds_comparison")).toThrow(EntitlementError);
  });
});
