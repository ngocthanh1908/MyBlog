# Phase D: Performance Optimization (Core Web Vitals)

**Priority:** HIGH | **Status:** pending | **Depends on:** Phase A, B, C (audits the final page composition)

## Overview
Targets the roadmap's stated metrics (`docs/project-roadmap.md:262-266`:
LCP < 2.5s, CLS < 0.1, FCP < 1.5s, Lighthouse 90+). Runs last because it audits
the DOM shape produced by Phases A–C (related articles + share buttons now
exist on the page). Fixes 2 concrete, already-verified issues rather than
speculative "best practices" (YAGNI) — this blog is 2 posts, no hero images,
and no next/image usage anywhere yet, so most generic image-optimization
advice does not apply.

## Key Insights (verified by direct inspection, not assumption)
- **Confirmed CLS/LCP-delaying entrance animation**: `.animate-slide-up`
  (`src/styles/globals.css:92-98`) animates `opacity: 0 → 1` and
  `transform: translateY(12px) → 0` over 0.35s. It is applied to the outer
  wrapper `<div>` of `src/app/page.tsx:12`, `src/app/blog/page.tsx:15`, and
  `src/app/blog/[slug]/page.tsx:96` — i.e. every page's entire content,
  including the H1/hero text that is the LCP candidate on each of these
  routes. A transform/opacity entrance animation on first paint is a known,
  measurable way to both delay the browser's LCP timestamp (the paint isn't
  "final" until the animation settles) and contribute to Cumulative Layout
  Shift, directly working against the roadmap's own LCP/CLS targets.
- **No raw `<img>` to optimize on the hot paths**: `grep` confirms the only
  `<img>` usage is the MDX content renderer (`src/app/blog/[slug]/page.tsx:23-32`,
  already `loading="lazy"`) and `media-library.tsx` (admin-only, excluded —
  it's gated behind auth and not part of the public Core Web Vitals surface).
  `HeroSection` (`src/components/home/hero-section.tsx`) has no image. Adding
  `next/image` config now, with zero posts using `coverImage`, would be
  speculative — **not done** (YAGNI; revisit once a post actually ships a
  cover image).
- **Comments widget is already lazy**: `Giscus` already has `loading="lazy"`
  (`src/components/blog/comments-section.tsx:24`) — no further action needed
  there.
- **Fonts already optimal**: `next/font/google` with `display: "swap"` for all
  3 families (`src/app/layout.tsx:13-29`) — this is already the recommended
  pattern; no action needed.
- **New below-the-fold client components from Phases B/C are eagerly bundled**:
  `CommentsSection` (`"use client"`, pulls in `@giscus/react`) and the new
  `RelatedArticles`/`ShareButtons` are all imported statically at the top of
  `blog/[slug]/page.tsx`. `RelatedArticles`/`ShareButtons` are small and don't
  justify a dynamic-import split by themselves, but `CommentsSection` pulls in
  a real third-party widget bundle (`@giscus/react`) and is below the fold —
  converting it to `next/dynamic` with `ssr: false` removes that bundle from
  the page's initial JS without changing behavior (Giscus already lazy-loads
  its own iframe regardless).

## Requirements
### Functional
- Remove the opacity/transform entrance animation from the 3 page wrappers
  (`page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`) OR replace
  `.animate-slide-up` with a definition that doesn't touch `opacity`/`transform`
  on first paint (simplest, KISS choice: delete the `animate-slide-up`
  className usage on these 3 wrapper divs and drop the now-unused CSS rule —
  no visual regression beyond removing a cosmetic fade that actively works
  against the stated CWV targets). Keep `.animate-pulse-dot` — that's a
  separate, bounded, background-element animation and not an LCP candidate.
- Convert `<CommentsSection />` in `blog/[slug]/page.tsx` to a `next/dynamic`
  import with `ssr: false` (comments require `window`/DOM APIs for Giscus
  anyway, so disabling SSR for it is safe, not a behavior change).
- Add a short note (not a tool/infra change) in this phase file's validation
  section on how to run a manual Lighthouse check locally — no CI tooling
  added, per the "no infra changes" constraint.

### Non-functional
- No new dependency (`next/dynamic` is built into Next.js, already used
  implicitly elsewhere via App Router conventions).
