# Phase 5 Goal: Parental Voice Cloning

## Project
MagicBooksInstantly

## Mission
Phase 5 adds the emotional “magic touch”: parents can record a short bedtime voice sample, consent to voice cloning, and use their own approved voice for story narration, Struggle Assist hints, and Story Companion praise. The voice experience must be consent-first, secure, parent-controlled, and fully testable through mock providers when ElevenLabs credentials are not installed.

Codex will verify this phase by controlling the local browser, testing the voice selection and recording UI, exercising the clone route, checking Supabase persistence, and confirming narration routing chooses the parent voice when available.

## Technologies
- **Next.js 16.2 App Router**: protected Voice Cloning Studio, `/api/voice/clone`, `/api/voice/narrate`, and authenticated server-side Supabase access.
- **React 19**: voice library selection grid, recording state, waveform UI, consent confirmation, upload progress, and error recovery.
- **Tailwind CSS v4**: glassmorphism voice studio, recording controls, consent states, voice cards, and responsive dashboard layout.
- **Lucide React**: microphone, shield, waveform, playback, and consent iconography.
- **Browser MediaRecorder API**: device microphone capture, recording timer, blob creation, and local playback preview.
- **Web Audio API**: waveform visualizer, recording level meter, and audio preview.
- **ElevenLabs Voice Cloning API**: `POST /v1/voices/add` for uploading the parent sample and generating a custom voice model.
- **ElevenLabs TTS API**: dynamic narration using either default professional voices or the parent’s cloned `voice_id`.
- **Supabase Auth**: parent-only access to voice capture and voice settings.
- **Supabase Postgres**: `Users.elevenlabs_voice_id` and `VoiceProfiles` for provider voice id, consent, status, and training script metadata.
- **Supabase RLS**: prevents parents from reading or modifying another family’s voice profiles.
- **Codex Browser Automation**: automated browser testing for recording UI, consent flow, clone action, route protection, and narration routing.
- **Deterministic Mock ElevenLabs Provider**: safe local/CI path when `ELEVENLABS_API_KEY` is missing.

## Phase 5 Checklist
- [ ] **Voice Library UI**: Selection grid lets parents choose default professional voices or `Clone My Voice`.
- [ ] **Recording Module**: Dashboard UI lets the parent read the provided 60-second bedtime script into their device microphone.
- [ ] **ElevenLabs Cloning API**: Frontend sends recorded sample to the backend, and backend calls ElevenLabs `POST /v1/voices/add`.
- [ ] **Database Update**: Returned ElevenLabs `voice_id` is stored securely in `Users.elevenlabs_voice_id` and tracked in `VoiceProfiles`.
- [ ] **Dynamic TTS Routing**: Narration logic checks for a custom `voice_id` and routes ElevenLabs TTS to the parent voice when available.
- [ ] **Consent and Safety**: Voice cloning requires explicit consent and never exposes provider keys in the browser.
- [ ] **Automated QA**: Codex tests mock clone creation, auth protection, database persistence, and narration route selection.

## Expected Output
When Phase 5 is working, the app should produce these observable outputs:

1. **Voice Library UI**
   - Parent opens `/voice-cloning`.
   - Parent sees a selection grid with default professional voices.
   - Parent sees a `Clone My Voice` option.
   - Parent can select one active narration voice.
   - Selection state is clear and accessible.

2. **Recording Module**
   - Parent sees the 60-second bedtime training script.
   - Parent can grant microphone permission.
   - Parent can start recording.
   - UI shows recording duration and waveform/level feedback.
   - Parent can stop, preview, retry, or submit the recording.
   - If microphone permission is denied, the UI explains how to retry safely.

3. **Consent Flow**
   - Parent must confirm consent before upload.
   - Clone action is disabled until consent is confirmed.
   - Consent is stored with the voice profile.
   - The app never creates a voice profile without explicit consent.

4. **ElevenLabs Clone**
   - Backend receives the recorded audio sample.
   - Backend calls ElevenLabs `POST /v1/voices/add` when `ELEVENLABS_API_KEY` is present.
   - Backend uses a deterministic mock voice id when credentials are missing.
   - Backend returns voice profile id, provider voice id, and status.
   - Provider API keys remain server-only.

5. **Database Update**
   - `VoiceProfiles` row stores:
     - `user_id`
     - label
     - provider
     - provider voice id
     - status
     - training script
     - consent confirmation
   - `Users.elevenlabs_voice_id` stores the active parent voice id.
   - RLS ensures Parent A cannot read or mutate Parent B voice profiles.

6. **Dynamic TTS Routing**
   - `/api/voice/narrate` checks the authenticated parent’s `Users.elevenlabs_voice_id`.
   - If a custom parent voice exists, TTS uses that voice id.
   - If no custom voice exists, TTS uses the selected default professional voice.
   - If no ElevenLabs key exists, route returns mock timestamp data for tests.
   - Read To Me, Struggle Assist, and Companion Mode all use the same routing logic.

7. **Automated Testing**
   - Codex controls the browser to open `/voice-cloning`.
   - Codex verifies voice library cards and recording UI.
   - Codex verifies auth redirects when signed out.
   - Codex uses mock mode to submit consent and create a voice profile.
   - Codex verifies Supabase persistence in `VoiceProfiles` and `Users.elevenlabs_voice_id`.
   - Codex calls narration route and confirms it reports parent/custom voice routing when available.

## Automated Browser Test Plan
Codex will control the local browser and perform these checks:

1. Open `http://localhost:3000/voice-cloning` while signed out.
2. Verify redirect to `/login`.
3. Sign in as the automated parent.
4. Open `/voice-cloning`.
5. Verify default voice choices and `Clone My Voice` are visible.
6. Verify the bedtime training script is visible.
7. Start the recording UI or mock recording path.
8. Confirm consent.
9. Submit the clone request.
10. Verify success message contains a mock or real provider voice id.
11. Query Supabase through test scripts and verify `VoiceProfiles` row exists.
12. Verify `Users.elevenlabs_voice_id` is updated.
13. Call `/api/voice/narrate` and confirm routing uses the parent voice id or mock fallback.
14. Open `/tutor` and confirm Read To Me can use the narration route.

## Current Project Snapshot
- The local folder is **not currently a git repository**, so change review cannot use `git status` yet.
- Already implemented:
  - `/voice-cloning` page.
  - Bedtime Training Script display.
  - Consent-gated `/api/voice/clone` route.
  - `VoiceProfiles` table and RLS.
  - Mock ElevenLabs provider voice id when credentials are missing.
  - `/api/voice/narrate` with mock timestamp output.
  - Read To Me / Struggle Assist / Companion paths can call narration routing.
- Still incomplete for this Phase 5 checklist:
  - Full voice selection grid for default voices vs `Clone My Voice`.
  - Real browser recording via MediaRecorder.
  - Waveform/level meter during recording.
  - Actual multipart upload to ElevenLabs `POST /v1/voices/add`.
  - Updating `Users.elevenlabs_voice_id` after clone success.
  - Narration route selecting `Users.elevenlabs_voice_id` for dynamic TTS routing.
  - Real ElevenLabs TTS audio playback from the selected voice.
