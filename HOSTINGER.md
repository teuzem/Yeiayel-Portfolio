# Hostinger Node.js deployment

## Required build settings

- Branch: `main`
- Required release: latest `main` commit, including `ebb6898` or newer
- Application root: repository root
- Node.js version: `22`
- Package manager: `npm`
- Install command: `npm ci --no-audit --no-fund`
- Build command: `npm run check:env && npm run build`
- Start command: `npm run start`
- Application port: use the port supplied by Hostinger

Do not select pnpm. A deployment log referencing
`~/.cache/node/corepack/.../pnpm.cjs` means the saved Hostinger package manager
is still pnpm.

## Required application variables

Set these in the Hostinger application environment settings. Local
`.env.local` values are not uploaded to Hostinger.

```env
NEXT_PUBLIC_APP_URL=https://your-domain.example

NEXT_PUBLIC_SANITY_PROJECT_ID=mbj53wuq
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2025-10-15
NEXT_PUBLIC_SANITY_STUDIO_URL=https://your-domain.example/studio
SANITY_STUDIO_PREVIEW_ORIGIN=https://your-domain.example/studio
SANITY_SERVER_API_TOKEN=your-sanity-server-token
SANITY_VIEWER_TOKEN=your-sanity-viewer-token

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...

OPENAI_API_KEY=your-openai-key
OPENAI_CHAT_MODEL=gpt-5-mini
OPENROUTER_API_KEY=your-openrouter-key
OPENROUTER_CHAT_MODEL=openrouter/auto
TWIN_CHAT_TIMEOUT_MS=28000

TAVILY_API_KEY=your-tavily-key
TWIN_RESEARCH_ENABLED=true
TWIN_RESEARCH_TIMEOUT_MS=7000
TWIN_RESEARCH_COUNTRY=cameroon
```

Only the Tavily key and one working AI provider are required for live web
research. Configure both OpenAI and OpenRouter for provider failover.

## Exact redeployment sequence

1. Open the Hostinger website dashboard and select the deployed application.
2. Open its build or deployment settings.
3. Confirm the repository branch is `main`.
4. Confirm the latest visible commit is `ebb6898` or newer.
5. Select Node.js 22 and npm.
6. Enter the install, build, and start commands shown above.
7. Open the environment variables section and add every required variable.
8. Replace `your-domain.example` with the final HTTPS domain.
9. Save the environment settings.
10. Trigger a fresh deployment from the latest `main` commit.
11. Clear the build cache if the log still references Corepack or `pnpm.cjs`.
12. Confirm the build log contains:
    - `Environment is ready for AI Twin live research.`
    - `Compiled successfully`
    - `Prepared standalone server with public and static assets.`
13. Restart the application process after deployment.
14. Ask the production AI Twin:
    `Who is Prof NGUEFACK TSAGUES Georges?`
15. Confirm the answer includes `Verified web sources` and clickable links.

If the environment check reports Tavily as missing, the variable is not
available to the build process. Re-enter it in the application environment
settings, save, rebuild, and restart. Never commit production secrets to Git.
