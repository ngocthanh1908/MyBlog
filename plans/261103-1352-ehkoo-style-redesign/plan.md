---
status: pending
created: 2026-11-03
title: Ehkoo-style site redesign (topic blocks, optional cover images)
phases: 5
mode: fast
---

# Ehkoo-style redesign

Restyle the whole site after https://ehkoo.com/ (structure only: topic blocks, featured card + related list, slim nav, one-line footer). No Ehkoo assets, logo or copy are reused.

## Contract
- **Outcome:** home page shows one block per topic (tag). Each block = featured card (16:9 cover, title, excerpt, date) + "Bài cùng chủ đề" list of up to 5 links. Slim nav, one-line footer, same container/typography across home, blog index, about.
- **Constraints:** Next.js 15 + Tailwind 4 as-is; keep dark mode, admin, MDX/DB merge, SEO/JSON-LD; CSP `img-src 'self' data: blob:` stays (local images only); cover comes from existing `coverImage` field (already in zod schema + DB, rendered nowhere today).
- **Non-goals:** MDX/admin changes, `/blog/[slug]` layout, new image pipeline, Ehkoo colors/fonts (unverified; keep current green accent + Newsreader/Plus Jakarta).
- **Acceptance:** blocks render with and without `coverImage` without layout shift; responsive 375/768/1280; dark mode ok; `npm test`, `npm run lint`, `npm run build` pass.

## Decisions (made by planner, flag if wrong)
- (Revised by user 2026-11-03) A post appears in the block of **every** tag; a leading "Tất cả" block lists all posts. Tag blocks ordered by post count desc, then newest post date.
- Fallback when no `coverImage`: gradient from accent tokens + large tag label (no file needed).
- `/` = topic blocks. `/blog` = flat archive (search + tag filter) with small cover thumbnail. Distinct purposes.
- Cover rendered with plain `<img>` (fixed `aspect-video`, `loading="lazy"`, `decoding="async"`): uploads land in `public/uploads` at runtime and standalone `next/image` optimization of those is unverified. Recommend authors upload pre-optimized WebP.
- Shared container class replaces hard-coded `max-w-[820px]`; width widens to 960px so a card + list sit side by side on desktop.

## Phases
| # | Title | Status | Depends |
|---|-------|--------|---------|
| 1 | [Group posts by topic](phase-01-group-posts-by-topic.md) | pending | none |
| 2 | [Post cover with fallback](phase-02-post-cover-with-fallback.md) | pending | none |
| 3 | [Home topic blocks + blog index](phase-03-home-topic-blocks-and-blog-index.md) | pending | 1, 2 |
| 4 | [Nav, footer, container, about](phase-04-nav-footer-container-about.md) | pending | 3 |
| 5 | [Verify, review, docs](phase-05-verify-review-docs.md) | pending | 4 |

Run sequentially. 1 and 2 touch disjoint files and could parallelize, but the work is small; keep sequential.

## Open questions
- Screenshot of Ehkoo (colors/fonts) would allow closer match; not required.
