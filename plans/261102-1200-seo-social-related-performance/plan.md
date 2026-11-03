---
status: pending
created: 2026-11-02
title: Phase 5 (subset) — SEO Structured Data, Share Buttons, Related Articles, Core Web Vitals
phases: 4
source: docs/project-roadmap.md (Phase 5: Content & Feature Expansion)
---

# Phase 5 Subset — SEO, Social Share, Related Articles, Performance

Implements the 4 Phase 5 items that need no personal accounts/credentials/content
from the user: JSON-LD + sitemap enhancements, share buttons, related articles,
and a Core Web Vitals pass. Excludes (handled separately): writing articles,
newsletter integration, Google Analytics — all three require user-supplied
accounts or content and are out of scope here.

## Phases

| Phase | Title | Status | Dependencies |
|-------|-------|--------|--------------|
| A | [SEO Structured Data & Sitemap](phase-A-seo-structured-data.md) | done | none |
| B | [Related Articles](phase-B-related-articles.md) | done | Phase A (shares `blog/[slug]/page.tsx`) |
| C | [Social Share Buttons](phase-C-social-share-buttons.md) | done | Phase B (shares `blog/[slug]/page.tsx`) |
| D | [Performance / Core Web Vitals](phase-D-performance-optimization.md) | skipped (user decision 2026-11-02: keep the fade-in animation, trade off CWV gain) | Phase A, B, C (audits final page composition) |

**Run phases strictly in order A → B → C → D.** All four touch
`src/app/blog/[slug]/page.tsx`; see "File Ownership" below. Do not parallelize.

## Key Files (touched by more than one phase)
- `src/app/blog/[slug]/page.tsx` — touched by **all 4 phases** (JSON-LD scripts,
  related-articles section, share buttons, dynamic-import conversion). This is
  the single collision point in this plan.
- `src/lib/mdx-utils.ts` — touched by Phase B only (new `getRelatedPosts()`).
- `src/lib/structured-data.ts` — touched by Phase A only.
- `src/app/sitemap.ts` — touched by Phase A only.
- `src/styles/globals.css` — touched by Phase D only.

## File Ownership (no two phases run in parallel on the same file)
Because every phase edits `blog/[slug]/page.tsx`, phases are sequential, not
parallel. Each phase file below states the exact hunk/region it owns in that
file so phase D (performance) can be reasoned about last, after the DOM shape
from A–C is final.

## Non-Goals (explicitly excluded per task scope)
- Writing the 10+ blog articles.
- Email newsletter integration (needs ESP + account).
- Google Analytics integration (needs tracking ID).
- Adding a `coverImage` to existing posts or wiring image-sitemap extensions —
  no current post sets `coverImage` (`src/lib/mdx-utils.ts:14`), so this would
  be speculative (YAGNI); skipped.
- Changing `robots.ts` — already correct (`src/app/robots.ts:1-9`), no gap found.
- Introducing Lighthouse CI tooling/infra — out of scope ("app-code only, no
  infra changes"); Phase D instead documents a manual Lighthouse validation
  step and fixes code-level issues found by direct inspection.

## Constraints
- No `.env`, secrets, or deployment/infra changes.
- Preserve existing public contracts (routes, API shapes, DB schema, frontmatter
  schema) — no new frontmatter fields, no new API routes.
- Files under 200 lines per `.claude/rules/development-rules.md`; split new
  components if they grow past that.
- TDD: tests created/updated alongside (not after) each implementation step.
- `npm run test` and `npm run lint` must pass before a phase is considered done.
