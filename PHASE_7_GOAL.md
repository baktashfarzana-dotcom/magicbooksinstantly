# Phase 7 Goal: Pre-Launch, Monetization & Compliance

## Project
MagicBooksInstantly

## Mission
Phase 7 prepares MagicBooksInstantly for paid pre-launch use. The platform must support subscription tiers that cover AI generation costs, gift checkout for relatives, generation usage limits to prevent abuse, and clear COPPA-style parent consent before processing a child's image or voice data. This phase turns the product from a working prototype into a controlled business layer ready for beta families.

Codex will verify this phase by controlling the browser through signup, pricing, checkout, gift checkout, protected routes, and usage-limit flows, then pairing browser checks with Supabase and API verification.

## Technologies
- **Next.js 16.2 App Router**: pricing page, checkout routes, signup consent UI, protected business logic, and server-side API enforcement.
- **React 19**: pricing cards, gift checkout form, consent checkbox, usage-limit warnings, and parent-facing billing states.
- **Tailwind CSS v4**: polished pricing/gifting UI, compliance copy, plan comparison, and dashboard alerts.
- **Lucide React**: subscription, gift, shield, compliance, and usage icons.
- **Stripe API**: subscription checkout sessions, gift checkout sessions, customer records, billing portal, and test-mode verification.
- **Stripe Webhooks**: subscription status updates, plan changes, gift redemption, failed payment handling, and customer lifecycle sync.
- **Supabase Auth**: parent identity and secure signup flow.
- **Supabase Postgres**: `Users.subscription_status`, generation usage counters, plan limits, gift purchases, consent records, and audit logs.
- **Supabase Edge Functions**: server-side generation metering and rate/abuse checks before expensive AI calls.
- **Supabase RLS**: billing-adjacent app data remains parent-owned while server-side service roles handle trusted webhook updates.
- **Vercel Environment Variables**: Stripe, webhook, app URL, Supabase, and AI-provider credentials.
- **Codex Browser Automation**: automated checkout, signup consent, gifting, usage-limit, and compliance smoke tests.
- **Stripe Test Mode / Mock Mode**: deterministic local testing when `STRIPE_SECRET_KEY` is missing.

## Phase 7 Checklist
- [ ] **Monetization**: Stripe API integrated for Subscription Tiers: Starter, Tutor, and Pro.
- [ ] **Plan Gating**: AI generation limits are enforced by subscription tier to cover API costs.
- [ ] **Gifting Checkout Flow**: Secondary Stripe checkout lets grandparents/family buy 3-month or 6-month gift subscriptions without creating a child profile.
- [ ] **API Cost Tracking**: Supabase Edge Function counts generations per user and prevents API abuse/spam.
- [ ] **COPPA Compliance**: Signup requires explicit parent consent for processing child voice and image data.
- [ ] **Webhook Sync**: Stripe webhook updates Supabase subscription and gift state.
- [ ] **Automated QA**: Codex verifies signup consent, pricing UI, checkout mock/test paths, gift checkout, and usage-limit behavior.

## Expected Output
When Phase 7 is working, the app should produce these observable outputs:

1. **Subscription Tiers**
   - `/pricing` shows Starter, Tutor, and Pro tiers.
   - Each tier clearly explains story generation limits, voice/tutor features, and child profile limits.
   - Parent can choose a tier.
   - Checkout opens a Stripe Checkout Session in test mode when Stripe credentials are configured.
   - If Stripe credentials are missing locally, checkout returns a mock checkout URL and logs mock mode.

2. **Plan Gating**
   - Before `/api/bake-story` starts generation, server checks the parent’s subscription tier and current usage.
   - Starter/Tutor/Pro limits are enforced consistently.
   - If the parent exceeds the plan limit, the API returns a friendly upgrade message.
   - UI shows remaining monthly bakes.
   - Generation attempts are counted only when appropriate and cannot be spoofed by the browser.

3. **Gifting Checkout**
   - `/pricing` or gifting UI offers 3-month and 6-month gift options.
   - Gift buyer can purchase without creating a child profile.
   - Gift checkout collects recipient email or creates a redeemable gift code.
   - Gift redemption applies subscription credit to the recipient parent account.
   - Stripe webhook or mock flow records gift purchase and redemption status in Supabase.

4. **API Cost Tracking**
   - Supabase Edge Function or trusted server route records generation usage per user.
   - Usage data includes user id, generation type, provider, estimated cost units, story id when available, and timestamp.
   - Abuse/spam protection blocks excessive repeated calls.
   - Parent dashboard can show usage summary.
   - Admin/debug logs make provider cost behavior inspectable without exposing API keys.

5. **COPPA / Parent Consent**
   - Signup includes a mandatory checkbox for parent consent.
   - Consent text explicitly covers processing child image descriptions, generated likenesses, reading audio, and voice data.
   - Signup cannot proceed until consent is checked.
   - Consent record is stored with timestamp, user id, consent version, and source.
   - Parent can review compliance/privacy copy later.

6. **Webhook and Database Sync**
   - Stripe webhook verifies signatures.
   - Subscription status updates `Users.subscription_status`.
   - Plan tier and limits update in Supabase.
   - Failed payment or cancellation changes access appropriately.
   - Service-role logic is server-only and never bundled into browser code.

7. **Automated Testing**
   - Codex opens `/signup` and confirms consent is required.
   - Codex opens `/pricing` and verifies Starter/Tutor/Pro and gift options.
   - Codex triggers mock/test subscription checkout.
   - Codex triggers mock/test gift checkout.
   - Codex attempts generation under a plan limit and over a plan limit.
   - Codex verifies Supabase usage rows and subscription state.
   - Codex confirms protected billing and parent routes are not available anonymously.

## Automated Browser Test Plan
Codex will control the local browser and perform these checks:

1. Open `http://localhost:3000/signup`.
2. Try to submit signup without COPPA consent and confirm it is blocked.
3. Check the consent box and confirm signup flow can continue.
4. Open `/pricing`.
5. Confirm Starter, Tutor, Pro, 3-month gift, and 6-month gift options are visible.
6. Click each subscription checkout in mock/test mode and confirm a checkout URL is returned.
7. Click each gift checkout in mock/test mode and confirm a checkout URL is returned.
8. Sign in as automated parent.
9. Trigger story generation within allowed plan usage.
10. Simulate or seed plan-limit exhaustion.
11. Confirm generation is blocked with an upgrade message.
12. Query Supabase to verify usage/cost tracking rows.
13. Verify `Users.subscription_status` changes through mock or Stripe webhook test path.

## Current Project Snapshot
- The local folder is **not currently a git repository**, so change review cannot use `git status` yet.
- Already implemented:
  - `/pricing` page with subscription/gift-style cards.
  - `/api/checkout` route with `STRIPE_SECRET_KEY` detection and mock checkout fallback.
  - `Users.subscription_status` column.
  - Auth-protected checkout route.
  - Phase audio-sync test checks that Stripe mock/test path exists.
- Still incomplete for this Phase 7 checklist:
  - Real Stripe Checkout Session creation.
  - Starter/Tutor/Pro tier definitions and plan IDs.
  - Stripe webhook endpoint and signature verification.
  - 3-month and 6-month gift checkout/redemption data model.
  - Supabase Edge Function or server-side usage/cost tracking.
  - Plan-limit enforcement in `/api/bake-story`.
  - COPPA consent checkbox and persisted consent record during signup.
