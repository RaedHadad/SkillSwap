# SkillSwap Project Roadmap

This document captures the upcoming delivery plan for the SkillSwap MVP, including milestones, issue backlog, deployment approach, and handoff details for the implementation team.

## Phase 2 — Plan the Build

### Product Milestones

#### M1: Foundations
- Implement authentication (registration, login, JWT handling).
- Build profile CRUD covering teach/learn skills, availability, and preferences.
- Deliver matching API that scores matches (skills 50%, availability 20%, communication 15%, rating 10%).
- Create core web pages: login, profile, dashboard, and match search.

#### M2: Sessions & Points
- Implement session lifecycle (propose, confirm, cancel, complete) with validations.
- Launch points engine with logs for teaching, learning, streaks, and late cancellations.
- Provide session list UI plus toast/email notifications.

#### M3: RTC & Feedback
- Integrate real-time communication (Agora or Firebase WebRTC) with token endpoint and room UI supporting audio, video, screen sharing, and chat.
- Add rate-and-feedback flow; ratings influence matching bonus.
- Ship anti-abuse controls enforcing minimum duration and preventing rapid repeats.

### Acceptance Criteria (High-Level)
- Complete user journey from sign-up through rating and points updates works end-to-end.
- Matching returns at least three consistent candidates for identical inputs.
- Session completion updates points atomically with matching logs.
- RTC room supports two browsers exchanging audio/video/screen share with chat latency under 250 ms.
- Pages load under two seconds locally, no console errors, and CI passes.

## Phase 3 — Issue Backlog

Create GitHub issues for the Codex team with the following titles and scopes:

- **API-001**: User model with JWT auth (`/auth/register`, `/auth/login`, `/me`).
- **API-010**: Profile CRUD with indexes covering skills, availability, and preferences.
- **API-020**: Matching service implementing the 50/20/15/10 weighting via `POST /match/search`.
- **WEB-030**: Dashboard and profile UI.
- **API-030**: Session lifecycle (propose/confirm/cancel/complete) plus validation.
- **API-040**: Points engine and logs (teach/learn, streaks, late cancel).
- **WEB-040**: Search and match list UI with ranked cards and "Propose" CTA.
- **RTC-050**: Agora token endpoint `/sessions/:id/rtc-token` and client hook.
- **WEB-050**: Session room (join/leave, mute, screen share, chat).
- **WEB-060**: Rate and feedback page; ratings affect matching.

Additionally, pin the team "Definition of Done" outlining the need for test steps in PRs, passing CI, secret handling, and documentation updates.

## Phase 4 — Deployment Strategy

- **Web (Next.js)**: Deploy on Vercel for zero-config hosting and PR previews.
- **API (Express)**: Use Render, Fly.io, or Railway with MongoDB Atlas.
- **Secrets**: Configure platform environment variables (`MONGO_URL`, `JWT_SECRET`, `AGORA_APP_ID`, `AGORA_APP_CERT`).
- **CORS**: Include the production web origin (e.g., `https://skillswap.vercel.app`) in API configuration.

**Deployment Steps**
1. Push repository to GitHub (completed).
2. Import `apps/web` into Vercel and deploy.
3. Provision API service (e.g., Render) for `apps/api` and set environment variables.
4. Update API `CLIENT_ORIGINS` to include the Vercel URL.

## Phase 5 — Handoff Message for Codex

Provide Codex with the following instructions:

- **Scope**: Build the SkillSwap MVP web experience.
- **Tech Stack**: Next.js (web), Express + MongoDB (API), JWT, Agora/WebRTC.
- **Repository**: `github.com/RaedHadad/SkillSwap` with necessary access granted.
- **Development Setup**: Run `pnpm i && cp .env.example .env && pnpm dev` to start Web on port 3000 and API on port 4000.
- **Initial Focus**: Begin with Milestone M1 issues (`API-001`, `API-010`, `API-020`, `WEB-030`, `WEB-040`).
- **Process**: Use feature branches, submit PRs with passing CI, undergo review, and merge.
- **Deliverables**: Each PR must include demo steps plus screenshots or recordings.
- **Definition of Done**: Feature happy path works, no console errors, tests where appropriate, and updated documentation.

## Phase 6 — Optional PWA Enhancement

To add a mobile-app-like experience before building a native app:

1. Install PWA support: `pnpm -C apps/web add next-pwa`.
2. Update `apps/web/next.config.mjs`:
   ```javascript
   import withPWA from 'next-pwa';
   export default withPWA({
     dest: 'public',
     register: true,
     skipWaiting: true,
   });
   ```
3. Add `public/manifest.json` and required icons.
4. Encourage users to "Add to Home Screen" on mobile devices.
