---
title: "Next.js 15 Personal Brand Website with Bento Grid"
description: "Initialize Next.js 15 project and build Bento Grid homepage for personal brand (Tailscale-style)"
status: complete
priority: P1
effort: 16h
tags: [frontend, nextjs, tailwind, feature]
created: 2026-04-02
---

# Next.js 15 Personal Brand Website with Bento Grid

## Overview

Greenfield Next.js 15 personal brand site: Portfolio, Blog (MDX), Bento Grid homepage. Tailscale-inspired minimalist design with Light/Dark mode. Self-hosted (standalone output).

## Tech Stack

Next.js 15 | React 19 | Tailwind CSS 4 | Framer Motion 12 | MDX (next-mdx-remote) | next-themes | Lucide React | Geist font

## Phases

| # | Phase | Status | Effort | Link |
|---|-------|--------|--------|------|
| 1 | Project Setup & Config | Complete | 2h | [phase-01](./phase-01-project-setup.md) |
| 2 | Layout Shell (Navbar + Footer) | Complete | 3h | [phase-02](./phase-02-layout-shell.md) |
| 3 | Bento Grid Homepage | Complete | 4h | [phase-03](./phase-03-bento-grid-homepage.md) |
| 4 | Blog System (MDX) | Complete | 4h | [phase-04](./phase-04-blog-mdx-system.md) |
| 5 | SEO & Performance | Complete | 3h | [phase-05](./phase-05-seo-performance.md) |

## Dependencies

- Phase 1 → unlocks all others
- Phase 2 → required before Phase 3 (layout wraps pages)
- Phase 3 → standalone (after Phase 2)
- Phase 4 → standalone (after Phase 2), Blog Preview card in Phase 3 uses placeholder initially
- Phase 5 → after Phase 3 & 4 complete

## Key References

- [System Spec](../../system.md) — full design spec
- [Brainstorm Report](../reports/brainstorm-260402-0003-nextjs-bento-grid-homepage.md) — decisions & rationale

## Red Team Review

### Session — 2026-04-02
**Findings:** 15 (14 accepted, 1 rejected)
**Severity breakdown:** 3 Critical, 7 High, 4 Medium

| # | Finding | Severity | Disposition | Applied To |
|---|---------|----------|-------------|------------|
| 1 | `create-next-app` fails in non-empty dir | Critical | Accept | Phase 1 |
| 2 | Tailwind v4 config + typography incompatible with v3 scaffold | Critical | Accept | Phase 1 |
| 3 | MDX slug path traversal — no sanitization | Critical | Accept | Phase 4 |
| 4 | Standalone output missing content/blog MDX files | High | Accept | Phase 1, 4 |
| 5 | next-mdx-remote RSC: must use compileMDX/rsc | High | Accept | Phase 4 |
| 6 | Dynamic OG image fails on self-hosted | High | Accept | Phase 5 |
| 7 | Nav links (Projects, About, Habits) → 404 | High | Accept | Phase 2 |
| 8 | Framer Motion ssr:false contradicts CLS + SEO | High | Accept | Phase 3, 5 |
| 9 | Tag filtering architecture undefined | High | Accept | Phase 4 |
| 10 | No CSP/security headers | High | Accept | Phase 1 |
| 11 | No dependency version pinning | High | Reject | package-lock.json suffices |
| 12 | MDX renders arbitrary code — no allowlist | Medium | Accept | Phase 4 |
| 13 | Hardcoded metadataBase URL | Medium | Accept | Phase 1, 5 |
| 14 | No MDX frontmatter validation | Medium | Accept | Phase 4 |
| 15 | Mobile menu missing a11y | Medium | Accept | Phase 2 |

## Validation Log

### Session 1 — 2026-04-02
**Trigger:** Post red-team validation before implementation
**Questions asked:** 6

#### Questions & Answers

1. **[Tradeoff]** Tailwind v4 vs v3?
   - Options: v4 (Recommended) | v3 | v4 with v3 fallback
   - **Answer:** Tailwind v4
   - **Rationale:** Plan already has upgrade steps from red team. Commit to v4.

2. **[Architecture]** Mobile menu: custom vs Radix Dialog vs Headless UI?
   - Options: Custom | Radix Dialog (Recommended) | Headless UI
   - **Answer:** Custom implementation
   - **Rationale:** User prefers no extra dep. Manual focus trap + scroll lock + aria.

3. **[Scope]** Placeholder pages for /projects, /about, /habits?
   - Options: Minimal (Recommended) | Skeleton layout | Skip
   - **Answer:** Minimal (heading + "Coming soon")
   - **Rationale:** Quick fix to prevent 404s. Content added later.

4. **[Tradeoff]** Framer Motion vs CSS-only vs motion.dev?
   - Options: Framer Motion + LazyMotion (Recommended) | CSS-only | motion.dev
   - **Answer:** Framer Motion + LazyMotion
   - **Rationale:** Rich API, gesture support, future-proof. LazyMotion reduces bundle.

5. **[Architecture]** Draft posts support?
   - Options: Yes via frontmatter (Recommended) | No | Separate directory
   - **Answer:** Yes, via `draft: true` frontmatter flag
   - **Rationale:** Simple, filter in getAllPosts(). Show drafts in dev only.

6. **[Risk]** Domain ownership (thanh.dev)?
   - Options: Own it | Not yet | Different domain
   - **Answer:** Different domain
   - **Rationale:** Use env var `NEXT_PUBLIC_SITE_URL`. Default to localhost in dev. No hardcoded domain.

#### Confirmed Decisions
- Tailwind v4: commit to CSS-first config with @theme
- Custom mobile menu: no Radix/Headless UI dependency
- Minimal placeholders: heading + "Coming soon" for unbuilt pages
- Framer Motion + LazyMotion: keep for animations
- Draft posts: frontmatter `draft: true`, filter in production
- Domain: env var only, no hardcoded domain

#### Impact on Phases
- Phase 1: siteUrl defaults to localhost, not thanh.dev [V#6]
- Phase 2: Custom a11y for mobile menu (no Radix) [V#2]
- Phase 2: Minimal placeholder pages [V#3]
- Phase 4: Add draft field to Zod schema + filter logic [V#5]
