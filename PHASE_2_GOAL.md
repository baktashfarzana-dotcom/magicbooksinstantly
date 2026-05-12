# Phase 2 Goal: The AI Story Engine

## Project
MagicBooksInstantly

## Mission
Phase 2 turns MagicBooksInstantly from an authenticated app shell into a working AI story kitchen. Parents should be able to choose a child Living Profile, pick a pre-made or custom hurdle, select a 6, 10, or 13-minute reading length, and bake a structured child-safe story with consistent page art. The output must be reliable JSON, age-appropriate, visually anchored to the child, stored in Supabase, and reviewable before the child reads it.

## Technologies
- **Next.js 16.2 App Router**: `/api/bake-story`, protected Story Kitchen routes, server-side Supabase access, and long-running generation coordination.
- **React 19**: Story Kitchen controls, template picker, flipbook reader, and parent approval surfaces.
- **Tailwind CSS v4**: glass dashboard styling and responsive story-generation UI.
- **Vercel AI SDK v6**: structured text generation and image generation provider calls.
- **OpenAI Structured Outputs**: JSON-schema-constrained story output using `response_format: { type: "json_schema" }` behavior through the AI SDK output schema.
- **OpenAI / DALL-E / Midjourney-compatible image provider**: high-quality page imagery using a Master Anchor prompt for character consistency.
- **Supabase Postgres**: `Stories` and `Images` rows for story JSON, status, prompts, storage paths, and generation metadata.
- **Supabase Storage**: `story-images` bucket for generated page images.
- **Supabase RLS**: parent-owned access to generated stories, image metadata, and storage objects.
- **Codex Browser Automation**: automated local browser testing for Story Kitchen, Library, Flipbook, and parent approval flows.
- **Deterministic Local Fallbacks**: local story JSON and SVG page art when provider credentials are missing, so tests can run without paid APIs.

## Phase 2 Checklist
- [ ] **Text Generation**: OpenAI API connected through structured output JSON schema so story output never returns markdown or malformed arrays.
- [ ] **Dynamic Length Engine**: System prompt accepts `[Target_Page_Count]` and scales story beats for:
  - 6-minute Quick Bedtime stories, about 15 pages.
  - 10-minute Standard Read stories, about 22 pages.
  - 13-minute Weekend Adventure stories, about 30 pages.
- [ ] **Lexile Limiter**: Story prompt enforces 1st-grade vocabulary and syntax, Lexile 200L-500L, and roughly 40-50 words per minute pacing.
- [ ] **Image Generation**: DALL-E 3, OpenAI image generation, or Midjourney-compatible API connected for high-quality page images.
- [ ] **Visual Consistency**: Master Anchor prompt and child visual seed are injected into every page prompt.
- [ ] **Storage and Metadata**: Every generated image is uploaded to Supabase Storage and recorded in `Images` with page number, prompt, provider, bucket, and path.
- [ ] **Flipbook Reader**: Child-safe reader displays page art, story text, page navigation, karaoke-style highlighting, and optional companion reactions.
- [ ] **Parent Approval Queue**: Generated books remain parent-visible before being exposed to the child library.
- [ ] **The Redo Button**: Parents can regenerate a single weird image through a dedicated API route before approving the story.
- [ ] **Automated QA**: Codex bakes quick, standard, and weekend stories, verifies JSON shape, verifies image count, verifies prompt anchors, and checks the reader in the browser.

## Expected Output
When Phase 2 is working, the app should produce these observable outputs:

1. **Story Kitchen**
   - Authenticated parent opens `/story-kitchen`.
   - Parent selects a child profile.
   - Parent enters a custom hurdle or clicks a pre-made story template.
   - Parent chooses Quick Bedtime, Standard Read, or Weekend Adventure.
   - Bake button creates a new story row with status transitions from `baking` to `ready` or `failed`.

