# Deployment Checklist

BetAI is a static, client-only React app (Vite build output). It has no backend, no database, and no server-side secrets, so it deploys like any static site.

## 1. Pre-deploy

- [ ] `npm run lint` passes with zero errors
- [ ] `npm run build` (runs `tsc -b && vite build`) completes with zero TypeScript errors
- [ ] `npm run preview` and click through all three tabs at least once
- [ ] Confirm no `console.error`/`console.warn` noise in the browser console during normal use
- [ ] Confirm `.env.local` (if used) is **not** committed — check `git status` before pushing
- [ ] Double-check no real API keys were added to any `VITE_`-prefixed variable (they ship to the browser bundle)

## 2. Git / GitHub

- [ ] Repo initialized (`git init`) if not already, with the existing `.gitignore` (already excludes `node_modules`, `dist`, `*.local`, editor files)
- [ ] Initial commit made, remote added, pushed to GitHub
- [ ] Repo description and topics set (e.g. "AI sports betting analyst — 3Stone AI portfolio product")
- [ ] `README.md` renders correctly on GitHub (badges/links optional, not required)

## 3. Hosting — Vercel

This project needs **Node 20.19+** (Vite 8 and ESLint 10 both require it — Node 18 will fail the build). `package.json` pins this via `"engines": { "node": ">=20.19.0" }`.

**Deploying via the Vercel dashboard (recommended):**

1. Push this repo to GitHub (see section 2).
2. In Vercel: **Add New... → Project → Import Git Repository**, select this repo.
3. Vercel auto-detects the **Vite** framework preset. Confirm these are set (should be filled in automatically):
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Under **Project Settings → General → Node.js Version**, select **20.x** or **22.x** (not 18.x).
5. Under **Project Settings → Environment Variables**, optionally add `VITE_APP_NAME` and/or `VITE_MOCK_DELAY_MS` — both have safe defaults if left unset, so this step can be skipped entirely.
6. Click **Deploy**.

No `vercel.json` is needed: this is a single-page app with no client-side routing (no React Router, no deep-linkable routes), so there are no rewrite rules to configure.

- [ ] Vercel project created and linked to the GitHub repo
- [ ] Node.js version set to 20.x or 22.x in project settings
- [ ] First deploy succeeds and the production URL loads
- [ ] Every push to `main` auto-deploys; every PR gets its own preview URL (default Vercel behavior, nothing to configure)

**Alternative hosts:** Netlify, Cloudflare Pages, and GitHub Pages also work for a static Vite build (same build command/output directory), but Vercel is the primary target for this checklist.

## 4. Post-deploy smoke test

- [ ] Load the production URL on desktop — verify the header, tabs, and default Analyze My Bet panel render
- [ ] Run one query through each of the three workflows and confirm a result renders
- [ ] Load the production URL on a phone (or responsive dev tools) and repeat the same check
- [ ] Confirm the browser tab title and favicon are correct
- [ ] Confirm HTTPS is enabled (default on Vercel/Netlify/Cloudflare Pages)

## 5. Sharing with a client / prospect

- [ ] Decide whether the demo link should stay unlisted or be added to the 3Stone AI website/portfolio
- [ ] If sharing broadly, consider adding a lightweight banner or note that data shown is illustrative/mocked (optional — the responsible-gambling disclaimer already sets expectations)

## What's intentionally NOT part of this deployment

Per current scope, none of the following exist yet and should not block shipping RC1:

- Authentication / user accounts
- Payments / Stripe
- A database
- Real sports-data or AI API connections

These are future phases, not blockers for a portfolio/demo deployment.
