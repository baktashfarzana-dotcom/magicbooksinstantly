# MagicBooksInstantly

Phase 1: Bedrock & Identity Foundation.

## Local Setup
1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and fill the Supabase values.
3. Apply `supabase/migrations/0001_bedrock_identity_foundation.sql` to your Supabase project.
4. Run `npm run dev`.

This Codex desktop session also includes a project-local official Node runtime at `.tools/node-official` because the bundled Codex Node runtime blocks native Next.js compiler packages on this machine.

## Cloud Setup
- Link the project to Vercel.
- Add the environment variables from `.env.example`.
- Configure Supabase Auth redirect URLs:
  - `http://localhost:3000/callback`
  - `https://<your-vercel-domain>/callback`

## Security
See `SECURITY_VERIFICATION_LOG.md` for the RLS verification checklist.
