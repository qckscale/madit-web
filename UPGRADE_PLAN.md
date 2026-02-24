# Dependency Upgrade Plan — madit-web

## Pre-Stage Setup — COMPLETED
- ✅ Sanity MCP server added (remote, `https://mcp.sanity.io`)
- ✅ Next.js DevTools MCP installed and configured (`next-devtools-mcp`)
- ✅ Claude Code permissions expanded (`.claude/settings.local.json`)
- ✅ CLAUDE.md updated with MCP server info
- ✅ UPGRADE_PLAN.md and CLAUDE.md cross-referenced for session continuity

## Context
Both projects (frontend + CMS) are 2+ major versions behind on core dependencies. The codebase is clean and modern (functional components, App Router, modern schema API), making this a good candidate for a staged upgrade. Goal: get to latest stable versions with minimal risk, committing after each stage so we can rollback.

**Order: CMS first, then Frontend.** CMS is simpler (4 source files, no custom components) and lower risk.

---

## Stage 1 — CMS: Safe minor/patch updates
**Risk: Very Low** | **Status: Completed**

Update non-breaking packages:
- `prettier` 3.0 → 3.8
- `@types/react` 18.2 → 18.3
- `@types/styled-components` 5.1.26 → 5.1.36
- `eslint` 8.48 → 8.57 (latest v8, stay within major)

**Code changes:** None
**Verify:** `npm run dev` — Studio loads, can browse content

---

## Stage 2 — CMS: Sanity 3 → latest v3 (3.99)
**Risk: Low** | **Status: Completed**

- `sanity` 3.15 → 3.99
- `@sanity/vision` 3.15 → 3.99
- `@sanity/code-input` 4.1 → 4.1.4

**Code changes:**
- `sanity.config.ts`: rename `deskTool()` → `structureTool()`, update import from `'sanity/desk'` → `'sanity/structure'`
- `lib/isUniqueAcrossAllDocuments.ts`: update hardcoded API version `2022-12-07` → `2025-01-01`

**Verify:** `npm run dev` — Studio loads, desk structure works, can create/edit content

---

## Stage 3 — CMS: Sanity 5 + React 19
**Risk: Medium** | **Status: Completed**

- `sanity` 3.99 → 5.12
- `@sanity/vision` 3.99 → 5.12
- `@sanity/code-input` 4.1.4 → 7.0
- `react` / `react-dom` / `react-is` 18.2 → 19.2
- `styled-components` 5.3 → 6.3 (peer dep, not used directly)
- `typescript` 4.9 → 5.9

**Code changes:**
- Review `sanity.config.ts` for any API changes in v5 (plugin API, structure builder)
- Update `tsconfig.json` target if needed
- Check `@sanity/eslint-config-studio` 3.0 → 6.0 compatibility with eslint 8

**Verify:** `npm run dev` — Studio loads fully, all content types browsable, can edit and save documents

---

## Stage 4 — Frontend: Safe minor/patch updates
**Risk: Very Low** | **Status: Completed**

- `sass` 1.66 → 1.97
- `highlight.js` 11.9 → 11.11
- `@azure/communication-email` 1.0 → 1.1
- `@types/negotiator` 0.6.1 → 0.6.4
- `next-sanity-client` 1.0.7 → 1.0.8

**Code changes:** None
**Verify:** `npm run dev` — site loads, pages render, styling intact, code blocks highlight correctly

---

## Stage 5 — Frontend: Next.js 14 → 15 + React 18.3
**Risk: Medium** | **Status: Completed**

- `next` 14.0.4 → 15.x (latest v15)
- `react` / `react-dom` 18.2 → 18.3 (React 19 not yet — Next 15 supports 18.3+)
- `eslint-config-next` 14.0 → 15.x
- `@types/react` / `@types/react-dom` stay on 18.x

**Code changes (Next 15 breaking changes):**
- `fetch()` requests no longer cached by default — review any fetch calls in `sanity/calls.tsx` that relied on implicit caching
- `params` and `searchParams` in page/layout components are now async (need `await`)
  - Update all `app/[locale]/` page files: `params` → `await params`