2. **Structured Story JSON**
   - The stored `story_json` is a valid object, not markdown.
   - It includes:
     - `title`
     - `age_band`
     - `hurdle`
     - `moral`
     - exactly 3 `power_words`
     - `total_pages_generated`
     - `target_minutes`
     - `length_preset`
     - page array with `page_number`, `text`, `image_prompt`, `emotional_beat`, and `companion_reaction`
     - `knowledge_loop_quiz`
   - Page count matches the chosen preset: 15, 22, or 30.
   - Page text stays at a 1st-grade reading level with short, concrete sentences.

3. **Dynamic Narrative Pacing**
   - The story scales by percentage:
     - First 20%: setup.
     - Next 20%: hurdle.
     - Next 40%: mission.
     - Final 20%: victory.
   - The child is the active hero.
   - The story avoids shame, danger, billing, provider-key, or AI configuration references.

4. **Visual Generation**
   - Each page produces one image asset.
   - Each image prompt includes the Master Anchor and page scene.
   - Quick stories produce 15 images.
   - Standard stories produce 22 images.
   - Weekend stories produce 30 images.
   - All image files are stored under owner-scoped Supabase Storage paths.

5. **Visual Consistency**
   - Every page prompt reuses the same child identity seed.
   - The prompt preserves face shape, hair, skin tone, outfit colors, proportions, and personality cues.
   - Prompt checks confirm no generated page omits the master anchor.

6. **Parent Review and Redo**
   - Generated story appears in the Library/Approval Queue.
   - Parent can open the story before the child sees it.
   - Parent can click Regenerate Image on a specific page.
   - The redo route replaces that page image, updates metadata, and keeps RLS owner checks.

7. **Child Flipbook**
   - Child-safe `/child` reader opens only approved/ready books.
   - Reader shows art and text for every page.
   - Previous/next controls work.
   - Companion Mode can display page-level encouragement when a `companion_reaction` exists.
   - Child-safe routes do not expose billing, provider keys, or parent-only AI controls.

8. **Automated Testing**
   - Terminal tests verify schema, route wiring, dynamic page counts, RLS, and storage isolation.
   - Browser tests verify Story Kitchen controls, template selection, successful bake, Library visibility, and Flipbook rendering.
   - Final logs are written to `PHASE_2_STABILITY.log` and `PHASE_2_E2E.log`.

## Automated Browser Test Plan
Codex will control the local browser and perform these checks:

1. Open `http://localhost:3000`.
2. Sign in as an automated parent.
3. Open `/story-kitchen`.
4. Select a child profile and choose a pre-made story template.
5. Bake one Quick Bedtime story and confirm a ready result.
6. Bake one Standard Read story and confirm 22 pages/images.
7. Bake one Weekend Adventure story and confirm 30 pages/images.
8. Open `/library` and confirm generated books appear in the parent approval queue.
9. Open `/child` for a ready story and confirm the flipbook page art and text render.
10. Toggle Companion Mode and confirm companion reaction UI appears on pages with reactions.
11. Use the Redo image route once implemented and confirm one page image changes while ownership remains protected.

## Current Project Snapshot
- The local folder is a Git repository on `main` and tracks `origin/main`.
- The dynamic story schema, prompt, local fallback generation, `/api/bake-story`, Supabase storage upload, Story Kitchen length selector, pre-made templates, and flipbook companion UI are implemented.
- The parent Library/Approval Queue reads real generated `Stories` and `Images` rows and exposes per-page image redo controls.
- The dedicated parent-facing **Regenerate Image** API route is implemented at `/api/stories/[storyId]/images/[pageNumber]/regenerate`.
- `phase-2-e2e.mjs` tests quick, standard, and weekend story bakes with 15, 22, and 30 images, RLS isolation, storage isolation, and single-page image regeneration.
- Real image-provider generation is wired through `STORY_IMAGE_MODEL`; deterministic local SVG storyboards keep tests passing when paid provider credentials are not installed.