- No change to visual design beyond removing the fade/slide-in (confirm with
  the user only if they push back after seeing the diff — this is a
  performance-vs-cosmetic trade-off explicitly called out here, not hidden).

## Architecture
```
Before: blog/[slug]/page.tsx statically imports CommentsSection (+ @giscus/react)
After:  blog/[slug]/page.tsx -> next/dynamic(() => import(".../comments-section"), { ssr: false })

Before: page.tsx / blog/page.tsx / blog/[slug]/page.tsx wrapper div className="... animate-slide-up"
After:  wrapper div className="..." (animation class removed)
```

## Related Code Files
### Modify
- `src/styles/globals.css` — remove the now-unused `.animate-slide-up` rule
  and its `@keyframes slideUp` (lines 92-98 region).
- `src/app/page.tsx` — remove `animate-slide-up` from the wrapper `className`.
- `src/app/blog/page.tsx` — remove `animate-slide-up` from the wrapper `className`.
- `src/app/blog/[slug]/page.tsx` — remove `animate-slide-up` from the wrapper
  `className` (line 96 region) AND convert the `CommentsSection` import to
  `next/dynamic` (import-statement region, line 7) — these are the only edits
  Phase D makes to this file; Phases A/B/C's regions (JSON-LD scripts, related
  articles, share buttons) are untouched.

### Create
- None.

## Implementation Steps
1. Run `npm run build` once before changes to capture a baseline bundle-size
   output (`.next` build log) for comparison — no new tooling, uses the
   existing build script.
2. Remove `.animate-slide-up` usage from the 3 wrapper divs; delete the CSS
   rule and keyframes from `globals.css`.
3. Convert `CommentsSection` to `next/dynamic` with `ssr: false` in
   `blog/[slug]/page.tsx`.
4. Run `npm run build` again; confirm the `blog/[slug]` route's First Load JS
   is equal or smaller than baseline (Next prints this per-route in the build
   output).
5. Run `npm run test` and `npm run lint`.
6. Manual validation (not automatable without infra access): run
   `npm run build && npm start`, then run Lighthouse (Chrome DevTools or
   `npx lighthouse http://localhost:3000` / `http://localhost:3000/blog/hello-world`)
   and confirm LCP/CLS/FCP are at or below the roadmap targets, or at least
   improved vs. a pre-change run. Record the before/after numbers in the PR
   description — this is a local, repeatable check, not new CI infra.

## Todo
- [ ] `.animate-slide-up` removed from `page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`
- [ ] Unused CSS rule/keyframes removed from `globals.css`
- [ ] `CommentsSection` converted to `next/dynamic({ ssr: false })`
- [ ] `npm run build` shows no First Load JS regression on `/blog/[slug]`
- [ ] `npm run test` and `npm run lint` pass
- [ ] Manual Lighthouse check recorded (before/after)

## Success Criteria
- `npm run build` output shows the `/blog/[slug]` route's First Load JS at or
  below its pre-change baseline.
- No `opacity`/`transform` entrance animation remains on the LCP candidate of
  `/`, `/blog`, or `/blog/[slug]`.
- Lighthouse (manual, local) reports LCP/CLS/FCP meeting or improving toward
  the roadmap's targets; exact pass/fail against "90+" is reported, not
  assumed.

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Removing the fade animation changes perceived UX/design intent | Medium | Low | Called out explicitly here as a trade-off per `review-audit-self-decision.md`; flag in the PR description so the user can request reverting just this one change if they value the cosmetic effect |
| `ssr: false` on `CommentsSection` causes a layout shift on hydration (empty space before mount) | Low | Medium (would ADD to CLS, defeating the purpose) | `CommentsSection` already renders its own heading (`<h2>Binh luan</h2>`, `comments-section.tsx:11`) outside the dynamically-loaded part if split correctly; verify in manual check that the heading renders immediately and only the Giscus iframe area is deferred |
| Edit collision with Phase A/B/C on the same file | High (by design) | Medium | Sequential execution; Phase D is last precisely so it edits only the import line and wrapper className, not the regions A/B/C already own |

## Rollback
Revert the 4 modified files. No stored data or schema involved; a straight
`git revert`-equivalent of this phase's diff fully restores prior behavior.
