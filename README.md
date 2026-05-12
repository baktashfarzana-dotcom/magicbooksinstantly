# MagicBooksInstantly

Phase 1: Bedrock & Identity Foundation.

## Local Setup
1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and fill the Supabase values.
3. Apply `supabase/migrations/0001_bedrock_identity_foundation.sql` to your Supabase project.
4. Run `npm run dev`.

This Codex desktop session also includes a project-local official Node runtime at `.tools/node-official` because the bundled Codex Node runtime blocks native Next.js compiler packages on this machine.

## Cloud Setup
- GitHub repository: `https://github.com/baktashfarzana-dotcom/magicbooksinstantly`
- Vercel production URL: `https://magicbooksinstantly.vercel.app`
- Vercel Git integration is connected to the GitHub repository.
- Add any remaining private provider secrets from `.env.example` before enabling AI, audio, or billing features.
- Configure Supabase Auth redirect URLs:
  - `http://localhost:3000/callback`
  - `https://magicbooksinstantly.vercel.app/callback`
- See `PHASE_1_CICD_STATUS.md` for the current GitHub/Vercel linkage status and exact remaining remote setup steps.

## Security
See `SECURITY_VERIFICATION_LOG.md` for the RLS verification checklist.
