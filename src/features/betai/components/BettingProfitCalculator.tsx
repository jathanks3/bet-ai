import { useMemo, useState } from "react";
import { calculateProjection, type ProjectionPeriod, type ProjectionScenario } from "../../../services/bettingCalculator";
import "./BettingProfitCalculator.css";

const ODDS_PRESETS = [-110, -150, -200, -300, 100, 150];
const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const numberValue = (value: string) => Number(value.replace("+", ""));

export default function BettingProfitCalculator() {
  const [wager, setWager] = useState("100");
  const [odds, setOdds] = useState("-110");
  const [winPercent, setWinPercent] = useState("55");
  const [bets, setBets] = useState("10");
  const [period, setPeriod] = useState<ProjectionPeriod>("weekly");
  const [bankroll, setBankroll] = useState("1000");
  const [compound, setCompound] = useState(false);
  const [scenario, setScenario] = useState<ProjectionScenario>("expected");

  const { result, error } = useMemo(() => {
    try {
      return {
        result: calculateProjection({
          wagerAmount: numberValue(wager),
          americanOdds: numberValue(odds),
          expectedWinPercent: numberValue(winPercent),
          numberOfBets: numberValue(bets),
          period,
          startingBankroll: bankroll === "" ? undefined : numberValue(bankroll),
          compound,
          scenario,
        }),
        error: "",
      };
    } catch (caught) {
      return { result: null, error: caught instanceof Error ? caught.message : "Check the input values." };
    }
  }, [bankroll, bets, compound, odds, period, scenario, wager, winPercent]);

  return (
    <section className="profit-calculator feature-surface" aria-labelledby="calculator-title">
      <div className="feature-heading">
        <div><div className="eyebrow-row"><span>Projection tool</span></div><h2 id="calculator-title">Betting Profit Calculator</h2><p>Estimate potential outcomes using your own assumptions.</p></div>
      </div>
      <div className="calculator-layout">
        <form className="calculator-form" onSubmit={(event) => event.preventDefault()}>
          <label>Wager Amount<input aria-label="Wager Amount" type="number" min="0.01" step="0.01" value={wager} onChange={(e) => setWager(e.target.value)} /></label>
          <label>American Odds<input aria-label="American Odds" type="text" inputMode="numeric" value={odds} onChange={(e) => setOdds(e.target.value)} /></label>
          <div className="preset-row" aria-label="Odds presets">
            {ODDS_PRESETS.map((preset) => <button type="button" key={preset} onClick={() => setOdds(String(preset))}>{preset > 0 ? `+${preset}` : preset}</button>)}
          </div>
          <label>Expected Win %<input aria-label="Expected Win %" type="number" min="0" max="100" step="0.1" value={winPercent} onChange={(e) => setWinPercent(e.target.value)} /></label>
          <label>Number of Bets<input aria-label="Number of Bets" type="number" min="1" step="1" value={bets} onChange={(e) => setBets(e.target.value)} /></label>
          <label>Projection Period<select aria-label="Projection Period" value={period} onChange={(e) => setPeriod(e.target.value as ProjectionPeriod)}><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option></select></label>
          <label>Starting Bankroll <small>Optional</small><input aria-label="Starting Bankroll" type="number" min="0" step="0.01" value={bankroll} onChange={(e) => setBankroll(e.target.value)} /></label>
          <label className="compound-toggle"><input type="checkbox" checked={compound} onChange={(e) => setCompound(e.target.checked)} /> Compound projected returns</label>
        </form>

        <div className="calculator-results">
          <div className="scenario-tabs" role="group" aria-label="Projection scenario">
            <button className={scenario === "expected" ? "active" : ""} onClick={() => setScenario("expected")}>Expected Value</button>
            <button className={scenario === "all_wins" ? "active" : ""} onClick={() => setScenario("all_wins")}>Every Bet Wins</button>
            <button className={scenario === "break_even" ? "active" : ""} onClick={() => setScenario("break_even")}>Break Even</button>
          </div>
          {scenario === "all_wins" && <p className="hypothetical-note">Hypothetical only — winning every bet is not a realistic expectation.</p>}
          {error && <div className="calculator-error" role="alert">{error}</div>}
          {result && (
            <>
              <div className="result-grid">
                <Result label="Profit Per Win" value={money.format(result.profitPerWin)} />
                <Result label="Loss Per Loss" value={money.format(result.lossPerLoss)} />
                <Result label="Break Even" value={`${result.breakEvenPercent.toFixed(2)}%`} />
                <Result label="Expected Wins" value={result.expectedWins.toFixed(2)} />
                <Result label="Expected Losses" value={result.expectedLosses.toFixed(2)} />
                <Result label="Total Wagered" value={money.format(result.totalWagered)} />
                <Result label="Expected Profit" value={money.format(result.expectedProfit)} prominent />
                <Result label="Expected ROI" value={`${result.expectedRoiPercent.toFixed(2)}%`} prominent />
                {result.endingBankroll !== undefined && <Result label="Ending Bankroll" value={money.format(result.endingBankroll)} prominent />}
              </div>
              <div className="time-projections">
                <Result label="Weekly" value={money.format(result.weeklyProfit)} />
                <Result label="Monthly" value={money.format(result.monthlyProfit)} />
                <Result label="Yearly" value={money.format(result.yearlyProfit)} />
              </div>
            </>
          )}
        </div>
      </div>
      <p className="responsible-betting">Odds change. Results are not guaranteed. Taxes not included. Sports betting involves risk.</p>
    </section>
  );
}

function Result({ label, value, prominent = false }: { label: string; value: string; prominent?: boolean }) {
  return <div className={prominent ? "result-item prominent" : "result-item"}><small>{label}</small><strong>{value}</strong></div>;
}
