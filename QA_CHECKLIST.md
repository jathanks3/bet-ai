# Final QA Checklist — BetAI RC1

Run through this before any client demo or public deploy. Everything here is manual (no test suite exists yet, by design — this is a small, mock-data UI where manual QA covers the surface area faster than writing/maintaining automated tests would).

## Functional — Analyze My Bet

- [ ] Typing in the textarea enables the "Analyze Bet" button; empty textarea keeps it disabled
- [ ] Submitting via the button and via ⌘/Ctrl+Enter both work
- [ ] Clicking an example chip fills the textarea
- [ ] A "thinking" indicator with rotating status text appears while loading
- [ ] Your submitted slip appears as a message bubble
- [ ] Result renders with rating, confidence, verdict, edge/risk callouts, and one finding block per leg
- [ ] Pasting multiple lines produces multiple legs; an unrecognized line still produces a neutral leg instead of crashing
- [ ] Re-submitting the same text produces varied finding wording/numbers (confirms mock variety is working)

## Functional — Find a Bet

- [ ] Typing a team name and submitting returns a single-leg analysis
- [ ] Example question chips work
- [ ] An unrecognized query shows a clear, friendly error message (not a crash)

## Functional — Build My Parlay

- [ ] Changing Sport/Legs/Risk selects updates state (no console errors)
- [ ] Submitting builds a parlay with the selected number of legs
- [ ] Result renders with one "LEG N BREAKDOWN" section per leg

## Cross-cutting

- [ ] Switching tabs preserves nothing unexpected — each tab's in-progress state is independent
- [ ] Reloading the page always returns to Analyze My Bet (the default tab)
- [ ] Forcing a component error (e.g. temporarily throw in a render) shows the branded error boundary, not a blank white screen
- [ ] No unhandled promise rejections or errors in the browser console during normal use

## Visual / responsive

- [ ] Desktop (≥1280px): content column is centered and doesn't feel cramped or oversized
- [ ] Tablet (~768px): tabs, forms, and cards reflow without overlap
- [ ] Mobile (~375px): tab labels, buttons, and the parlay field grid stack cleanly; nothing overflows horizontally
- [ ] Dark theme renders consistently — no unstyled flashes of white
- [ ] Verdict accent color on the report card top edge matches the verdict badge (green/blue/amber/red)
- [ ] Impact colors are consistent: green = positive, red = negative, blue = neutral, everywhere they appear

## Accessibility

- [ ] Tab through the whole page with keyboard only — every interactive element (tabs, inputs, buttons, selects) shows a visible focus ring
- [ ] Screen reader (VoiceOver/NVDA) announces the loading state and any error message
- [ ] Heading structure is sensible (one `h1`, `h2` for the result title, `h3` for section labels) — check with the browser's accessibility tree inspector
- [ ] Color contrast looks reasonable for secondary/tertiary text on dark backgrounds

## Performance

- [ ] Initial load feels fast on a throttled "Fast 3G" profile in DevTools
- [ ] No layout shift when fonts finish loading
- [ ] No memory growth from repeated tab switching / submissions (quick DevTools Performance/Memory sanity check)

## Code quality

- [ ] `npm run lint` — zero errors
- [ ] `npx tsc --noEmit -p tsconfig.app.json` — zero errors
- [ ] `npm run build` succeeds
- [ ] No stray/unused files in `src/` or `public/`
