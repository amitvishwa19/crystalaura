# AGENTS.md

## Project Overview

CrystalAura is a multi-tenant Business OS built with **Next.js 16 (App Router, TypeScript, Tailwind CSS v4)**. It uses a custom `server.js` entry point that wraps Next.js with Socket.io for real-time features.

## Key Commands

- `npm run dev` — Next.js dev with `--webpack` (not turbopack)
- `npm run fast` — Next.js dev with default turbopack (no `--webpack`)
- `npm run build` — Production build (`--webpack`)
- `npm run lint` — ESLint only; there is no `typecheck` or `test` script
- `npm run email` — Run `@react-email` dev server for email templates in `src/emails/`

## Architecture

- **Entry point**: `server.js` (Next.js + Socket.io), not the default `next` CLI
- **Path alias**: `@/*` → `./src/*` (configured in `tsconfig.json` and `components.json`)
- **Route groups**: `src/app/(auth)/` for auth pages, `src/app/(public)/` for public pages
- **API routes**: `src/app/api/` (auth, workspace, v5 endpoints)
- **State**: Redux Toolkit (`src/redux/`) + Zustand
- **UI**: shadcn/ui (new-york style), lucide icons, Radix UI primitives
- **DB**: Supabase (PostgreSQL). Prisma client generated into `src/generated/prisma/` (gitignored). Use `supabase` CLI from devDependencies for migrations.
- **Auth**: NextAuth.js (`src/app/api/auth/[...nextauth]/`)
- **Email**: `@react-email` templates in `src/emails/`

## Build & Toolchain Quirks

- PostCSS uses `@tailwindcss/postcss` (Tailwind v4), **not** the v3 `tailwindcss` plugin
- Build requires `--webpack` flag on dev/build; `fast` omits it for turbopack
- `next-env.d.ts` and `.next/types/` are generated; do not edit them
- `src/generated/prisma/` is gitignored and contains the Prisma client; regenerate with `npx prisma generate`
- The `eslint.config.mjs` uses the new flat config format (`eslint-config-next`)

## Environment

- `.env` is present in the repo with hardcoded secrets (contrary to README best practices). Do not add new secrets to it.
- Key env vars: `NEXT_PUBLIC_SUPABASE_*`, `NEXT_PUBLIC_GEMINI_API_KEY`, `NEXT_PUBLIC_SOCKET_URL`, `NEXT_PUBLIC_FIREBASE_*`, `NEXTAUTH_URL`
- `server.js` reads `HOSTNAME` and `PORT` env vars (defaults: localhost, 3000)

## What to Avoid

- Do not hardcode API keys or secrets in source code (README rule, though `.env` currently violates this)
- Always filter database queries by `workspaceId` for multi-tenant isolation
- Do not edit generated files (`next-env.d.ts`, `.next/types/*`, `src/generated/prisma/*`)
- The `scripts/fix_lint.*` files fix single-quote escaping in JSX/TSX; prefer running them over manual fixes

## No Tests

There is no test framework, CI config, or test scripts in this repo. Do not add tests without checking with the team first.