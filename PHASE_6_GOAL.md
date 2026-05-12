# Phase 6 Goal: Gamification & Analytics

## Project
MagicBooksInstantly

## Mission
Phase 6 builds the retention loop: every finished story should become a learning moment, every reading or quiz completion should earn Star Dust, and parents should see progress in a way that connects literacy effort to meaningful real-world rewards. The child gets a playful Treasury with badges, streaks, and progress bars; the parent gets a Command Center that turns reading behavior into clear coaching and reward decisions.

Codex will verify this phase by controlling the browser, completing quiz and reading flows, checking Supabase reward persistence, and confirming that child and parent views update correctly.

## Technologies
- **Next.js 16.2 App Router**: protected quiz, treasury, command center, and reward API routes.
- **React 19**: adaptive quiz state, answer feedback, Treasury map interactions, badge displays, and reward redemption UI.
- **Tailwind CSS v4**: child-friendly Treasury visuals, progress bars, badge grids, and parent analytics dashboards.
- **Lucide React**: reward, badge, streak, quiz, and progress iconography.
- **Vercel AI SDK / OpenAI Structured Outputs**: story JSON includes `knowledge_loop_quiz`; future quiz generation can adapt based on prior answers.
- **Supabase Postgres**: `Stories.story_json`, `TreasuryBalances`, `StarDustLedger`, `ReadingAttempts`, `WordAssessments`, and future badge/reward redemption tables.
- **Supabase RLS**: parent and child reward data remains owner-scoped.
- **Supabase Realtime**: Star Dust and streak updates sync between reader, quiz, Treasury, and Command Center.
- **Codex Browser Automation**: automated quiz completion, reward verification, Treasury checks, and dashboard analytics validation.
- **Deterministic Mock Paths**: local tests can award points and render quiz states without paid AI provider calls.

## Phase 6 Checklist
- [ ] **The Knowledge Loop**: Post-story adaptive quiz UI is dynamically built from the OpenAI `knowledge_loop_quiz` JSON output.
- [ ] **Economy Engine**: Star Dust calculator updates Supabase Treasury data after quiz or reading completion.
- [ ] **The Treasury**: Child gamified view shows collected badges, reading streaks, Star Dust totals, progress bars, and map progression.
- [ ] **Command Center Analytics**: Parent dashboard maps reading streaks, quiz outcomes, and Star Dust to real-world reward redemptions.
- [ ] **Reward Redemptions**: Parent can define or approve reward milestones tied to Star Dust or streaks.
- [ ] **Automated QA**: Codex completes quiz/reading flows, verifies Star Dust ledger rows, and confirms Treasury/Command Center update.

## Expected Output
When Phase 6 is working, the app should produce these observable outputs:

1. **Knowledge Loop Quiz**
   - After a story is ready, quiz questions come from that story’s `story_json.knowledge_loop_quiz`.
   - `/quiz` can load the latest ready story or a specific story id.
   - Quiz UI shows question count, answer options, selected answer state, and correct/incorrect feedback.
   - Quiz difficulty or follow-up copy adapts based on answer confidence.
   - Quiz completion produces a summary for parent and child.

2. **Quiz Reward Logic**
   - Correct answers award Star Dust.
   - Completion bonus can be awarded after finishing all questions.
   - Rewards are written to `StarDustLedger`.
   - `TreasuryBalances.star_dust_total` updates after quiz completion.
   - Duplicate submissions are guarded so the same quiz cannot farm unlimited rewards.

3. **Reading Reward Logic**
   - Reading completion continues to award Star Dust through tutor assessment.
   - `ReadingAttempts`, `WordAssessments`, `StarDustLedger`, and `TreasuryBalances` stay linked.
   - Reading streak increments when completion criteria are met.
   - Parent dashboard reflects the streak value from Supabase, not placeholder numbers.

4. **Child Treasury**
   - `/treasury` shows current Star Dust total from Supabase.
   - Treasury map shows progress toward next reward.
   - Badge grid shows earned and locked badges.
   - Streak and progress bars are visible and responsive.
   - Child-safe view does not expose billing, account, provider, or parent-only controls.

5. **Parent Command Center**
   - `/dashboard` shows live story count, profile count, reading streak, quiz completion, Star Dust balance, and approval queue.
   - Parent sees suggested real-world rewards tied to streaks or Star Dust milestones.
   - Parent can approve, redeem, or reset a reward milestone.
   - Analytics distinguish reading effort, comprehension, and consistency.

6. **Realtime / Sync**
   - Completing a reading or quiz updates Treasury without stale values after refresh.
   - Supabase Realtime can update dashboard widgets when reward rows change.
   - UI gracefully handles offline or slow network states.

7. **Automated Testing**
   - Codex signs in as automated parent.
   - Codex bakes or locates a ready story with `knowledge_loop_quiz`.
   - Codex opens `/quiz`, answers questions, and completes the quiz.
   - Codex verifies Star Dust changed in Supabase.
   - Codex opens `/treasury` and confirms the new total/streak render.
   - Codex opens `/dashboard` and confirms parent analytics reflect the updated reward state.
   - Logs identify pass/fail for quiz generation, reward persistence, RLS, and UI rendering.

## Automated Browser Test Plan
Codex will control the local browser and perform these checks:

1. Open `http://localhost:3000`.
2. Sign in as the automated parent.
3. Ensure a ready story exists with `knowledge_loop_quiz`.
4. Open `/quiz`.
5. Confirm quiz questions are loaded from story JSON, not static placeholder content.
6. Answer each quiz question.
7. Confirm feedback and completion summary appear.
8. Confirm Star Dust reward appears in the UI.
9. Open `/treasury`.
10. Confirm Star Dust total, streak, badges, and progress bars render.
11. Open `/dashboard`.
12. Confirm parent analytics show the updated streak/reward signal.
13. Run Supabase RLS probes to ensure another parent cannot read quiz/reward data.

## Current Project Snapshot
- The local folder is **not currently a git repository**, so change review cannot use `git status` yet.
- Already implemented:
  - `knowledge_loop_quiz` exists in generated story JSON schema.
  - Static `/quiz` UI exists.
  - Reading completion awards Star Dust through `/api/tutor/assess`.
  - `TreasuryBalances` and `StarDustLedger` tables exist with RLS.
  - `/treasury` reads Star Dust and reading streak from Supabase.
  - Parent Command Center has story/profile counts and visual analytics panels.
  - Audio sync test verifies reading reward persistence.
- Still incomplete for this Phase 6 checklist:
  - `/quiz` is not yet dynamically loaded from a story’s `knowledge_loop_quiz`.
  - Quiz answers do not yet award Star Dust.
  - Badge earning and reward redemption tables/UI are not yet implemented.
  - Parent dashboard still uses placeholder reading streak and approval queue values.
  - Supabase Realtime reward sync is not yet wired into Treasury or Command Center.
