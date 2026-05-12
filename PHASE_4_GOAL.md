# Phase 4 Goal: The Stealth Tutor & Story Companion

## Project
MagicBooksInstantly

## Mission
Phase 4 turns the reader from a passive flipbook into an interactive literacy coach. Children should be able to choose between hearing the story read aloud or reading it themselves, see words light up as they are spoken correctly, receive gentle help when stuck, and hear an encouraging Story Companion respond to key moments in the book. Parents should control whether Active Encouragement is enabled from the Parent Command Center.

Codex will verify this phase by controlling the local browser, simulating child reading flows, testing microphone permission states where possible, checking persisted reading/reward rows in Supabase, and running terminal QA scripts.

## Technologies
- **Next.js 16.2 App Router**: tutor routes, reader pages, server-side assessment endpoints, and protected parent/child experiences.
- **React 19**: live reader state, microphone permission UI, word highlighting, companion toggles, and reading-mode controls.
- **Tailwind CSS v4**: responsive reader UI, green/yellow/red word states, glass panels, and child-safe visual feedback.
- **Lucide React**: microphone, speaker, tutor, and reward iconography.
- **ElevenLabs API**: parent voice narration, Read To Me text-to-speech, companion praise playback, and optional struggle hints.
- **Microsoft Azure Speech Pronunciation Assessment**: real-time speech recognition and pronunciation scoring over WebSocket.
- **Web Audio / MediaDevices APIs**: browser microphone permission, audio capture, playback state, and accessibility-friendly controls.
- **Supabase Postgres**: `VoiceProfiles`, `ReadingAttempts`, `WordAssessments`, `StarDustLedger`, and `TreasuryBalances`.
- **Supabase Realtime**: reward/progress syncing between reader, treasury, and parent dashboard.
- **Vercel AI SDK / Story JSON**: consumes `companion_reaction` generated during story baking.
- **Codex Browser Automation**: browser-controlled QA for reader states, permissions, highlighting, rewards, and companion behavior.
- **Deterministic Mock Providers**: mock Azure and mock ElevenLabs paths when real provider keys are not present.

## Phase 4 Checklist
- [ ] **Read To Me Mode**: ElevenLabs TTS audio synced with timestamp word highlighting in a karaoke-style reader.
- [ ] **I Can Read! Mode**: Native microphone permission handling in the Next.js reader component.
- [ ] **Listening AI**: Microsoft Azure Pronunciation Assessment connected via WebSocket to listen to the child read in real time.
- [ ] **Validation Logic**: Word-matching algorithm turns words green as the child successfully pronounces them.
- [ ] **Struggle Assist**: `setTimeout`-based gentle audio hint plays if the child is stuck on a word for more than 4 seconds.
- [ ] **Companion Mode Toggle**: Parent Command Center toggle enables/disables Active Encouragement.
- [ ] **Active Co-Pilot Logic**: Reader checks `companion_reaction`; after successful page reading, ElevenLabs praises the child before unlocking next-page navigation.
- [ ] **Reward Persistence**: Successful reading completion awards Star Dust and persists attempts, words, ledger, and treasury totals.
- [ ] **Automated QA**: Codex simulates reading, verifies word colors, checks reward rows, and confirms companion behavior.

## Expected Output
When Phase 4 is working, the app should produce these observable outputs:

1. **Reader Modes**
   - Child can choose `Read To Me`.
   - Child can choose `I Can Read!`.
   - Mode changes are obvious and accessible.
   - Parent-approved voice profiles are used when available.

2. **Read To Me Mode**
   - ElevenLabs TTS generates or streams narration for the current page.
   - Audio playback starts only after a user action.
   - Words highlight in sync with narration timestamps.
   - Playback can pause, resume, and stop.
   - If ElevenLabs credentials are missing, the app uses a mock narration path and states that clearly in test logs.

3. **I Can Read! Mode**
   - Reader asks for microphone permission.
   - Permission states are handled:
     - not requested
     - requesting
     - granted
     - denied
     - unavailable
   - If permission is denied, the child gets a safe retry message and parent can still choose Read To Me.

