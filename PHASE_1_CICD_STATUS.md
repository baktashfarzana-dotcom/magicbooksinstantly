# Phase 1 CI/CD Linkage Status

## Completed Locally

- Initialized this folder as a Git repository on the `main` branch.
- Created the foundation commits:
  - `184b513 Initialize MagicBooksInstantly foundation`
  - `f5f4f7f Document Phase 1 CI/CD status`
  - `e0a832b Remove platform-specific CSS dependency`
- Confirmed secrets and generated files are ignored:
  - `.env.local`
  - `.next/`
  - `.tools/`
  - `node_modules/`
  - `tsconfig.tsbuildinfo`
- Confirmed `.env.example` contains the public Supabase variables plus optional provider/test variables.
- Confirmed GitHub Actions workflow exists at `.github/workflows/build-test.yml`.
- Updated the workflow to use `npm ci`, `npm run typecheck`, and `npm run build`.
- Added safe placeholder public environment variables to the workflow so CI can build before real Vercel/GitHub secrets are configured.

## Verified

These commands pass locally:

```bash
node_modules/.bin/tsc --noEmit
node_modules/.bin/next build
node scripts/verify-rls.mjs
```

Because `npm` is not globally available in this Codex Desktop shell, use the bundled/project runtime documented in `AGENTS.md` when running commands from automation.

## Current Remote Status

GitHub:

- Repository created: `https://github.com/baktashfarzana-dotcom/magicbooksinstantly`
- Local `origin` is configured over SSH:
  - `git@github.com:baktashfarzana-dotcom/magicbooksinstantly.git`
- `main` has been pushed and tracks `origin/main`.
- A local SSH deploy/developer key was generated and added to GitHub for this machine.
- `gh` is still not installed in the shell, so GitHub CLI workflows are not available yet.

Vercel:

- Vercel CLI is authenticated as `baktashfarzana-dotcom`.
- Project linked locally in `.vercel/project.json`:
  - Project: `magicbooksinstantly`
  - Project ID: `prj_BEiylalBFNVzfcGRGm0aWVgAaRae`
  - Team ID: `team_RGej74YWDoTG3ub3APAY9S4d`
- Production environment variables are configured in Vercel:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
  - `NEXT_PUBLIC_APP_URL`
- Production deployment is live:
  - `https://magicbooksinstantly.vercel.app`
  - Deployment ID: `dpl_CypLss8dzDv2HryA9yQi84Wk962W`
- Vercel Git integration is connected to:
  - `baktashfarzana-dotcom/magicbooksinstantly`
- Vercel Git events enabled:
  - Pull Request Comments
  - Commit Status
  - `deployment_status` events
  - `repository_dispatch` events

## Remaining Follow-Up

1. Add non-public provider secrets before enabling later phases:

```bash
OPENAI_API_KEY or AI_GATEWAY_API_KEY
ELEVENLABS_API_KEY
AZURE_SPEECH_KEY
AZURE_SPEECH_REGION
STRIPE_SECRET_KEY
```

2. Optional: install `gh` if GitHub CLI-based automation is desired.
3. Optional: add Preview-only environment variables for non-production branches when those branches exist.

## Phase 1 CI/CD Definition Of Done

This item is complete when:

- [x] `git remote -v` shows the GitHub origin.
- [x] `git push -u origin main` succeeds.
- [x] `.vercel/project.json` exists locally after linking.
- [x] Vercel has the required public production environment variables.
- [x] A Vercel production deployment URL loads.
- [x] Vercel is connected to the GitHub repository for push-based deployments.
- [x] GitHub Actions run the Build & Test workflow successfully after the next pushed commit.
- [x] Vercel fetch/browser verification confirms the live URL renders the homepage and protected `/dashboard` redirects to login.
