# Phase A — SEO Structured Data & Sitemap — Implementation Report

**Status:** DONE
**Date:** 2026-11-03

## Summary
Implemented Phase A exactly as specified: added `websiteJsonLd()` and
`breadcrumbJsonLd(post)` to `src/lib/structured-data.ts`, enriched
`blogPostJsonLd(post)` with `dateModified`, `image` (via the existing `/og`
route), `keywords`, `articleSection`, `inLanguage`, `mainEntityOfPage`, and a
shared `publisher` Person reference. Wired `websiteJsonLd()` into
`src/app/layout.tsx` (second `<script>` next to `personJsonLd()`) and
`breadcrumbJsonLd(post)` into `src/app/blog/[slug]/page.tsx` (second
`<script>` immediately after the existing `blogPostJsonLd(post)` script — no
other region of that file touched). Added per-tag archive URLs
(`/blog?tag=...`, weekly, priority 0.5) to `src/app/sitemap.ts` using the
existing `getAllTags()`.

## Files Modified
- `src/lib/structured-data.ts` (94 lines)
- `src/app/sitemap.ts` (30 lines)
- `src/app/layout.tsx` (75 lines) — JSON-LD head region only
- `src/app/blog/[slug]/page.tsx` (160 lines) — JSON-LD script region only (lines ~97-108), no other edits
- `src/__tests__/lib/structured-data.test.ts` (127 lines) — extended with tests for `websiteJsonLd()`, `breadcrumbJsonLd()`, and the new `blogPostJsonLd()` fields

## Files Created
- `src/__tests__/lib/sitemap.test.ts` (52 lines) — no-mock, reads real content via `getAllPosts()`/`getAllTags()`

## Tasks Completed
- [x] `websiteJsonLd()` implemented + tested
- [x] `breadcrumbJsonLd()` implemented + tested
- [x] `blogPostJsonLd()` enriched + tested
- [x] `layout.tsx` renders `websiteJsonLd()`
- [x] `blog/[slug]/page.tsx` renders `breadcrumbJsonLd()`
- [x] `sitemap.ts` includes per-tag URLs
- [x] `sitemap.test.ts` created
- [x] `npm run test` and `npm run lint` pass

## Tests Status
- Type check / build: not run as a separate step (not required by this phase's gates); `npm run lint` includes TS-aware ESLint rules and passed clean.
- Unit tests: PASS — `npm run test` → 10 test files, 60 tests passed (includes the 2 new/extended files).
- Lint: PASS — `npm run lint` clean, no errors or warnings.

## Deviations / Notes
- `blogPostJsonLd()`'s parameter type gained a required `tags: string[]` field (it already existed on the real `BlogPost` type and was already passed by both callers — `blog/[slug]/page.tsx` and the test's `samplePost`); no public contract changed, since every real caller already supplies `tags`.
- No `potentialAction`/`SearchAction` added to `websiteJsonLd()`, no `sameAs` Twitter/X entry, no `coverImage`/image-sitemap work, and no `robots.ts` change — all per the phase file's explicit non-goals.
- Did not run the optional manual Google Rich Results Test step (step 8) — explicitly optional/non-blocking per the phase file.

## Environment Note
This agent session's runtime context (SubagentStart hook) reported a different
primary working directory (`C:\Software Development\DBOUT_V2`) than the one
specified in the task (`C:\Software Development\MyBlog - ClaudeCode`). Verified
the target path exists on disk and proceeded using absolute paths per the
task's explicit instructions; flagging this mismatch for visibility in case it
indicates a misconfigured spawn.

## Next Steps
Phase A is done. Per `plan.md`, Phase B (Related Articles) depends on Phase A
and shares `src/app/blog/[slug]/page.tsx` — it should run next, and must only
touch the regions it owns (not the JSON-LD script region added here).
