import { useState } from "react";
import type { BetSlipAnalysis } from "../../../types/betting";
import { env } from "../../../services/env";
import { hasEntitlement } from "../../../services/entitlementService";
import { requestPremiumUpgrade } from "../../../services/premiumUpgradeService";
import SportsbookComparison from "./SportsbookComparison";
import BettingProfitCalculator from "./BettingProfitCalculator";
import "./PremiumActions.css";

type ActiveTool = "odds" | "calculator" | null;

const ACTIONS = {
  odds: {
    name: "Compare Sportsbook Odds",
    description: "Find the best available odds for this wager.",
    entitlement: "sportsbook_odds_comparison" as const,
  },
  calculator: {
    name: "Project Profit",
    description: "Estimate profitability using this wager.",
    entitlement: "betting_profit_projection" as const,
  },
};

export default function PremiumActions({ analysis }: { analysis: BetSlipAnalysis }) {
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);

  const activate = (tool: Exclude<ActiveTool, null>) => {
    const action = ACTIONS[tool];
    if (!hasEntitlement(env.demoPlan, action.entitlement)) {
      requestPremiumUpgrade({ featureName: action.name, description: action.description });
      return;
    }
    setActiveTool((current) => current === tool ? null : tool);
  };

  return (
    <section className="premium-actions rec-section" aria-labelledby="premium-actions-title">
      <h3 className="rec-section-label" id="premium-actions-title">
        <span className="rec-section-dot dot-signal" />
        PREMIUM ACTIONS
      </h3>
      <div className="premium-action-list">
        {(Object.keys(ACTIONS) as Array<Exclude<ActiveTool, null>>).map((tool) => {
          const action = ACTIONS[tool];
          const entitled = hasEntitlement(env.demoPlan, action.entitlement);
          return (
            <button
              type="button"
              className="premium-action"
              key={tool}
              onClick={() => activate(tool)}
              aria-expanded={activeTool === tool}
            >
              <span className="premium-action-icon" aria-hidden="true">{entitled ? "◇" : "🔒"}</span>
              <span>
                <strong>{action.name}{!entitled && <em>Premium</em>}</strong>
                <small>{action.description}</small>
              </span>
              <span className="premium-action-arrow" aria-hidden="true">{activeTool === tool ? "−" : "→"}</span>
            </button>
          );
        })}
      </div>
      {activeTool === "odds" && <SportsbookComparison wager={analysis.wager} />}
      {activeTool === "calculator" && <BettingProfitCalculator wager={analysis.wager} />}
    </section>
  );
}
