---
status: pending
created: 2026-08-07
title: CMS Expansion v2 — Media Library, Markdown Editor, Tag Management, Auth Hardening
phases: 4
source: plans/reports/brainstorm-260807-1518-cms-expansion-v2.md
---

# CMS Expansion v2

4 phases, each independently deployable. Solo-author Next.js blog with SQLite.

## Phases

| Phase | Title | Status | Dependencies |
|-------|-------|--------|--------------|
| A | [Media Library](phase-A-media-library.md) | pending | none |
| B | [Markdown Editor](phase-B-markdown-editor.md) | pending | Phase A (image picker) |
| C | [Tag Management](phase-C-tag-management.md) | pending | none |
| D | [Auth Hardening](phase-D-auth-hardening.md) | pending | none |

## Key Files
- `src/lib/db.ts` — DB layer
- `src/lib/auth-utils.ts` — JWT auth
- `src/app/api/upload/route.ts` — existing upload endpoint
- `src/app/admin/page.tsx` — admin shell
- `src/components/admin/article-form.tsx` — post editor form
- `src/components/admin/article-list.tsx` — post list

## Constraints
- Solo author, no multi-user
- SQLite (better-sqlite3), no Postgres
- Keep bundle size small (lazy load heavy components)
- All API routes auth-guarded via JWT Bearer
