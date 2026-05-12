# Phase 1 CI/CD Linkage Status

## Completed Locally

- Initialized this folder as a Git repository on the `main` branch.
- Created the first commit:
  - `184b513 Initialize MagicBooksInstantly foundation`
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

- The GitHub connector is available, but it currently reports no installed accounts and no accessible repositories.
- `gh` is not installed in the shell.
- No `origin` remote is configured yet.

Vercel:

- The Vercel connector can see the team:
  - `baktashfarzana-dotcom's projects`
  - `team_RGej74YWDoTG3ub3APAY9S4d`
- The team currently reports no projects through the connector.
- The Vercel MCP deployment helper currently instructs use of `vercel deploy`.
- The Vercel CLI can run through `.tools/bin/npm exec vercel`, but it has no local credentials yet.
- CLI login started a device login flow and required browser authentication, so project linking/deployment cannot be finished automatically until Vercel CLI authentication is completed.

## Exact Remaining Steps To Finish Remote CI/CD

1. Install/authorize the GitHub connector for the account that should own the repository, or create a GitHub repository manually.
2. Add the local Git remote:

```bash
git remote add origin git@github.com:<owner>/<repo>.git
git push -u origin main
```

3. Authenticate the Vercel CLI in this local environment:

```bash
.tools/bin/npm exec vercel -- login
```

4. Link the project to Vercel:

```bash
.tools/bin/npm exec vercel -- link
```

5. Add Vercel environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
NEXT_PUBLIC_APP_URL
OPENAI_API_KEY or AI_GATEWAY_API_KEY
ELEVENLABS_API_KEY
AZURE_SPEECH_KEY
AZURE_SPEECH_REGION
STRIPE_SECRET_KEY
```

6. Deploy:

```bash
.tools/bin/npm exec vercel -- deploy
```

7. Connect the Vercel project to the GitHub repository in Vercel project settings so pushes to `main` trigger production/preview deployments.

## Phase 1 CI/CD Definition Of Done

This item is complete when:

- `git remote -v` shows the GitHub origin.
- `git push -u origin main` succeeds.
- GitHub Actions runs the Build & Test workflow successfully.
- `.vercel/project.json` exists locally after linking.
- Vercel has the required environment variables.
- A Vercel deployment URL loads.
- Codex Browser verifies the live URL renders the homepage and protected routes redirect correctly.
