export const PREMIUM_UPGRADE_EVENT = "betai:premium-upgrade";

export interface PremiumUpgradeRequest {
  featureName: string;
  description: string;
}

export function requestPremiumUpgrade(detail: PremiumUpgradeRequest) {
  window.dispatchEvent(new CustomEvent(PREMIUM_UPGRADE_EVENT, { detail }));
}
