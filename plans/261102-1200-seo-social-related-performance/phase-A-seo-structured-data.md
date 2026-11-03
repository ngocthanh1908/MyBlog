# Phase A: SEO Structured Data & Sitemap Enhancements

**Priority:** HIGH | **Status:** done | **Depends on:** none

## Overview
Enrich existing JSON-LD and the sitemap. The site already has a minimal
`Person` and `BlogPosting` JSON-LD (`src/lib/structured-data.ts:1-35`) wired
into `src/app/layout.tsx:51-54` and `src/app/blog/[slug]/page.tsx:97-102`, and
a working `sitemap.ts`/`robots.ts`. This phase deepens the JSON-LD and adds
crawlable tag-archive URLs to the sitemap — it does not introduce new routes
or frontmatter fields.

## Key Insights
- `personJsonLd()` and `blogPostJsonLd()` already exist and are already
  rendered (`src/app/layout.tsx:51-54`, `src/app/blog/[slug]/page.tsx:97-102`).
  There is no `WebSite` or `BreadcrumbList` JSON-LD yet.
- `blogPostJsonLd()` (`src/lib/structured-data.ts:17-35`) is missing: `image`,
  `dateModified`, `keywords`/`articleSection`, `publisher`, `inLanguage`,
  `mainEntityOfPage`. No post sets `coverImage` today (`src/content/blog/*.mdx`
  only have title/date/tags/excerpt), so `image` must fall back to the existing
  OG image route (`src/app/og/route.tsx`), never fabricate a URL to a file that
  doesn't exist.
- `frontmatterSchema` (`src/lib/mdx-utils.ts:9-16`) has no "updated" field, so
  `dateModified` must reuse `date` — do not invent a field.
- `getAllTags()` (`src/lib/mdx-utils.ts:164-173`) already exists and is used by
  `tag-filter.tsx` to drive `/blog?tag=<tag>` (`src/components/blog/tag-filter.tsx:30-36`).
  These tag-filtered views are real, crawlable, bookmarkable URLs (same page,
  different query param) but are absent from `sitemap.ts` — this is the
  "sitemap enhancement."
- `robots.ts` (`src/app/robots.ts:1-9`) is already correct; no change needed.
- `site-config.ts` (`src/lib/site-config.ts:1-18`) has `siteUrl` and
  `socialLinks` but no Twitter/X handle — do not add a `sameAs` entry for a
  platform the user has no account on.

## Requirements
### Functional
- `websiteJsonLd()`: new function, `WebSite` schema with `name`, `url`,
  `inLanguage: "vi-VN"`. No `potentialAction`/`SearchAction` — the blog has no
  server-side search route (`SearchBox` is Pagefind client-side only), so
  adding a `SearchAction` URL would describe a contract that doesn't exist.
- `breadcrumbJsonLd(post)`: new function, `BreadcrumbList` with 3 items —
  Home (`siteUrl`) → Blog (`siteUrl/blog`) → post title (`siteUrl/blog/{slug}`).
- `blogPostJsonLd(post)`: extend with `dateModified` (= `date`), `image`
  (`{siteUrl}/og?title=...&description=...`, mirroring the existing OG URL
  construction in `src/app/blog/[slug]/page.tsx:59-65`), `keywords` (post.tags
  joined), `articleSection` (post.tags[0]), `inLanguage: "vi-VN"`,
  `mainEntityOfPage: {"@type": "WebPage", "@id": url}`, `publisher` (reuse the
  same Person shape as `personJsonLd()`).
- `layout.tsx`: render `websiteJsonLd()` as a second `<script>` tag next to the
  existing `personJsonLd()` script.
- `blog/[slug]/page.tsx`: render `breadcrumbJsonLd(post)` as a second
  `<script>` tag next to the existing `blogPostJsonLd(post)` script.
- `sitemap.ts`: add one entry per tag from `getAllTags()`, URL
  `${baseUrl}/blog?tag=${encodeURIComponent(tag)}`, `changeFrequency: "weekly"`,
  `priority: 0.5`.

