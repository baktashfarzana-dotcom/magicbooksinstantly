# MagicBooksInstantly Product Experience & Automated QA Goal

## North Star
MagicBooksInstantly should feel like a parent-safe command center wrapped around a magical child reading experience. The parent controls identity, safety, curriculum, story approval, billing, and voice consent. The child only sees books, reading support, positive encouragement, quizzes, rewards, and their own progress.

The app must work as two connected experiences:

1. **Parent Experience**: create the family account, build a child's Living Profile, choose story templates or custom hurdles, approve generated books, manage voice cloning, monitor progress, and handle subscriptions or gifts.
2. **Child Experience**: open an approved book, read or listen safely, receive word-level help, hear optional companion encouragement, complete quizzes, and earn Star Dust without seeing parent controls.

Everything should be testable by Codex through terminal scripts, Supabase checks, and browser automation. Codex Browser is the first-choice tool for local app verification. Computer Use is allowed when credentials, dashboard login, browser permission prompts, OAuth, 2FA, Stripe, Vercel, GitHub, or Supabase console work blocks browser automation.

## Product Roles

### Parent
The parent is the authenticated account owner. A parent can:

- Sign up and sign in with Supabase Auth.
- Create and edit child Living Profiles.
- Enter the child's appearance, interests, sidekick, favorite places, and reading needs.
- Choose a premade story template from the 100-template library.
- Enter a custom hurdle or curriculum target in the Story Kitchen.
- Choose story duration: Quick Bedtime, Standard Read, or Weekend Adventure.
- Bake a story using the AI Story Engine.
- Review generated text and images before a child sees the book.
- Regenerate a strange or low-quality image.
- Enable or disable Companion Mode.
- Choose narration voice or create a cloned parent voice after consent.
- View reading streaks, quiz performance, Star Dust, badges, and reward redemptions.
- Manage subscription, gifting, and privacy consent.

### Child
The child is not an account administrator. A child can:

- Open a child-safe library of parent-approved books.
- Read a story in the interactive flipbook.
- Use **Read To Me** mode for narrated, karaoke-style word highlighting.
- Use **I Can Read!** mode for microphone-based reading practice.
- See correctly read words turn green.
- Receive gentle help after struggling on a word.
- Hear optional Companion Mode praise after successfully completing key pages.
- Complete the adaptive quiz after a story.
- Earn Star Dust, badges, streak progress, and treasury rewards.
- Switch between approved child profiles only when the parent has configured them.

The child must never see:

- API keys.
- Billing controls.
- Stripe checkout management.
- Provider configuration.
- Supabase project data.
- Parent account settings.
- Raw AI prompt controls.
- Unapproved generated books.

## Parent Experience: Expected Flow

### 1. Landing Page
The homepage should quickly explain the core promise:

> Magically Turn your Child into The Main Character.

Expected output:

- A high-conversion hero with a real child-photo reference transforming into a high-quality animated storybook cover.
- The example storybook cover should feature **The Broccoli Dinosaur** with the child, broccoli, and a friendly dinosaur.
- The page should use the centralized Tailwind design system, not one-off styling.
- Primary CTA: **Build Your Child's Profile**.
- Secondary navigation can lead to story templates, pricing, login, and parent dashboard.

Acceptance checks:

- `/` loads without authentication.
- Hero headline is visible.
- CTA is visible and clickable.
- No console errors.
- Layout works on desktop, tablet, and mobile widths.

### 2. Signup, Login, and Consent
The parent signs up with Supabase Auth. Email/password must work locally before OAuth is considered complete.

Expected output:

- `/signup` creates a Supabase auth user.
- A matching row exists in `Users`.
- Required parent consent appears before processing child voice or image data.
- `/login` signs in an existing parent.
- Auth callbacks preserve server-side session cookies.

Acceptance checks:

- Signed-out users can open `/`, `/login`, and `/signup`.
- Signed-out users are redirected away from parent dashboard routes.
- Signed-in users can open `/dashboard`.
- Service-role keys never appear in client code or browser network responses.

### 3. Living Profile Setup
The parent creates the child's identity and visual anchor.

Expected output:

- The wizard captures child name, age, appearance, interests, sidekick, and environment.
- The system creates a reusable `master_anchor_prompt` or visual anchor object.
- The visual anchor is reused for story text prompts and image prompts.
- Profile rows are owned by the authenticated parent.

