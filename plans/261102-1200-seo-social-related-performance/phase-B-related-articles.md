# Phase B: Related Articles

**Priority:** MEDIUM | **Status:** done | **Depends on:** Phase A (shares `blog/[slug]/page.tsx`)

## Overview
Show a "related articles" list on the blog detail page, ranked by shared tags
with a recency fallback. No new data source — reuses `getAllPosts()`.

## Key Insights
- `BlogPost` type (`src/lib/mdx-utils.ts:18-30`) already has `slug`, `title`,
  `date`, `tags`, `excerpt` — everything needed for a related-posts card, no
  schema change required.
- Today there are only 2 posts (`src/content/blog/hello-world.mdx` tags
  `["AI", "SAP"]`, `src/content/blog/running-maf-method.mdx` tags
  `["Running", "Mindfulness"]`) with **zero tag overlap** — the recency
  fallback path is not a hypothetical edge case, it is the common case right
  now and must be exercised by tests.
- `getAllPosts()` (`src/lib/mdx-utils.ts:70-122`) already excludes drafts in
  production and merges MDX + DB posts — `getRelatedPosts` must reuse it
  rather than re-reading the filesystem/DB directly (DRY).
- `BlogCard` (`src/components/blog/blog-card.tsx`) is a `"use client"` component
  with admin-delete affordances not relevant here; related articles need a
  simpler, read-only card — do not reuse `BlogCard` as-is (it would drag in
  `isAdmin`/delete logic that doesn't apply on this page), build a small
  presentational component instead (KISS).

## Requirements
### Functional
- `getRelatedPosts(currentSlug, limit = 3)` in `src/lib/mdx-utils.ts`:
  1. Excludes the current post.
  2. Scores remaining posts by count of shared tags with the current post
     (descending).
  3. Ties (including the common "0 shared tags" case for everyone) broken by
     most recent `date` first.
  4. Returns at most `limit` posts.
  5. Returns `[]` if there are no other posts (do not throw).
- New `RelatedArticles` component renders a heading + up to 3 compact cards
  (title, date, excerpt) linking to `/blog/{slug}`; renders nothing (not even
  the heading) when the list is empty.
- Insert `<RelatedArticles posts={getRelatedPosts(slug)} />` into
  `blog/[slug]/page.tsx`, placed after the `<article>` block and before
  `<CommentsSection />` (new region, does not touch Phase A's lines 97-102).

### Non-functional
- Server-computed (no client fetch) — `getRelatedPosts` runs in the existing
  server component, same pattern as `getPostBySlug`.
- Component file stays under 200 lines (`.claude/rules/development-rules.md`).

## Architecture
```
blog/[slug]/page.tsx (server component)
  -> getRelatedPosts(slug)            [src/lib/mdx-utils.ts]
  -> <RelatedArticles posts={...} />  [src/components/blog/related-articles.tsx]
```
No new API route, no client-side state.

## Related Code Files
### Modify
- `src/lib/mdx-utils.ts` — add `getRelatedPosts()`.
- `src/app/blog/[slug]/page.tsx` — import and render `RelatedArticles`
  between `</article>` and `<CommentsSection />` only.
- `src/__tests__/lib/mdx-utils.test.ts` — add `getRelatedPosts()` test block.

### Create
- `src/components/blog/related-articles.tsx` — new presentational component.
- `src/__tests__/components/related-articles.test.tsx` — new, following the
  render/screen pattern in `src/__tests__/components/search-box.test.tsx`.

## Implementation Steps
1. Write tests first for `getRelatedPosts()`: shared-tag ranking, recency
   fallback (using the real `hello-world`/`running-maf-method` fixture posts),
   excludes self, respects `limit`, returns `[]` gracefully with 1 total post.
2. Implement `getRelatedPosts()` in `mdx-utils.ts`.
3. Write a render test for `RelatedArticles`: renders N cards for N posts,
   renders nothing for an empty array.
4. Implement `RelatedArticles` component.
5. Wire it into `blog/[slug]/page.tsx` in the designated region.
6. Run `npm run test` and `npm run lint`.

## Todo
- [x] `getRelatedPosts()` implemented + tested (incl. empty-array case)
- [x] `RelatedArticles` component implemented + tested (incl. empty render)
- [x] Wired into `blog/[slug]/page.tsx`
- [x] `npm run test` and `npm run lint` pass

## Success Criteria
- Visiting any `/blog/[slug]` page with 2+ other posts shows up to 3 related
  cards, ranked by tag overlap then recency.
- With only 1 other post in the system, the section still renders without
  error (1 card, no crash).
- With 0 other posts, the section renders nothing (no empty heading).

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Showing a draft post as "related" | Low | Medium (leaks unpublished content) | Reuse `getAllPosts()`, which already filters drafts outside development — do not re-implement filtering |
| Edit collision with Phase A/C on the same file | High (by design) | Medium | Sequential execution; this phase only touches the new region between `</article>` and `<CommentsSection />` |
| Only 2 posts exist today, so ranking logic looks untested in "real" use | Medium | Low | Tests explicitly cover the 0-shared-tags fallback since that's the current real data, not a contrived case |

## Rollback
Revert `mdx-utils.ts` and `blog/[slug]/page.tsx` to drop the new region;
delete `related-articles.tsx` and its test. No stored data involved.
