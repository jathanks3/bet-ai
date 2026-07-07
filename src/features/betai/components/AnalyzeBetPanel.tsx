// src/features/betai/components/AnalyzeBetPanel.tsx
import { useState } from "react";
import type { KeyboardEvent } from "react";
import BetAnalysisCard from "./BetAnalysisCard";
import AsyncResult from "../../../ui/AsyncResult";
import UserMessage from "../../../ui/UserMessage";
import { analysisService } from "../../../services/analysisService";
import type { BetSlipAnalysis } from "../../../types/betting";
import type { AsyncState } from "../../../types/shared";
import "./AnalyzeBetPanel.css";

const LOADING_PHRASES = [
  "Reading your bet slip...",
  "Checking injury reports...",
  "Comparing recent form...",
  "Weighing line movement...",
  "Cross-checking trusted sources...",
];

const EXAMPLE_SLIPS = ["Lakers -4.5", "Chiefs Moneyline\nCowboys -3.5", "Yankees Moneyline"];

export default function AnalyzeBetPanel() {
  const [slipText, setSlipText] = useState("");
  const [submittedSlip, setSubmittedSlip] = useState<string | null>(null);
  const [state, setState] = useState<AsyncState<BetSlipAnalysis>>({ status: "idle" });

  const submit = async (text: string) => {
    if (text.trim().length === 0) return;
    setSubmittedSlip(text.trim());
    setState({ status: "loading" });

    try {
      const result = await analysisService.analyzeBetSlipText(text.trim());
      setState({ status: "success", data: result });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setState({ status: "error", message });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submit(slipText);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      submit(slipText);
    }
  };

  return (
    <div className="analyze-bet-panel">
      <form className="analyze-bet-form" onSubmit={handleSubmit}>
        <label htmlFor="analyze-bet-textarea" className="sr-only">
          Paste your bet slip
        </label>
        <textarea
          id="analyze-bet-textarea"
          className="analyze-bet-textarea"
          value={slipText}
          onChange={(e) => setSlipText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={"Paste or type your bet slip here, one leg per line...\ne.g. Lakers -4.5\nChiefs Moneyline"}
          rows={5}
        />

        <div className="analyze-bet-upload" aria-disabled="true">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="9" cy="9" r="2" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span>Upload a screenshot of your bet slip</span>
          <span className="analyze-bet-upload-badge">Coming soon</span>
        </div>

        <div className="analyze-bet-form-footer">
          <div className="analyze-bet-examples">
            {EXAMPLE_SLIPS.map((example) => (
              <button
                key={example}
                type="button"
                className="analyze-bet-example-chip"
                onClick={() => setSlipText(example)}
              >
                {example.split("\n")[0]}
                {example.includes("\n") ? " +1" : ""}
              </button>
            ))}
          </div>
          <button
            type="submit"
            className="analyze-bet-submit"
            disabled={slipText.trim().length === 0 || state.status === "loading"}
          >
            Analyze Bet
            <span className="analyze-bet-submit-hint">⌘⏎</span>
          </button>
        </div>
      </form>

      {submittedSlip && state.status !== "idle" && <UserMessage>{submittedSlip}</UserMessage>}

      <AsyncResult
        state={state}
        loadingPhrases={LOADING_PHRASES}
        idleContent={
          <>
            Paste your bet slip above to get an overall rating, verdict, and a
            leg-by-leg breakdown of what's helping and hurting your bet.
          </>
        }
        renderSuccess={(data) => <BetAnalysisCard analysis={data} />}
      />
    </div>
  );
}