### Non-functional
- No new dependencies.
- No change to `frontmatterSchema` or any API route (public contract preserved).

## Architecture
All JSON-LD stays as plain object-returning functions in
`src/lib/structured-data.ts`, rendered via the existing
`<script type="application/ld+json" dangerouslySetInnerHTML>` pattern already
used twice in the codebase — no new rendering mechanism introduced.

```
layout.tsx        renders: personJsonLd() + websiteJsonLd()
blog/[slug]/page  renders: blogPostJsonLd(post) + breadcrumbJsonLd(post)
sitemap.ts        yields: static pages + posts + per-tag archive URLs
```

## Related Code Files
### Modify
- `src/lib/structured-data.ts` — add `websiteJsonLd()`, `breadcrumbJsonLd()`,
  extend `blogPostJsonLd()`.
- `src/app/layout.tsx` — add second JSON-LD `<script>` (lines 51-54 region).
- `src/app/blog/[slug]/page.tsx` — add second JSON-LD `<script>` immediately
  after the existing one (lines 97-102 region only — **do not touch any other
  part of this file in this phase**; Phases B/C/D own the rest).
- `src/app/sitemap.ts` — add per-tag entries using `getAllTags()`.
- `src/__tests__/lib/structured-data.test.ts` — extend for new/enriched
  functions.

### Create
- `src/__tests__/lib/sitemap.test.ts` — new, following the no-mock pattern
  used in `src/__tests__/lib/mdx-utils.test.ts` (reads the real
  `src/content/blog/*.mdx` files).

## Implementation Steps
1. Write/extend tests first: `structured-data.test.ts` (new fields +
   `websiteJsonLd`/`breadcrumbJsonLd`), new `sitemap.test.ts` asserting the
   returned array contains one entry per `getAllTags()` tag.
2. Implement `websiteJsonLd()` and `breadcrumbJsonLd(post)` in
   `structured-data.ts`.
3. Extend `blogPostJsonLd(post)` with the new fields listed above.
4. Add the `websiteJsonLd()` script tag in `layout.tsx`.
5. Add the `breadcrumbJsonLd(post)` script tag in `blog/[slug]/page.tsx`
   (same region as the existing script, no other edits to this file).
6. Add per-tag sitemap entries in `sitemap.ts`.
7. Run `npm run test` and `npm run lint`; fix regressions.
8. Manually verify with Google's Rich Results Test (paste rendered HTML) —
   optional, not blocking since no live deploy is touched here.

## Todo
- [x] `websiteJsonLd()` implemented + tested
- [x] `breadcrumbJsonLd()` implemented + tested
- [x] `blogPostJsonLd()` enriched + tested
- [x] `layout.tsx` renders `websiteJsonLd()`
- [x] `blog/[slug]/page.tsx` renders `breadcrumbJsonLd()`
- [x] `sitemap.ts` includes per-tag URLs
- [x] `sitemap.test.ts` created
- [x] `npm run test` and `npm run lint` pass

## Success Criteria
- `npm run test` passes with new/updated structured-data and sitemap tests.
- `GET /sitemap.xml` (or the `sitemap()` function output) contains one URL per
  tag returned by `getAllTags()`, in addition to existing entries.
- Rendered `/blog/[slug]` HTML contains two `application/ld+json` scripts
  (BlogPosting + BreadcrumbList); rendered root layout contains two
  (Person + WebSite).

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Fabricating an `image`/search URL that doesn't resolve | Medium | Low (soft SEO penalty, not a bug) | Reuse the real `/og` route exactly as `generateMetadata` already does; never invent a `SearchAction` URL |
| Sitemap grows unbounded if tag count grows | Low | Low | `getAllTags()` is already deduplicated; acceptable (YAGNI — paginate only if it becomes a real problem) |
| Edit collision with Phase B/C on the same file | High (by design) | Medium | Phases run strictly sequentially (A→B→C→D); this phase only touches the lines 97-102 region |

## Rollback
Revert the 4 modified files and delete `sitemap.test.ts` — no schema/DB/route
changes, so rollback is a pure code revert with no data migration.
