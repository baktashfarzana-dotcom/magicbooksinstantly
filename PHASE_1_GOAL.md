# Phase 1 Goal: Infrastructure, CI/CD & Auth

## Project
MagicBooksInstantly

## Mission
Phase 1 establishes the secure production foundation for MagicBooksInstantly: a Vercel-hosted Next.js app with Supabase Auth, tenant-owned child profiles, protected database tables, CI/CD, provider environment wiring, and offline-ready PWA support. By the end of Phase 1, parents should be able to sign up, sign in, create a child Living Profile, and safely access only their own family data while Codex verifies the full flow automatically in the browser.

## Technologies
- **Next.js 16.2 App Router**: routing, server components, server actions, middleware/proxy auth guards, and production builds.
- **React 19**: interactive profile, dashboard, and onboarding UI.
- **Tailwind CSS v4**: design tokens in `app/globals.css` via `@theme`; no `tailwind.config.js`.
- **Supabase Auth**: email/password login, signup, session handling, and Google OAuth configuration.
- **Supabase Postgres**: `Users`, `LivingProfiles`, `Stories`, `Templates`, and `Treasury` foundation tables.
- **Supabase Row Level Security**: parent-owned access policies using `(select auth.uid()) = user_id`.
- **Supabase Storage**: future generated book images/audio stored under owner-scoped paths.
- **Vercel**: project hosting, environment variables, preview deployments, and production CI/CD.
- **GitHub**: source control, pull requests, deployment-linked commits, and CI history.
- **Vercel AI SDK / OpenAI / DALL-E or Midjourney / ElevenLabs / Azure Speech**: Phase 1 environment wiring only, so later phases can activate generation, narration, and listening without changing deployment plumbing.
- **PWA Service Worker**: app shell, generated book, and audio caching for offline reading.
- **Codex Browser Automation**: Codex controls the local browser for signup, login, dashboard, profile, and route-protection verification.

## Phase 1 Checklist
- [ ] **Version Control**: GitHub repository initialized and linked to Vercel for CI/CD.
- [ ] **Environment Variables**: `.env.local` and Vercel project env configured for Supabase, OpenAI, ElevenLabs, Midjourney/DALL-E, Azure Speech, Stripe, and app URLs.
- [ ] **Database Setup**: Supabase migrations create `Users`, `LivingProfiles`, `Stories`, `Templates`, and `Treasury` tables with indexes and updated-at triggers.
- [ ] **Authentication**: Supabase Auth supports email/password and Google OAuth.
- [ ] **Security**: RLS is enabled and forced on public tenant tables; policies constrain every read/write to the authenticated parent owner.
- [ ] **PWA Offline Mode**: Next.js serves a manifest and service worker that cache the app shell plus approved generated books and audio for offline reading.
- [ ] **Browser QA**: Codex signs up/logs in automated users, creates a Living Profile, verifies redirects, and checks that parent/child routes expose only the correct controls.

## Expected Output
When Phase 1 is working, the app should produce these observable outputs:

1. **Repository and Deployments**
   - A GitHub repository exists for this project.
   - Vercel is linked to the GitHub repository.
   - Every push runs typecheck/build and creates a Vercel preview deployment.
   - Production deployment has the same required environment variables as local development.

2. **Local and Deployed App**
   - `npm run typecheck` passes.
   - `npm run build` passes.
   - `npm run dev` opens the app at `http://localhost:3000`.
   - `/`, `/login`, and `/signup` are public.
   - `/dashboard`, `/story-kitchen`, `/living-profile`, `/library`, `/voice-cloning`, `/pricing`, `/treasury`, `/tutor`, and `/child` require a valid session.

3. **Auth Flow**
   - A parent can create an account with email/password.
   - A parent can sign in with email/password.
   - Google OAuth is visible/configured once provider credentials are installed in Supabase.
   - After login, the parent lands in the command center/dashboard.
   - Logging out invalidates access to parent-only routes.

4. **Database and RLS**
   - Supabase contains owner-scoped rows for users, child profiles, stories, templates, and treasury data.
   - Anonymous users cannot read tenant tables.
   - Parent A can read/write only Parent A rows.
   - Parent A cannot read Parent B profiles, stories, templates, treasury rows, or storage objects.
   - Service-role keys never appear in client bundles or browser-accessible code.

5. **Living Profile**
   - An authenticated parent can create a child Living Profile.
   - The profile stores child name, age, and visual anchor data.
   - The profile is visible only to that parent.
   - Child-safe routes do not expose billing, account settings, provider keys, or AI configuration controls.

6. **PWA Offline Mode**
   - The app has a valid web manifest.
   - The service worker installs successfully.
   - The app shell loads during offline simulation.
   - Approved generated books and audio are cacheable for offline reading.
   - Cache invalidation updates stale books/audio when a newer approved version exists.

7. **Automated Testing**
   - Codex runs terminal verification: typecheck, build, migration/RLS probes, and auth/security scripts.
   - Codex controls the browser to verify public routes, protected-route redirects, login, profile creation, dashboard access, and offline behavior.
   - The final Phase 1 report states pass/fail for each checklist item and names any missing credentials or manual provider dashboard steps.

## Automated Browser Test Plan
Codex will perform these browser checks without asking the user to click manually:

1. Open `http://localhost:3000`.
2. Confirm the homepage renders and the main CTA is visible.
3. Open `/dashboard` while signed out and verify redirect to `/login`.
4. Sign in with the automated Supabase test parent.
5. Confirm `/dashboard` loads for the signed-in parent.
6. Open `/living-profile` and create or verify a child profile.
7. Open `/story-kitchen`, `/library`, `/treasury`, and `/child` and confirm they are session-protected.
8. Attempt anonymous Supabase reads through scripts and confirm RLS blocks tenant data.
9. Simulate offline mode after PWA setup and confirm cached shell/book assets still load.

## Current Project Snapshot
- The local folder is now a Git repository on `main` with the first commit `184b513 Initialize MagicBooksInstantly foundation`.
- No GitHub `origin` remote is configured yet because the GitHub connector currently reports no installed accounts/repositories and `gh` is not installed in the shell.
- Vercel team access is visible through the Vercel connector, but project linking/deployment still requires Vercel CLI authentication or dashboard setup.
- Existing migrations already cover `Users`, `LivingProfiles`, `Stories`, generated images, automated test users, and treasury/audio tables.
- A dedicated database-backed `Templates` table and PWA service worker/manifest still need to be added before Phase 1 can be marked fully complete.
