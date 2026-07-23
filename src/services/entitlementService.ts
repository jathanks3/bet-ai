export type SubscriptionPlan = "free" | "platinum";
export type Entitlement = "sportsbook_odds_comparison";

export class EntitlementError extends Error {
  readonly entitlement: Entitlement;

  constructor(entitlement: Entitlement) {
    super("Sportsbook Odds Comparison requires a Platinum subscription.");
    this.entitlement = entitlement;
    this.name = "EntitlementError";
  }
}

const PLAN_ENTITLEMENTS: Record<SubscriptionPlan, ReadonlySet<Entitlement>> = {
  free: new Set(),
  platinum: new Set(["sportsbook_odds_comparison"]),
};

export function hasEntitlement(plan: SubscriptionPlan, entitlement: Entitlement) {
  return PLAN_ENTITLEMENTS[plan].has(entitlement);
}

export function requireEntitlement(plan: SubscriptionPlan, entitlement: Entitlement) {
  if (!hasEntitlement(plan, entitlement)) throw new EntitlementError(entitlement);
}
