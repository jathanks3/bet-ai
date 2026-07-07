// src/App.tsx
import { useState } from "react";
import Tabs from "./ui/Tabs";
import AnalyzeBetPanel from "./features/betai/components/AnalyzeBetPanel";
import FindABetPanel from "./features/betai/components/FindABetPanel";
import BuildParlayPanel from "./features/betai/components/BuildParlayPanel";
import { env } from "./services/env";
import "./App.css";

type WorkflowId = "analyze" | "find" | "parlay";

const WORKFLOW_TABS: { id: WorkflowId; label: string }[] = [
  { id: "analyze", label: "Analyze My Bet" },
  { id: "find", label: "Find a Bet" },
  { id: "parlay", label: "Build My Parlay" },
];

function App() {
  const [activeTab, setActiveTab] = useState<WorkflowId>("analyze");

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-logo-row">
          <span className="app-logo-dot" aria-hidden="true" />
          <h1 className="app-title">{env.appName}</h1>
        </div>
        <p className="app-subtitle">Research-backed betting insights, not guesses.</p>
      </header>

      <Tabs
        tabs={WORKFLOW_TABS}
        activeId={activeTab}
        onChange={(id) => setActiveTab(id as WorkflowId)}
      />

      <div className="app-panel">
        {activeTab === "analyze" && <AnalyzeBetPanel />}
        {activeTab === "find" && <FindABetPanel />}
        {activeTab === "parlay" && <BuildParlayPanel />}
      </div>
    </div>
  );
}

export default App;
