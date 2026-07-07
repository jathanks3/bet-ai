// src/ui/AsyncResult.tsx
import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import type { AsyncState } from "../types/shared";
import ThinkingIndicator from "./ThinkingIndicator";
import "./AsyncResult.css";

interface AsyncResultProps<T> {
  state: AsyncState<T>;
  loadingPhrases: string[];
  idleContent: ReactNode;
  renderSuccess: (data: T) => ReactNode;
}

export default function AsyncResult<T extends { id: string }>({
  state,
  loadingPhrases,
  idleContent,
  renderSuccess,
}: AsyncResultProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (state.status === "loading" || state.status === "success") {
      containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [state.status]);

  return (
    <div className="async-result" ref={containerRef}>
      {state.status === "loading" && <ThinkingIndicator phrases={loadingPhrases} />}

      {state.status === "error" && (
        <div className="async-result-error" role="alert">
          {state.message}
        </div>
      )}

      {state.status === "success" && (
        <div className="async-result-success" key={state.data.id}>
          {renderSuccess(state.data)}
        </div>
      )}

      {state.status === "idle" && <div className="async-result-idle">{idleContent}</div>}
    </div>
  );
}
