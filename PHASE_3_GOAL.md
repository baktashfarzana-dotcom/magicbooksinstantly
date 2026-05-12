# Phase 3 Goal: User Interface & UX

## Project
MagicBooksInstantly

## Mission
Phase 3 turns the AI story engine into a polished, parent-friendly product experience. Parents should immediately understand the promise from the homepage, create a Living Profile without friction, choose a custom hurdle or one of 100 pre-made templates, bake a story with a delightful loading state, and open a responsive child-safe reader that feels natural on tablets.

Codex will verify this phase by controlling the local browser, exercising the UI flows, checking responsive pages, and pairing browser checks with terminal build/type/security tests.

## Technologies
- **Next.js 16.2 App Router**: homepage, protected dashboard routes, Story Kitchen, Library, and child reader pages.
- **React 19**: client-side onboarding, template selection, bake state, and interactive reader controls.
- **Tailwind CSS v4**: responsive layouts, glassmorphism panels, fluid visual hierarchy, and design tokens in `app/globals.css`.
- **Lucide React**: consistent iconography for navigation, story tools, profile controls, and dashboard actions.
- **Framer Motion**: animated bake/loading state, progress transitions, and celebratory micro-interactions.
- **Supabase Auth + Postgres**: authenticated parent data loading for dashboards, profiles, story generation, library, and reader access.
- **Supabase Storage**: signed image URLs for flipbook pages.
- **Vercel AI SDK / OpenAI / image provider outputs**: generated story state consumed by the UI.
- **Codex Browser Automation**: automated navigation, form filling, clicking, responsive checks, and browser smoke testing.

## Phase 3 Checklist
- [ ] **High-Conversion Landing Page**: Implement the side-by-side hero section: “Magically Turn your Child into The Main Character” next to a visual showing a real child's photo transforming into a high-quality Pixar-style book cover such as `The Broccoli Dinosaur`.
- [ ] **Onboarding Form**: Multi-step Living Profile form for adding child details, visual features, sidekicks, and local environments.
- [ ] **Story Kitchen Dashboard**: UI where parents can type custom daily Hurdles or Curriculum topics.
- [ ] **Duration Selector**: Dropdown in Story Kitchen for Quick Bedtime (6 mins), Standard Read (10 mins), or Weekend Adventure (13 mins).
- [ ] **100-Template Library**: Beautiful categorical UI with 10 folders, mapped to the 100 pre-made story templates and ready for one-click generation.
- [ ] **Bake State**: Highly engaging loading screen using Framer Motion animations, progress stages, and literacy facts while AI generation runs.
- [ ] **Reader**: Interactive child-safe reader with swipe/click pagination, responsive iPad/tablet layout, art display, karaoke text highlighting, and companion reactions.

## Expected Output
When Phase 3 is working, the app should produce these observable outputs:

1. **Homepage Hero**
   - `/` opens to a warm, high-conversion hero.
   - The hero includes the headline: “Magically Turn your Child into The Main Character.”
   - A real-photo-style child reference appears beside a polished storybook cover titled `The Broccoli Dinosaur`.
   - The hero communicates that the app preserves the child’s exact visual features in story art.
   - The rest of the homepage remains intact: features, template library, voice library, pricing, and CTA modal.

2. **Living Profile Onboarding**
   - Parent can open the profile wizard from the homepage CTA.
   - Wizard supports multiple steps.
   - Parent can enter child name, age, physical appearance, outfit, sidekick, and environment details.
   - Authenticated parent can persist the profile to Supabase.
   - Profile data remains owner-scoped through RLS.

3. **Story Kitchen**
   - Authenticated parent can open `/story-kitchen`.
   - Parent can select a child profile.
   - Parent can type a custom hurdle or curriculum topic.
   - Parent can select a duration preset.
   - Parent can bake the story and receive a visible loading state.

4. **Duration Selector**
   - Dropdown shows:
     - Quick Bedtime (6 min, 15 pages)
     - Standard Read (10 min, 22 pages)
     - Weekend Adventure (13 min, 30 pages)
   - Selected duration is sent to `/api/bake-story`.
   - Bake result reports the correct page count and target minutes.

5. **100-Template Library**
   - UI displays 10 categories:
     - Daily Routines & Habits
     - Big Emotions & Meltdowns
     - Social Skills & Friendships
     - School & Focus
     - Courage & Facing Fears
     - Siblings & Family Dynamics
     - Resilience & Growth Mindset
     - Health, Bodies & Boundaries
     - Major Life Changes & Grief
     - Imagination & Life Skills
   - UI includes all 100 story templates.
   - Search works.
   - Clicking a template loads it into the Story Kitchen hurdle field.
   - Database-backed templates are available once the `Templates` table is added and seeded.

6. **Bake Loading State**
   - Clicking Bake opens an engaging loading state, not only a disabled button.
   - Loading state shows generation stages such as “writing story,” “anchoring hero,” “painting pages,” and “saving book.”
   - Loading state rotates literacy facts.
   - Motion is smooth, respectful of reduced-motion preferences, and does not block error recovery.

7. **Reader**
   - `/child` displays the selected ready story.
   - Reader shows page art and page text in a tablet-friendly layout.
   - Previous/next click controls work.
   - Swipe gestures work on touch devices.
   - Karaoke-style highlighting is visible.
   - Companion Mode can show page-level encouragement.
   - Layout remains readable on iPad/tablet and mobile widths.

8. **Automated Testing**
   - Codex runs terminal checks: typecheck, build, Phase 2 stability, and relevant security scripts.
   - Codex controls the browser to verify homepage hero, CTA modal, Story Kitchen, template selection, duration selector, bake state, and reader navigation.
   - Final Phase 3 report identifies pass/fail for each UI checklist item.

## Automated Browser Test Plan
Codex will control the local browser and perform these checks:

1. Open `http://localhost:3000`.
2. Verify the homepage hero headline and `The Broccoli Dinosaur` visual are visible.
3. Click the profile CTA and verify the multi-step wizard opens.
4. Navigate to `/story-kitchen` signed out and verify redirect to `/login`.
5. Sign in as an automated Supabase parent.
6. Open `/story-kitchen`.
7. Select a duration preset.
8. Search the template library and click a template.
9. Confirm the hurdle field is populated from the selected template.
10. Click Bake and verify the loading state appears.
11. Open the generated story in `/child`.
12. Click next/previous page controls.
13. Test tablet and mobile viewport widths and verify no text overlap.
14. If swipe support is implemented, perform a touch swipe and verify page navigation.

## Current Project Snapshot
- The local folder is **not currently a git repository**, so change review cannot use `git status` yet.
- Already implemented:
  - High-conversion homepage hero with child reference and `The Broccoli Dinosaur` cover.
  - Homepage CTA wizard mock.
  - Story Kitchen hurdle input.
  - Duration selector.
  - 100-template categorical UI from local structured data.
  - Template click-to-fill behavior.
  - Click-based Flipbook reader with responsive layout and companion reactions.
- Still incomplete for this Phase 3 checklist:
  - Full authenticated Living Profile persistence from the homepage wizard.
  - Database-backed `Templates` table and seed sync for the 100 templates.
  - Framer Motion dependency and full animated Bake loading screen with literacy facts.
  - Touch swipe pagination in the reader.
