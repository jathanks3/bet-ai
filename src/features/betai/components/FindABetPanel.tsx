// src/features/betai/components/FindABetPanel.tsx
import { useState } from "react";
import BetAnalysisCard from "./BetAnalysisCard";
import ChatInput from "../../../components/ChatInput";
import AsyncResult from "../../../ui/AsyncResult";
import UserMessage from "../../../ui/UserMessage";
import { analysisService } from "../../../services/analysisService";
import type { BetSlipAnalysis } from "../../../types/betting";
import type { AsyncState } from "../../../types/shared";
import "./FindABetPanel.css";

const LOADING_PHRASES = [
  "Scanning tonight's matchups...",
  "Checking injury reports...",
  "Comparing recent form...",
  "Weighing line movement...",
  "Cross-checking trusted sources...",
];

const EXAMPLE_QUESTIONS = [
  "Best bet for Lakers tonight",
  "Chiefs vs Falcons",
  "WNBA best bet tonight",
  "Yankees game tonight",
];

export default function FindABetPanel() {
  const [question, setQuestion] = useState<string | null>(null);
  const [state, setState] = useState<AsyncState<BetSlipAnalysis>>({ status: "idle" });

  const runQuestion = async (submittedQuestion: string) => {
    setQuestion(submittedQuestion);
    setState({ status: "loading" });

    try {
      const result = await analysisService.getRecommendation(submittedQuestion);
      setState({ status: "success", data: result });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setState({ status: "error", message });
    }
  };

  return (
    <div className="find-a-bet-panel">
      <ChatInput onSubmit={runQuestion} />

      {question && state.status !== "idle" && <UserMessage>{question}</UserMessage>}

      <AsyncResult
        state={state}
        loadingPhrases={LOADING_PHRASES}
        idleContent={
          <>
            Ask about any NBA, WNBA, NFL, or MLB matchup to get a research-backed
            recommendation.
            <div className="find-a-bet-empty-state-examples">
              {EXAMPLE_QUESTIONS.map((example) => (
                <button
                  key={example}
                  className="find-a-bet-example-chip"
                  onClick={() => runQuestion(example)}
                >
                  {example}
                </button>
              ))}
            </div>
          </>
        }
        renderSuccess={(data) => <BetAnalysisCard analysis={data} />}
      />
    </div>
  );
}
