# SkillSwap Build Plan

## Phase 2 — Build Plan

### Product Milestones

1. **M1: Foundations**
   - Implement authentication (registration, login, JWT).
   - Deliver profile CRUD covering teaching/learning skills, availability, and preferences.
   - Create the matching API using weights: skill 50, availability 20, communication 15, rating 10.
   - Build web pages: login, profile, dashboard, and match search.

2. **M2: Sessions & Points**
   - Support session lifecycle: propose, confirm, cancel, complete.
   - Build the points engine and logs (earn when teaching, spend when learning, streaks, late cancellations).
   - Deliver sessions list UI and notifications (toast + email stub).

3. **M3: RTC & Feedback**
   - Integrate RTC (Agora or Firebase WebRTC) with token endpoint and room UI (audio, video, screen share, chat).
   - Implement rating and feedback; use ratings to feed matching bonus.
   - Add anti-abuse: minimum duration, block rapid repeats.

### Acceptance Criteria

- Full user journey: sign up → set skills → view matches → schedule → live session → complete → rate → points.
- Matching returns at least three stable, sensible candidates for identical inputs.
- Points update atomically with logs on session completion.
- RTC room supports two browsers with audio/video/screen share and <250ms chat latency.
- Pages load in under 2 seconds locally; no console errors; CI passes.

## Phase 3 — Issue Backlog

Create the following issues (manually or via GitHub CLI). Each ticket is scoped for Codex to deliver:

- **API-001**: User model and JWT auth (`/auth/register`, `/auth/login`, `/me`).
- **API-010**: Profile CRUD with indexes (skills, availability, preferences).
- **API-020**: Matching service (50/20/15/10 weighting) → `POST /match/search`.
- **WEB-030**: Dashboard and profile UI.
- **API-030**: Sessions (propose/confirm/cancel/complete) plus validation.
- **API-040**: Points engine and logs (teach/learn, streaks, late cancel).
- **WEB-040**: Search & match list UI (ranked cards with "Propose" CTA).
- **RTC-050**: Agora token endpoint `/sessions/:id/rtc-token` plus client hook.
- **WEB-050**: Session room (join/leave, mute, screen share, chat).
- **WEB-060**: Rate & feedback page with rating impacting matching bonus.

Pin a "Definition of Done" note in the project:
- PR includes reviewer test steps.
- CI green.
- No secrets committed.
- Documentation updated when needed.

## Phase 4 — Deployment Plan

- **Web (Next.js)**: Deploy via Vercel (zero-config, PR previews enabled).
- **API (Express)**: Deploy via Render, Fly.io, or Railway and connect to MongoDB Atlas.
- **Secrets**: Configure on hosting platforms (`MONGO_URL`, `JWT_SECRET`, `AGORA_APP_ID`, `AGORA_APP_CERT`).
- **CORS**: Include production web origin (e.g., `https://skillswap.vercel.app`).

Deployment steps:
1. Push repository to GitHub (completed).
2. Vercel → "Import project" → select `apps/web`.
3. Render/Fly → create new service from `apps/api` and add environment variables.
4. Update `CLIENT_ORIGINS` in API environment to include the Vercel URL.

## Phase 5 — Handoff Message to Codex

Provide Codex with the following summary:

> **Scope**: Build SkillSwap MVP (web).  
> **Tech**: Next.js (web), Express + MongoDB (API), JWT, Agora/WebRTC.  
> **Repo**: github.com/RaedHadad/SkillSwap (access granted).  
> **Run dev**: `pnpm i && cp .env.example .env && pnpm dev` → Web :3000, API :4000.  
> **Starting point**: Milestone M1 issues (API-001/010/020, WEB-030/040).  
> **Process**: Feature branches → PRs → CI must pass → review → merge.  
> **Deliverables**: Each PR includes demo steps & screenshots/recording.  
> **Definition of Done**: Full happy path works for the feature; no console errors; tests where reasonable; docs updated.

## Phase 6 — Optional PWA Enhancement

To provide a mobile-app-like experience ahead of React Native:

1. Install support: `pnpm -C apps/web add next-pwa`.
2. Update `apps/web/next.config.mjs`:
   ```javascript
   import withPWA from 'next-pwa';
   export default withPWA({
     dest: 'public',
     register: true,
     skipWaiting: true,
   });
   ```
3. Add `public/manifest.json` plus icons, then test "Add to Home Screen" on a mobile device.