Acceptance checks:

- Parent A can create and view Parent A profiles.
- Parent A cannot view Parent B profiles.
- Anonymous users cannot read profiles.
- Child-safe profile views do not expose account or billing controls.

### 4. Story Kitchen
The parent chooses what kind of story to bake.

Expected output:

- A custom hurdle field accepts prompts like "brushing teeth", "first day of school", or "sharing with sibling".
- A duration selector maps to:
  - Quick Bedtime: 6 minutes, about 15 pages.
  - Standard Read: 10 minutes, about 22 pages.
  - Weekend Adventure: 13 minutes, about 30 pages.
- The 100 premade templates are grouped into 10 categories.
- Clicking a template pre-fills the hurdle/curriculum intent.
- The Story Kitchen clearly shows that generated stories require parent approval.

Acceptance checks:

- `/story-kitchen` requires auth.
- Template cards render.
- Template click updates the form.
- Duration selector changes the requested page count.
- Submitting starts the bake flow.

### 5. Bake State
The bake state is the long-running generation screen.

Expected output:

- The UI shows progress for story text, image prompts, image generation, storage, and approval readiness.
- Literacy facts or gentle messages display while generation runs.
- The parent understands that the AI is building a book, not that the app is frozen.
- Failed provider calls show recoverable errors.
- Missing provider credentials use deterministic mock/test paths locally.

Acceptance checks:

- Bake flow can complete in mock mode.
- Generated story JSON has valid shape.
- The story has exactly 3 power words.
- Page count matches selected duration.
- Every page has `narrative_text`, `visual_prompt`, and `companion_reaction`.
- Every image prompt includes the same master anchor.

### 6. Library and Approval Queue
The parent approves generated books before child access.

Expected output:

- `/library` shows drafts, pending approval, approved books, and rejected/regenerated items.
- Parent can preview the flipbook.
- Parent can regenerate one image without rebaking the entire story.
- Child library only shows approved books.

Acceptance checks:

- Parent A cannot see Parent B stories.
- Child route does not expose unapproved books.
- Regenerate image endpoint preserves story ownership checks.
- Approval state is stored in Supabase.

### 7. Voice Cloning Studio
The parent can optionally create a voice model.

Expected output:

- `/voice-cloning` presents the 60-second bedtime training script.
- Parent must explicitly consent before recording/uploading.
- The recording UI shows microphone state and waveform feedback.
- ElevenLabs voice id is stored securely after successful cloning.
- If ElevenLabs credentials are missing locally, mock voice creation is clearly labeled.

Acceptance checks:

- No `VoiceProfiles` row is created without consent.
- Auth is required.
- Parent A cannot read Parent B voice profiles.
- Narration falls back to default voices when no custom voice exists.

### 8. Parent Command Center
The parent dashboard is the operational view.

Expected output:

- Reading streaks, Star Dust, quiz performance, badges, and profile activity are visible.
- Companion Mode can be toggled.
- The parent can navigate to Story Kitchen, Library, Voice Cloning, Pricing, and Profile Setup.
- This view should feel like a calm SaaS dashboard, not a child game screen.

Acceptance checks:

- `/dashboard` requires auth.
- Companion toggle persists to Supabase.
- Dashboard uses real data where available and clearly scoped placeholders where not yet implemented.

### 9. Pricing and Gifting
The business layer belongs to the parent only.

Expected output:

- `/pricing` shows subscription tiers.
- Stripe test mode creates checkout sessions.
- Grandparent/family gifting has a separate checkout path.
- Subscription status gates generation limits without blocking existing approved books.

Acceptance checks:

- Child routes never expose pricing controls.
- Stripe secret keys stay server-side.
- Checkout route requires appropriate validation.

## Child Experience: Expected Flow

### 1. Child Library
The child opens a simple, safe bookshelf.

Expected output:

- Only approved books appear.
- The child can pick a book cover.
- The page is visually rich, friendly, and touch-friendly.
- No parent-only links are visible.

Acceptance checks:

- `/child` requires a valid family session or child-safe access mode.
- No billing/account/API controls are visible.
- Approved books load quickly.

### 2. Interactive Flipbook Reader
The reader is the core child experience.

Expected output:

