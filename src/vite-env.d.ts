/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Display name shown in the app header. Defaults to "BetAI". */
  readonly VITE_APP_NAME?: string;
  /** Base artificial delay (ms) the mock analysis service waits before responding. */
  readonly VITE_MOCK_DELAY_MS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
