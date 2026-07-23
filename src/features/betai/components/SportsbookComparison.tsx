import { useCallback, useEffect, useMemo, useState } from "react";
import { env } from "../../../services/env";
import { EntitlementError, hasEntitlement } from "../../../services/entitlementService";
import { OddsProviderError } from "../../../services/oddsProvider";
import { oddsComparisonService } from "../../../services/oddsComparisonService";
import { americanToDecimal, formatAmericanOdds, profitForStake } from "../../../services/oddsMath";
import type { OddsMarket } from "../../../types/odds";
import "./SportsbookComparison.css";

const DEMO_MARKET_ID = "anthony-edwards-over-28-5-points";
const COMPARISON_STAKE = 100;

function getErrorMessage(error: unknown) {
  if (error instanceof EntitlementError) return error.message;
  if (error instanceof OddsProviderError) {
    if (error.code === "rate_limited") return "Refresh limit reached. Try again shortly.";
    if (error.code === "missing_api_key") return "No provider API key is configured. Switch to fixture mode for Demo Data.";
    return "The odds provider is temporarily unavailable. Try again shortly.";
  }
  return "Odds could not be loaded. Try again.";
}

export default function SportsbookComparison() {
  const plan = env.demoPlan;
  const entitled = hasEntitlement(plan, "sportsbook_odds_comparison");
  const [market, setMarket] = useState<OddsMarket | null>(null);
  const [loading, setLoading] = useState(entitled);
  const [error, setError] = useState("");
  const [fromCache, setFromCache] = useState(false);

  const load = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    setError("");
    try {
      const result = await oddsComparisonService.getMarket(plan, DEMO_MARKET_ID, forceRefresh);
      setMarket(result.market);
      setFromCache(result.fromCache);
    } catch (caught) {
      setError(getErrorMessage(caught));
    } finally {
      setLoading(false);
    }
  }, [plan]);

  useEffect(() => {
    let active = true;
    oddsComparisonService.getMarket(plan, DEMO_MARKET_ID)
      .then((result) => {
        if (!active) return;
        setMarket(result.market);
        setFromCache(result.fromCache);
      })
      .catch((caught: unknown) => {
        if (active) setError(getErrorMessage(caught));
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [plan]);

  const bestOdds = useMemo(
    () => market?.quotes.filter((quote) => quote.status !== "unavailable").reduce(
      (best, quote) => (quote.americanOdds > best.americanOdds ? quote : best),
    ),
    [market],
  );
  const lowestProfit = useMemo(
    () => market ? Math.min(...market.quotes.map((quote) => profitForStake(COMPARISON_STAKE, quote.americanOdds))) : 0,
    [market],
  );

  return (
    <section className="odds-comparison feature-surface" aria-labelledby="odds-title">
      <div className="feature-heading">
        <div>
          <div className="eyebrow-row"><span>Platinum</span>{market?.fixture && <strong>Demo Data</strong>}</div>
          <h2 id="odds-title">Sportsbook Odds Comparison</h2>
          <p>Compare the same wager across supported books before placing it.</p>
        </div>
        {entitled && (
          <button className="refresh-button" type="button" onClick={() => void load(true)} disabled={loading}>
            {loading ? "Refreshing…" : "Refresh odds"}
          </button>
        )}
      </div>

      {!entitled && (
        <div className="locked-state" role="status">
          <span aria-hidden="true">◇</span>
          <h3>Platinum feature</h3>
          <p>Upgrade to Platinum to compare prices across sportsbooks.</p>
        </div>
      )}

      {error && <div className="odds-alert" role="alert">{error}</div>}
      {loading && !market && <div className="odds-loading" role="status">Loading sportsbook prices…</div>}

      {market && (
        <>
          <div className="market-summary">
            <div><small>Wager</small><h3>{market.label}</h3></div>
            <div className="market-meta">
              <span>{fromCache ? "Cached response" : "Fresh response"}</span>
              <span>Payout comparison uses a ${COMPARISON_STAKE} stake</span>
            </div>
          </div>
          <div className="odds-table-wrap">
            <table className="odds-table">
              <thead><tr><th>Sportsbook</th><th>American</th><th>Decimal</th><th>Profit</th><th>Updated</th></tr></thead>
              <tbody>
                {market.quotes.map((quote) => {
                  const profit = profitForStake(COMPARISON_STAKE, quote.americanOdds);
                  const isBest = quote.sportsbookId === bestOdds?.sportsbookId;
                  return (
                    <tr key={quote.sportsbookId} className={isBest ? "best-odds" : undefined}>
                      <td data-label="Sportsbook">
                        <strong>{quote.sportsbookName}</strong>
                        {isBest && <span className="best-badge">Best available</span>}
                        {quote.status === "stale" && <span className="stale-badge">Stale</span>}
                      </td>
                      <td data-label="American">{formatAmericanOdds(quote.americanOdds)}</td>
                      <td data-label="Decimal">{americanToDecimal(quote.americanOdds).toFixed(2)}</td>
                      <td data-label="Profit">
                        ${profit.toFixed(2)}
                        <small>+${(profit - lowestProfit).toFixed(2)} vs. lowest</small>
                      </td>
                      <td data-label="Updated">
                        <time dateTime={quote.updatedAt}>{new Date(quote.updatedAt).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}</time>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="stale-note">Stale prices are labeled after 15 minutes and should be verified before use.</p>
        </>
      )}
      <p className="responsible-betting">Odds change. Results are not guaranteed. Taxes not included. Sports betting involves risk.</p>
    </section>
  );
}