- The book opens page by page.
- The layout is comfortable on iPad/tablet and desktop.
- Page turn buttons or swipe/click pagination are smooth.
- Story art and text are both visible without overlap.
- The child cannot advance in tutor mode until the page is read or completed.

Acceptance checks:

- Reader loads an approved story.
- Page navigation works.
- Text remains readable on mobile and tablet.
- No layout shifts break the reading flow.

### 3. Read To Me Mode
The app reads the story aloud.

Expected output:

- ElevenLabs narration plays or a mock narration path runs locally.
- Words highlight in timestamp order, karaoke-style.
- The narration voice uses the parent's custom voice when available and consented.
- Otherwise, the app uses an approved default voice.

Acceptance checks:

- `/api/voice/narrate` requires auth.
- Word timestamps are returned.
- Highlighting advances through the page.
- Custom voice routing checks Supabase for the stored voice id.

### 4. I Can Read! Mode
The child reads aloud.

Expected output:

- The app requests microphone permission.
- Permission states are clear: not requested, requesting, granted, denied, unavailable.
- Azure Pronunciation Assessment listens in real time when credentials are present.
- Local verification can use deterministic mock assessment.
- Correct words turn green.

Acceptance checks:

- Microphone permission request works in the browser.
- Denied permission is handled gracefully.
- Word assessment persists under the authenticated parent/user.
- Successful completion can unlock next page.

### 5. Struggle Assist
The app helps without shaming.

Expected output:

- If the child is stuck for more than 4 seconds, the app plays a gentle hint.
- The hint can be a syllable cue, reread prompt, or supportive phrase.
- The hint does not mark the child wrong.

Acceptance checks:

- Timer starts when the child is on an unread word.
- Timer resets when progress is made.
- Hint audio route is server-side and authenticated.

### 6. Companion Mode
The story companion reacts inside the story.

Expected output:

- Parent can enable or disable Companion Mode.
- Story JSON includes page-level `companion_reaction` strings.
- After a successful page, the app checks for a reaction.
- If present and enabled, ElevenLabs plays the short encouragement before unlocking the next page.

Acceptance checks:

- Companion toggle persists.
- Disabled mode suppresses reactions.
- Enabled mode plays reactions only after page success.
- Reactions are short, positive, and context-aware.

### 7. Adaptive Quiz
After the story, the child completes a small comprehension quiz.

Expected output:

- Quiz questions come from story JSON.
- The quiz is short and age-appropriate.
- Correct answers earn Star Dust.
- Wrong answers receive gentle retry language.

Acceptance checks:

- `/quiz` renders story-linked quiz data.
- Quiz completion persists.
- Star Dust ledger records the earning reason.

### 8. Hero's Treasury
The child sees earned progress.

Expected output:

- `/treasury` shows Star Dust balance, badges, streaks, and progress bars.
- Rewards feel fun but not manipulative.
- Parent dashboard can map Star Dust to real-world rewards.

Acceptance checks:

- Star Dust persists in `TreasuryBalances`.
- `StarDustLedger` records each earning event.
- Child sees rewards only for their family/profile.

## Centralized Tailwind Design System

MagicBooksInstantly must use Tailwind CSS v4 as a centralized design system.

Rules:

- Design tokens live in `app/globals.css` inside `@theme`.
- Do not create `tailwind.config.js`.
- Shared components should use tokenized color names and reusable classes where possible.
- Repeated surface styles should become reusable primitives or utility classes.
- Parent dashboards should be calm, dense, and operational.
- Child screens should be warmer, larger, more playful, and touch-friendly.

Required token families:

- **Brand colors**: primary blue/indigo, magical purple, warm amber, story mint, coral accents.
- **Surfaces**: app background, card, muted, glass panel, command center panel.
- **Text**: foreground, muted foreground, inverted text.
- **State colors**: success, warning, destructive, info, focus ring.
- **Typography**: display font for child-facing moments, sans font for dashboards, mono for logs/debug.
- **Radius**: small controls, dashboard cards, child cards, modals.
- **Shadows**: soft card shadow, glass glow, book cover shadow.
- **Motion**: hover lift, page turn, bake progress, word highlight transition.

Expected output:

- `app/globals.css` is the source of truth for design tokens.
- Core UI components in `components/ui` consume those tokens.
- Page-level styling does not drift into unrelated palettes.
- Buttons, cards, inputs, badges, panels, and dashboards feel visually related across the app.

