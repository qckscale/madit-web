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
**Risk: Medium** | **Status: Not started**

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
**Risk: Medium-High** | **Status: Not started**

- `next` 15.x → 16.1
- `react` / `react-dom` 18.3 → 19.2
- `@types/react` → 19.x
- `@types/react-dom` → 19.x
- `eslint-config-next` 15.x → 16.x
- `typescript` 5.2 → 5.9
- `@types/node` 20.x → 22.x+ (match Node version)

**Code changes:**
- Run codemod: `npx @next/codemod@latest upgrade`
- React 19 type changes: `React.FC` no longer includes implicit `children` — check all components
- Review `useState` setter functions (React 19 batches differently in some edge cases)
- Update `tsconfig.json` if needed

**Verify:** `npm run dev` + `npm run build` — full site functional, all interactive components (header scroll, cookie consent, contact form)

---

## Stage 7 — Frontend: next-sanity + @portabletext/react
**Risk: Medium** | **Status: Not started**

- `next-sanity` 7.0 → 12.1
- `@portabletext/react` 3.0 → 6.0

**Code changes:**
- `sanity/client.tsx`: next-sanity API may have changed — review `createClient` import and options
- Consider removing `next-sanity-client` if `next-sanity` 12.x covers its functionality
- `shared/components/BlockContent.tsx`: review PortableText component API for v6 changes (component signatures may differ)
- Review `sanity/calls.tsx` for any query helper changes

**Verify:** All pages with Sanity content render correctly, rich text (block content) renders with images and code blocks, preview/draft mode works if used

---

## Stage 8 — Both: ESLint 10 (optional, lowest priority)
**Risk: Low-Medium** | **Status: Not started**

- `eslint` 8 → 10 (both projects)
- `@sanity/eslint-config-studio` 3.0 → 6.0
- `eslint-config-next` → latest

**Code changes:**
- ESLint 10 uses flat config by default — migrate `.eslintrc` to `eslint.config.js`
- Update any custom rules

**Verify:** `npm run lint` passes in both projects

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
