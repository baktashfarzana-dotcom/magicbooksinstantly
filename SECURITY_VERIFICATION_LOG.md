# Security Verification Log

## Status
Local application verification passed. Supabase migration applied to project `bquudgfmssmtzowreubd`. Pending Vercel deployment and two-user authenticated RLS proof.

## Local Verification
- `npm run typecheck`: passed.
- `npm run build`: passed.
- Browser smoke test: `/`, `/login`, and `/signup` render in the in-app browser.
- Protected-route smoke test: `/dashboard` redirects to `/login` when unauthenticated.

## Supabase Verification
- Migration `bedrock_identity_foundation`: applied successfully.
- Tables present: `public.Users`, `public.LivingProfiles`.
- RLS enabled: true on both tables.
- Security advisors: no lints returned.
- Anonymous RLS probe: passed. `Users` and `LivingProfiles` are not readable with the publishable key alone.
- Policies confirmed through `pg_policies`: all access is scoped to authenticated users where `(select auth.uid()) = user_id`.
- Performance advisors: two informational unused-index notices for the new `user_id` indexes. This is expected until real authenticated traffic uses them.

## Dependency Audit
- `npm audit` reports 2 moderate findings through Next's nested PostCSS dependency.
- The suggested audit fix downgrades `next` to `9.3.3`, so it is not appropriate for a Next.js 16 app. Re-check when a patched Next.js 16 release is available.

## Required Proof Before Phase 1 Sign-off
- Anonymous request to `Users` returns no rows or an authorization failure. Passed.
- Parent A can read only Parent A's `Users` row and `LivingProfiles`.
- Parent B cannot read Parent A's `LivingProfiles`.
- Child view never exposes parent settings, billing, or AI configuration routes.
- Supabase service-role key is absent from all `NEXT_PUBLIC_*` variables and browser bundles. Passed.