- Run Next.js codemod: `npx @next/codemod@latest upgrade`
- Review `next.config.js` — may need rename to `next.config.ts` (optional)

**Verify:** `npm run dev` + `npm run build` — all pages render, locale routing works, Sanity data loads, contact form works

---

## Stage 6 — Frontend: React 19 + Next.js 16
**Risk: Medium-High** | **Status: Completed**

- `next` 15.3 → 16.1.6
- `react` / `react-dom` 18.3 → 19.2
- `@types/react` 18.3 → 19.x (moved to devDependencies)
- `@types/react-dom` 18.3 → 19.x (moved to devDependencies)
- `@types/node` 20.x → 22.x (moved to devDependencies)
- `eslint-config-next` 15.x → 16.x
- `eslint` 8.x → 9.x
- `typescript` 5.2 → 5.9
- Replaced `next-sanity` with `@sanity/client` (only `createClient` was used; avoids heavy peer dep chain)

**Code changes:**
- `middleware.ts` → `proxy.ts`: renamed file + `middleware()` → `proxy()` (Next.js 16 breaking change)
- `.eslintrc.json` → `eslint.config.mjs`: migrated to ESLint flat config (native `eslint-config-next` v16 flat export)
- `package.json`: lint script `next lint` → `eslint .`
- `sanity/client.tsx`: `import { createClient } from "next-sanity"` → `from "@sanity/client"`
- `shared/components/BlockContent.tsx`: removed spurious second parameter from `code` handler (React 19 type strictness)
- `shared/components/Section.tsx`: `JSX.Element` → `React.ReactNode` (global JSX namespace removed in React 19)
- `shared/components/ExternalScripts.tsx` + `Header.tsx`: suppressed new `react-hooks/set-state-in-effect` rule for intentional patterns
- `tsconfig.json`: auto-updated by Next.js (`jsx: "react-jsx"`, added `.next/dev/types/**/*.ts`)

**Verify:** `npm run build` succeeds, `npm run lint` passes (0 errors, 10 pre-existing warnings)

---

## Stage 7 — Frontend: @portabletext/react v6 + remove next-sanity-client
**Risk: Low** | **Status: Completed**

- `@portabletext/react` 3.0 → 6.0
- Removed `next-sanity-client` — consolidated all fetching onto `@sanity/client`

**Code changes:**
- `package.json`: bumped `@portabletext/react` ^3.0.7 → ^6.0.0, removed `next-sanity-client`
- `sanity/client.tsx`: removed `next-sanity-client` import + `SanityClient` instance, renamed `regularClient` → `client` (single `@sanity/client` export)
- `shared/components/BlockContent.tsx`: `regularClient` → `client` import
- 11 page/route files (17 call sites): converted `client.fetch({ query, config })` → `client.fetch(query, {}, { next: { revalidate: 60 } })` (positional args)
- `app/api/sanity/route.tsx`: converted batch proxy `client.fetch(request)` → `client.fetch(request.query, request.params || {}, request.config)`

**Verify:** `npm run build` succeeds, `npm run lint` passes (0 errors, 10 pre-existing warnings)

---

## Stage 8 — CMS: ESLint upgrade (ESLint 9 + Flat Config)
**Risk: Low-Medium** | **Status: Completed**

- `eslint` 8.57 → 9.x
- `@sanity/eslint-config-studio` 3.0 → 6.0
- Migrated `.eslintrc` → `eslint.config.mjs` (flat config)
- Added `"lint": "eslint ."` script to `package.json`

**Verify:** `npm run lint` passes (0 errors, 1 pre-existing warning)

---

## General Process Per Stage
1. Create a git branch (or commit on current branch)
2. Update `package.json` versions
3. `rm -rf node_modules package-lock.json && npm install`
4. Make required code changes
5. Test: dev server + build
6. Commit with descriptive message
7. Move to next stage

## Rollback Strategy
Each stage is committed separately. If a stage breaks things:
- `git revert` the commit, or
- `git checkout` the previous commit
- Reinstall: `rm -rf node_modules && npm install`
