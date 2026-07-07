// src/features/betai/components/BuildParlayPanel.tsx
import { useState } from "react";
import BetAnalysisCard from "./BetAnalysisCard";
import AsyncResult from "../../../ui/AsyncResult";
import UserMessage from "../../../ui/UserMessage";
import { analysisService, type ParlayPreferences } from "../../../services/analysisService";
import type { BetSlipAnalysis, League } from "../../../types/betting";
import type { AsyncState } from "../../../types/shared";
import "./BuildParlayPanel.css";

const LOADING_PHRASES = [
  "Scanning the board...",
  "Pairing complementary legs...",
  "Balancing risk across the slip...",
  "Cross-checking trusted sources...",
];

const SPORT_OPTIONS: { value: League | "any"; label: string }[] = [
  { value: "any", label: "Any Sport" },
  { value: "NBA", label: "NBA" },
  { value: "NFL", label: "NFL" },
  { value: "WNBA", label: "WNBA" },
  { value: "MLB", label: "MLB" },
];

const LEG_COUNT_OPTIONS = [2, 3, 4, 5, 6];

const RISK_OPTIONS: { value: ParlayPreferences["riskLevel"]; label: string }[] = [
  { value: "safe", label: "Safe" },
  { value: "balanced", label: "Balanced" },
  { value: "high_risk", label: "High Risk" },
];

export default function BuildParlayPanel() {
  const [sport, setSport] = useState<League | "any">("any");
  const [legCount, setLegCount] = useState(3);
  const [riskLevel, setRiskLevel] = useState<ParlayPreferences["riskLevel"]>("balanced");
  const [submittedSummary, setSubmittedSummary] = useState<string | null>(null);
  const [state, setState] = useState<AsyncState<BetSlipAnalysis>>({ status: "idle" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const sportLabel = SPORT_OPTIONS.find((o) => o.value === sport)?.label ?? "Any Sport";
    const riskLabel = RISK_OPTIONS.find((o) => o.value === riskLevel)?.label ?? "Balanced";
    setSubmittedSummary(`Build a ${legCount}-leg ${sportLabel} parlay · ${riskLabel} risk`);
    setState({ status: "loading" });

    try {
      const result = await analysisService.buildParlay({
        legCount,
        riskLevel,
        sport: sport === "any" ? undefined : sport,
      });
      setState({ status: "success", data: result });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setState({ status: "error", message });
    }
  };

  return (
    <div className="build-parlay-panel">
      <form className="build-parlay-form" onSubmit={handleSubmit}>
        <div className="build-parlay-fields">
          <div className="build-parlay-field">
            <label htmlFor="parlay-sport">Sport</label>
            <select
              id="parlay-sport"
              value={sport}
              onChange={(e) => setSport(e.target.value as League | "any")}
            >
              {SPORT_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div className="build-parlay-field">
            <label htmlFor="parlay-legs">Number of Legs</label>
            <select
              id="parlay-legs"
              value={legCount}
              onChange={(e) => setLegCount(Number(e.target.value))}
            >
              {LEG_COUNT_OPTIONS.map((count) => (
                <option key={count} value={count}>
                  {count} legs
                </option>
              ))}
            </select>
          </div>

          <div className="build-parlay-field">
            <label htmlFor="parlay-risk">Risk Level</label>
            <select
              id="parlay-risk"
              value={riskLevel}
              onChange={(e) => setRiskLevel(e.target.value as ParlayPreferences["riskLevel"])}
            >
              {RISK_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="build-parlay-submit" disabled={state.status === "loading"}>
          Build My Parlay
        </button>
      </form>

      {submittedSummary && state.status !== "idle" && <UserMessage>{submittedSummary}</UserMessage>}

      <AsyncResult
        state={state}
        loadingPhrases={LOADING_PHRASES}
        idleContent={
          <>
            Choose a sport, leg count, and risk level, and BetAI will assemble a
            parlay from the same research engine that powers Analyze My Bet and
            Find a Bet.
          </>
        }
        renderSuccess={(data) => <BetAnalysisCard analysis={data} />}
      />
    </div>
  );
}
