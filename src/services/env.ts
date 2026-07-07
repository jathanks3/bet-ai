// src/services/env.ts
//
// Single place that reads import.meta.env. Nothing else in the app should
// touch `import.meta.env` directly - when real APIs are connected, the new
// variables (API base URL, keys, etc.) get added here and nowhere else.
const rawMockDelay = Number(import.meta.env.VITE_MOCK_DELAY_MS);

export const env = {
  appName: import.meta.env.VITE_APP_NAME || "BetAI",
  /** Base artificial latency (ms) the mock analysis service waits before responding. */
  mockDelayMs: Number.isFinite(rawMockDelay) && rawMockDelay >= 0 ? rawMockDelay : 700,
};
