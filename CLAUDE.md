# CLAUDE.md — 3Stone AI / BetAI Operating Guide

This file is the operating guide for how Claude works on this project. Read it before making changes.

## 1. Company Context

3Stone AI is a software company that solves business problems through software. We do not sell AI, websites, or code. We sell outcomes: saved time, fewer mistakes, better customer experience, increased revenue, and smoother operations. Every technical decision should be traceable back to one of those outcomes.

## 2. Founder Context

The founder is not trying to become a full-time programmer. The founder's role is CEO / product manager / operator. Technical choices must be explained in plain English, in terms of tradeoffs and business impact, not jargon. The goal is to help the founder make informed decisions — never assume advanced coding knowledge, and never bury a decision inside a code change without surfacing it first.

## 3. Product Context

BetAI is the first portfolio product under 3Stone AI. BetAI is an AI sports betting analyst, not just a chatbot.

BetAI supports three workflows:
- **Analyze My Bet** (most important workflow)
- Find a Bet
- Build My Parlay

## 4. BetAI Product Vision

Users should be able to:
- type a bet
- paste a bet slip
- upload a screenshot of a bet slip later
- analyze single bets
- analyze parlays
- analyze player props
- analyze spreads, moneylines, totals, same-game parlays, and alternate lines

Every analysis should produce:
- overall rating
- verdict: Bet / Lean / Pass / Avoid
- confidence score
- strongest leg
- weakest leg
- biggest risk
- biggest edge
- suggested improvements
- suggested replacements
- findings with impact colors
- source trust level
- responsible gambling disclaimer

## 5. Architecture Rules

- Use modular architecture.
- Use reusable UI components.
- Use service layers.
- Do not connect real APIs yet.
- Use mock data for now.
- Architect mock services so they can later be replaced with real AI and sports data APIs without rewriting the UI.

## 6. Current Architecture Direction

Use one unified model:
- `Finding`
- `BetLeg`
- `BetSlipAnalysis`

Do not build three separate systems for Analyze My Bet, Find a Bet, and Build My Parlay. They should all produce a `BetSlipAnalysis`.

## 7. Folder Rules

- Generic reusable UI belongs in: `src/ui`
- BetAI-specific components belong in: `src/features/betai/components`
- Shared types belong in: `src/types`
- Swappable data/business logic belongs in: `src/services`

## 8. Design Rules

BetAI should feel premium, modern, and trustworthy. Design inspiration: ChatGPT, Perplexity, Apple, Stripe, Linear, Bloomberg-style decision clarity.

Use:
- premium dark theme
- strong spacing
- clean typography
- responsive mobile design
- polished cards
- animated signal meters
- clear visual hierarchy
- color-coded impact findings

Impact colors:
- green = helps the user's bet
- red = hurts the user's bet
- blue = neutral/informational
- gray = general info

## 9. Engineering Rules

- Before major changes, explain the decision in plain English.
- Make one logical change at a time.
- Keep the app working after every step.
- Fix TypeScript errors before moving on.
- Avoid overengineering.
- Do not add unnecessary frameworks.
- Prefer simple, maintainable code.
- Do not move files around unless there is a clear reason.
- Do not delete files unless you explain why.

## 10. Business Rules

- Every reusable component should make future 3Stone AI products faster to build.
- Every project should become an asset.
- Do not build features just because they are technically interesting.
- Prioritize features that make the product more useful, more sellable, or easier to scale.

## 11. Current Priority

Finish BetAI as a polished portfolio product before connecting paid APIs. The product should look and feel real using mock data first. After the frontend is strong, then build backend, AI integration, data APIs, accounts, payments, and deployment.

## 12. Working Style

When asked to build:
1. First summarize the plan.
2. Then say exactly which files will be created, edited, or deleted.
3. Then make the changes.
4. Then run checks if possible.
5. Then summarize what changed and what to verify in the browser.
