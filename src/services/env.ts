// src/services/env.ts
//
// Single place that reads import.meta.env. Nothing else in the app should
// touch `import.meta.env` directly - when real APIs are connected, the new
// variables (API base URL, keys, etc.) get added here and nowhere else.
const rawMockDelay = Number(import.meta.env.VITE_MOCK_DELAY_MS);
const rawOddsCacheTtl = Number(import.meta.env.VITE_ODDS_CACHE_TTL_MS);

export const env = {
  appName: import.meta.env.VITE_APP_NAME || "BetAI",
  /** Base artificial latency (ms) the mock analysis service waits before responding. */
  mockDelayMs: Number.isFinite(rawMockDelay) && rawMockDelay >= 0 ? rawMockDelay : 700,
  oddsProvider: import.meta.env.VITE_ODDS_PROVIDER || "fixture",
  oddsApiBaseUrl: import.meta.env.VITE_ODDS_API_BASE_URL || "",
  oddsApiKeyConfigured: Boolean(import.meta.env.VITE_ODDS_API_KEY),
  oddsCacheTtlMs:
    Number.isFinite(rawOddsCacheTtl) && rawOddsCacheTtl > 0 ? rawOddsCacheTtl : 60_000,
  demoPlan: (import.meta.env.VITE_DEMO_PLAN === "free" ? "free" : "platinum") as
    | "free"
    | "platinum",
};