4. **Listening AI**
   - Azure Speech WebSocket opens after microphone permission is granted.
   - Target page text is sent to Pronunciation Assessment.
   - Partial recognition updates the active word.
   - Final recognition returns word-level assessment.
   - Mock Azure path remains available for automated tests and missing credentials.

5. **Word Validation**
   - Correct words turn green.
   - Close words turn yellow.
   - Missed words turn red or remain available for retry.
   - Current listening word is visually distinct.
   - Completion score and accuracy score are calculated.

6. **Struggle Assist**
   - If the current word remains unresolved for more than 4 seconds, a gentle hint is queued.
   - Hint can use ElevenLabs parent voice when available.
   - Hint does not shame or interrupt harshly.
   - Timer resets when the child progresses to the next word.

7. **Companion Mode**
   - Parent Command Center includes an Active Encouragement toggle.
   - Toggle preference is persisted per parent/profile or story setting.
   - Reader respects the toggle.
   - When a page has `companion_reaction`, successful page completion triggers praise before next-page unlock.
   - Companion audio uses ElevenLabs when available, with a mock path for tests.

8. **Progress and Rewards**
   - Completed page creates a `ReadingAttempts` row.
   - Word-level results create `WordAssessments` rows.
   - Star Dust reward creates a `StarDustLedger` row.
   - `TreasuryBalances` updates immediately.
   - Supabase RLS keeps all rows owner-scoped.

9. **Automated Testing**
   - Terminal QA verifies mock Azure assessment, reward persistence, voice profile persistence, and Stripe/mock checkout safety.
   - Browser QA opens `/tutor`, runs reading simulation, verifies green highlights, confirms Star Dust is awarded, and checks `/treasury`.
   - Final report is written to `PHASE_4_STEALTH_TUTOR.log` or the current phase audio log.

## Automated Browser Test Plan
Codex will control the local browser and perform these checks:

1. Open `http://localhost:3000`.
2. Sign in as the automated parent.
3. Open `/voice-cloning` and verify the voice capture UI.
4. Confirm mock or real ElevenLabs voice profile can be created only with consent.
5. Open `/tutor`.
6. Verify `I Can Read!` or current read-aloud simulation UI is visible.
7. Trigger the reading flow.
8. Confirm active word highlighting starts.
9. Confirm completed words turn green after assessment.
10. Confirm Star Dust is awarded after successful completion.
11. Open `/treasury` and verify the updated balance.
12. Open a generated story in `/child`.
13. Toggle Companion Mode.
14. Navigate to a page with `companion_reaction`.
15. Verify companion praise is shown or played after successful page completion once Active Co-Pilot logic is implemented.

## Current Project Snapshot
- The local folder is **not currently a git repository**, so change review cannot use `git status` yet.
- Already implemented:
  - Mock Azure-style assessment logic.
  - `/api/tutor/assess` route.
  - `/api/voice/narrate` route with mock ElevenLabs timestamp output.
  - `ReadingAttempts`, `WordAssessments`, `StarDustLedger`, and `TreasuryBalances` persistence.
  - Mock ElevenLabs voice profile route.
  - `/tutor` reader with Read To Me and I Can Read modes.
  - Native microphone permission states in the tutor reader.
  - Struggle Assist 4-second hint timer using the narration route in mock mode.
  - Parent Command Center Companion Mode toggle persisted on `LivingProfiles`.
  - Flipbook page-read completion calls tutor assessment before unlocking the next page.
  - Active Co-Pilot text appears after successful page completion when `companion_reaction` exists.
  - `/tutor` reader simulation with active word tracking and green/yellow/red result states.
  - Flipbook Companion UI toggle that displays `companion_reaction` text.
  - Phase audio sync script that verifies mock reading rewards.
- Still incomplete for this Phase 4 checklist:
  - Real Azure Speech WebSocket integration.
  - Real ElevenLabs Read To Me audio with timestamp word sync.
  - Full audio playback for Active Co-Pilot praise before next-page unlock.
