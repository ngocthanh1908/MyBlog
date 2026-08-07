---
title: "Content Pages, OG Images & Testing"
description: "Implement About/Projects/Habits pages, dynamic OG images, Vitest setup, and deployment config"
status: pending
priority: P1
effort: 12h
branch: master
tags: [content, og-images, testing, deployment]
created: 2026-04-02
---

# Content Pages, OG Images & Testing

## Overview
Replace placeholder "Coming soon" pages with real content, add dynamic OG image generation, set up testing, and finalize deployment config.

## Architecture Decisions
- **Data files in `src/data/`** — JSON-like TS exports for about/projects/habits (type-safe, no DB needed)
- **OG images via `next/og` ImageResponse** — Node.js runtime (not Edge), works with standalone output
- **Vitest + RTL** — lightweight, fast, Vite-compatible with Next.js
- **Standalone Docker** — already configured in next.config.ts

## Dependency Graph
```
Phase 1 (About) ──┐
Phase 2 (Projects) ├── Phase 4 (OG Images) ── Phase 6 (Deployment)
Phase 3 (Habits) ──┘         │
                    Phase 5 (Testing) ──────────┘
```

## Phases

| # | Phase | File | Status | Effort |
|---|-------|------|--------|--------|
| 1 | About Page | [phase-01](phase-01-about-page.md) | Pending | 1.5h |
| 2 | Projects Page | [phase-02](phase-02-projects-page.md) | Pending | 1.5h |
| 3 | Habits Page | [phase-03](phase-03-habits-page.md) | Pending | 2h |
| 4 | Dynamic OG Images | [phase-04](phase-04-dynamic-og-images.md) | Pending | 2.5h |
| 5 | Testing Setup | [phase-05](phase-05-testing-setup.md) | Pending | 2.5h |
| 6 | Deployment & README | [phase-06](phase-06-deployment-readme.md) | Pending | 2h |

## Rollback Strategy
Each phase is an independent commit. Revert any phase without affecting others (phases 1-3 are fully independent; phase 4 depends on page metadata only).

## Backwards Compatibility
No breaking changes. Existing blog, homepage, layout untouched. New data files are additive.

## File Ownership (No Conflicts)
- Phase 1: `src/data/about-data.ts`, `src/app/about/page.tsx`
- Phase 2: `src/data/projects-data.ts`, `src/app/projects/page.tsx`, `src/components/projects/*`
- Phase 3: `src/data/habits-data.ts`, `src/app/habits/page.tsx`, `src/components/habits/*`
- Phase 4: `src/app/og/[...path]/route.tsx`
- Phase 5: `vitest.config.ts`, `src/__tests__/*`
- Phase 6: `Dockerfile`, `README.md`, `.dockerignore`
