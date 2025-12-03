# Repository Guidelines

## Project Structure & Modules
- Monorepo with `frontend` (React + Vite), `backend` (Supabase Edge Functions + Hono server code), and `blockchain/hardhat-setup` (Hardhat contracts, scripts, tests). Additional helper code lives in `blockchain/lib` and shared docs in `docs/`.
- UI code is in `frontend/src` (`components`, `pages`, `styles`, `types`, `data`). Backend utilities live under `backend/lib` and Supabase functions in `backend/supabase/functions`.
- Smart contracts and deploy helpers sit in `blockchain/hardhat-setup/contracts` and `blockchain/hardhat-setup/scripts`.

## Build, Test, and Development Commands
- Install all workspaces: `npm run install:all` (runs `frontend` and Hardhat installs).
- Frontend dev server: `npm run frontend:dev` (opens Vite on localhost).
- Frontend build: `npm run frontend:build` (outputs to `frontend/dist`).
- Blockchain compile/tests: `npm run blockchain:compile` and `npm run blockchain:test`.
- Local chain deploy: `npm run blockchain:deploy:local`; Arbitrum Sepolia: `npm run blockchain:deploy:sepolia`. Ensure `.env` in `blockchain/hardhat-setup` holds network keys.

## Coding Style & Naming Conventions
- Language: TypeScript across frontend/backends; prefer 2-space indent, single quotes, and explicit types for exported functions/components.
- React components in `PascalCase`; hooks/utilities `camelCase`; file names align with exported component (e.g., `InventoryPage.tsx`).
- Tailwind: keep class lists ordered by layout → spacing → color; favor Radix UI patterns already used.
- Avoid hardcoding secrets; read from `.env` (Supabase URL/key, RPC endpoints).

## Testing Guidelines
- Blockchain tests live in `blockchain/hardhat-setup/test` (`*.test.ts`). Run with `npm run blockchain:test`; start `hardhat node` if a local network is required.
- Frontend currently has no automated tests; validate UI changes by running `npm run frontend:dev` and checking key flows (login, campaign list, inventory updates).
- Add new tests near the feature folder; mirror fixture and helper patterns already in Hardhat tests.

## Commit & Pull Request Guidelines
- Commits: concise, imperative summaries (e.g., `Add campaign sync guard`); group related changes rather than bulk dumps. Reference issue IDs when known.
- PRs: include context (what/why), screenshots or short clips for UI updates, deployment/command logs for blockchain changes, and test results (`npm run blockchain:test` or manual steps).
- Keep diffs scoped per area (frontend vs blockchain); call out migrations or env changes explicitly.

## Security & Configuration Tips
- Do not commit `.env` files or private keys; use workspace-local env files and provider key vaults.
- Rotate RPC and Supabase keys if exposed; update `DEPLOYMENT_GUIDE.md` steps when network settings change.
- When adding contracts, document storage layout and upgrade assumptions in `docs/` to aid audits.
