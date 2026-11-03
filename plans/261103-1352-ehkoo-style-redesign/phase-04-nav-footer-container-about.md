# Phase 4 — Nav, footer, container, about

## Context
`max-w-[820px] mx-auto px-6` is hard-coded in navbar, footer, home, blog, about and others. Navbar is tall (avatar + name + subtitle, `py-10 pb-7`). Footer is 3 stacked blocks.

## Requirements
- Add `.site-container` (max-width 960px, centered, 24px gutter) in `src/styles/globals.css`; replace hard-coded 820px wrappers in layout shell and the pages touched in this plan. Do not touch `/blog/[slug]` reading column (prose width stays narrow); grep before replacing.
- Navbar: single compact row — text wordmark left, links + theme toggle right, thin bottom border; mobile menu unchanged in behavior. Drop the subtitle line from the bar (keep `siteConfig.subtitle` for metadata).
- Footer: one centered line `© year name` plus the existing social links inline; remove the "Minimalist & Human-Centric Design" line.
- About page: use `.site-container`, match heading style; content unchanged.

## Files
- modify `src/styles/globals.css`, `src/components/layout/navbar.tsx`, `src/components/layout/footer.tsx`, `src/app/about/page.tsx`, `src/app/page.tsx`, `src/app/blog/page.tsx`
- check (grep `820px`) `src/app/projects/page.tsx`, `src/app/habits/page.tsx`: update only for shell consistency

## Steps
1. Add class, swap wrappers.
2. Rework navbar + footer markup; keep `aria-label`s, admin bar, theme toggle.
3. Check mobile menu still opens/closes; check `blog/[slug]` unaffected.

## Validation
Manual at 375/768/1280, light + dark; `npm run lint`; `npx vitest run`.

## Risk / rollback
Visual-only. Single git revert of this phase's commit.