## Database and Security Expected Output

Supabase is the system of record for parent-owned data.

Expected tables or equivalents:

- `Users`: parent account metadata and subscription/voice references.
- `LivingProfiles`: child identity, visual anchor, companion preferences.
- `Stories`: generated books, approval state, story JSON, master anchor.
- `Images`: generated page images and prompts.
- `Templates`: premade story templates or a migration-backed equivalent.
- `VoiceProfiles`: consented parent voice models.
- `ReadingAttempts`: page/story reading sessions.
- `WordAssessments`: word-level reading outcomes.
- `TreasuryBalances`: current Star Dust and streak totals.
- `StarDustLedger`: immutable reward events.

Security expectations:

- Every client-facing table has RLS enabled and forced.
- Policies use `(select auth.uid()) = user_id`.
- Anonymous users cannot read private family rows.
- Parent A cannot read Parent B rows.
- Storage objects use owner-prefixed paths.
- Service-role keys are used only in trusted server/admin contexts.

## Automated Testing Strategy

### Tool Order

1. **Terminal and scripts** for deterministic checks.
2. **Supabase plugin** for schema, policy, migration, and data verification.
3. **Codex Browser** for local app and live deployment UI verification.
4. **Computer Use** when browser automation is blocked by credentials, permission prompts, OAuth, dashboards, 2FA, or provider consoles.
5. **GitHub plugin** when repository, PR, branch, or CI verification is needed.
6. **Vercel plugin** when deployment, environment variables, logs, or domain checks are needed.

### Required Local Commands

Run these before marking a phase stable:

```bash
npm run typecheck
npm run build
npm run test:security
npm run test:phase2:stability
npm run test:phase2:e2e
npm run test:phase3:audio
```

If normal `npm` is unavailable in Codex Desktop, use the bundled Node runtime documented in `AGENTS.md`.

### Browser QA Expected Output

Codex Browser should verify:

- Homepage loads and hero CTA is visible.
- Signup/login pages load.
- Signed-out parent routes redirect to `/login`.
- Authenticated parent can open dashboard.
- Parent can create or view a Living Profile.
- Story Kitchen templates render.
- Duration selector works.
- Bake flow works in mock mode when provider keys are absent.
- Tutor page can request microphone permission.
- Read To Me mode highlights words.
- Star Dust changes after a simulated successful reading.
- Treasury reflects updated balance.
- Child route does not expose parent-only controls.

### Computer Use Fallback Expected Output

Computer Use is allowed when Codex Browser cannot complete a required step. Use it for:

- Supabase dashboard login or 2FA.
- Vercel dashboard login or environment variable screens.
- GitHub authentication or repository creation screens.
- Stripe dashboard checks.
- Browser microphone permission prompts that require native UI.
- OAuth provider setup.

When credentials are needed, Codex should pause and state exactly what is needed. Codex should not invent credentials, bypass 2FA, or claim a dashboard step passed without seeing it.

## Phase Completion Definition

A phase is complete only when:

- Required code exists.
- Required migrations are applied.
- RLS/security checks pass.
- `npm run typecheck` passes.
- `npm run build` passes.
- Browser QA has been performed.
- Logs or reports are written when the phase asks for them.
- Mock mode is clearly labeled if real provider credentials are missing.
- Remaining gaps are documented honestly.

## Best Next Build Order

### Step 1: Stabilize Phase 1
Complete auth, Supabase RLS, env var documentation, build verification, browser verification, GitHub/Vercel linkage, and PWA basics.

### Step 2: Finish Phase 2
Complete OpenAI structured story generation, dynamic page counts, image generation, template persistence, master anchor consistency, and regenerate-image workflow.

### Step 3: Finish Phase 3
Complete the full 10-page UI flow: landing, command center, Story Kitchen, Living Profile, flipbook, voice studio, treasury, quiz, pricing/gifting, and approval queue.

### Step 4: Complete Phase 4+
Connect real Azure Speech, real ElevenLabs narration/cloning, Star Dust economy, Stripe subscriptions/gifting, compliance consent, monitoring, and production deployment.

## Current Operating Principle

Do not restart the project. This repository already contains a working Next.js app, Supabase migrations, story templates, tutor simulations, and phase documentation. The correct next move is to audit, stabilize, and fill the missing pieces in order.
