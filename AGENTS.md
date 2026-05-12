# MagicBooksInstantly Agent Guide

## Mission
Phase 3 is the Interactive Tutor & Growth Economy foundation: authenticated families can bake child-safe stories, listen with parent-approved narration, simulate Azure-style word tracking, and persist Star Dust rewards without cross-tenant leakage.

## Rules
- Prefer Next.js App Router server components for data loading.
- Keep Supabase clients lazy and request-scoped; never expose service-role keys to the browser.
- Every public Supabase table must have RLS enabled before any client-facing route reads or writes it.
- Tenant ownership is user-bound: policies must constrain data with `(select auth.uid()) = user_id`.
- Tailwind v4 design tokens live in `app/globals.css` via `@theme`; do not add a `tailwind.config.js`.
- Parent routes live under `/app/(dashboard)`. Child-safe routes live outside the parent command center and must not expose billing, account, or AI configuration controls.
- The story engine must preserve a `master_anchor_prompt` on every `Stories` row and reuse that anchor in every `Images.prompt`.
- Story length is dynamic: `quick` is 6 minutes/15 pages, `standard` is 10 minutes/22 pages, and `weekend` is 13 minutes/30 pages. Every generated story must include exactly 3 `power_words`, page-level `companion_reaction` strings, and a `knowledge_loop_quiz`.
- `story-images` storage paths must begin with the authenticated user id so storage RLS can isolate objects by owner folder.
- The Stealth Tutor must persist `ReadingAttempts`, `WordAssessments`, `StarDustLedger`, and `TreasuryBalances` under the authenticated `user_id`.
- Voice cloning starts with the Bedtime Training Script in `lib/tutor/assessment.ts`; never create a `VoiceProfiles` row unless consent is confirmed.
- Provider integrations must be credential-safe. If `AZURE_SPEECH_KEY`, `ELEVENLABS_API_KEY`, or `STRIPE_SECRET_KEY` are missing, use the deterministic mock/test paths and state that clearly in logs.

## Automated Supabase Users
Migration `supabase/migrations/0003_automated_phase_2_test_users.sql` provisions two confirmed email/password parents and one LivingProfile for each:

- `phase2.parent.one@magicbooksinstantly.test`
- `phase2.parent.two@magicbooksinstantly.test`
- Default password: `MagicBooksPhase2!2026`

The E2E script also supports overrides:

- `PHASE_2_TEST_USER_ONE`
- `PHASE_2_TEST_USER_TWO`
- `PHASE_2_TEST_PASSWORD`

Do not use these accounts for real family data. They exist only for automated tenant/RLS checks.

## Required Verification
Run these before calling Phase 2 secure:

```bash
npm run typecheck
npm run build
npm run test:phase2
npm run test:phase3:audio
```

If `npm` is unavailable in the Codex desktop shell, use the bundled Node runtime:

```bash
PATH=/Users/mariamfarzana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node_modules/.bin/tsc --noEmit
PATH=/Users/mariamfarzana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node_modules/.bin/next build
PATH=/Users/mariamfarzana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node scripts/verify-rls.mjs
PATH=/Users/mariamfarzana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node scripts/phase-2-stability.mjs
PATH=/Users/mariamfarzana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node scripts/phase-2-e2e.mjs
PATH=/Users/mariamfarzana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node scripts/phase-3-audio-sync.mjs
```

To remove generated automated-test stories and storage objects after a run:

```bash
npm run test:phase2:cleanup
```

or with the bundled runtime:

```bash
PATH=/Users/mariamfarzana/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH node scripts/phase-2-cleanup.mjs
```

## What The Tests Cover
- `verify-rls.mjs`: anonymous REST access cannot read `Users`, `LivingProfiles`, `Stories`, or `Images`.
- `phase-2-stability.mjs`: checks the migration, bake API, dynamic story contract, character anchor reuse, and flipbook wiring, then writes `PHASE_2_STABILITY.log`.
- `phase-2-e2e.mjs`: signs in as both automated parents, bakes quick/standard/weekend stories, uploads dynamic generated story image assets, verifies every prompt includes the master anchor, proves parent-one cannot read parent-two story rows, and proves parent-one cannot download parent-two storage objects. It writes `PHASE_2_E2E.log` and appends the result to `PHASE_2_STABILITY.log`.
- `phase-2-cleanup.mjs`: signs in as the automated parents and deletes their generated story rows plus matching `story-images` objects through normal authenticated RLS.
- `phase-3-audio-sync.mjs`: signs in as an automated parent, creates a consented mock ElevenLabs voice profile, simulates a child reading a page through Azure-style assessment, persists word-level green highlights, awards Star Dust, verifies `TreasuryBalances`, verifies ledger persistence, and writes `PHASE_3_AUDIO_SYNC.log`.

## Phase 3 Provider Env
Real providers are optional for local verification. Configure these when moving beyond deterministic mock/test mode:

- `AZURE_SPEECH_KEY`
- `AZURE_SPEECH_REGION`
- `ELEVENLABS_API_KEY`
- `STRIPE_SECRET_KEY`

Without those keys, the app intentionally uses `mock-azure`, `mock-elevenlabs-*`, and `mock-stripe-test` paths so CI and Codex can run safely.

## Browser QA
After migrations and scripts pass, run the app and perform a visual check:

```bash
npm run dev
```

Sign in as `phase2.parent.one@magicbooksinstantly.test`, open `/dashboard`, bake a story from the Story Kitchen, then open `/tutor`. Press read aloud and verify words highlight green, Star Dust is awarded, `/treasury` shows the updated balance, and child-safe routes expose no billing/account/AI controls.

## Tooling Protocol
- Use Codex Browser first for local app verification, visual QA, route checks, form tests, and screenshot-based review.
- Use Computer Use when Codex Browser is blocked by credentials, native browser permission prompts, OAuth, 2FA, or provider dashboards.
- Use the Supabase plugin for schema, migrations, SQL, auth, RLS, storage, and tenant-isolation checks.
- Use the GitHub plugin for repository, branch, PR, and CI verification once this folder is a git repository.
- Use the Vercel plugin for deployment, environment variables, preview URLs, production URLs, and deployment logs once the project is linked.
- If provider credentials are missing, use the deterministic mock paths and state that clearly in the verification output.

## Product Goal Reference
See `MAGICBOOKSINSTANTLY_PRODUCT_AND_QA_GOAL.md` for the full parent experience, child experience, centralized Tailwind design-system expectations, and automated QA contract.
