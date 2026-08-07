# Phase 3: Content Layer Integration

## Context Links
- [Phase 1: Database + API](./phase-01-database-api-foundation.md)
- [Current mdx-utils.ts](../../src/lib/mdx-utils.ts)
- [Home page](../../src/app/page.tsx)
- [Blog slug page](../../src/app/blog/[slug]/page.tsx)
- [Sitemap](../../src/app/sitemap.ts)

## Overview
- **Priority**: P1
- **Status**: Pending
- **Effort**: 3h
- **Depends on**: Phase 1 (DB helpers must exist)
- **Description**: Merge MDX + SQLite posts into unified content layer

## File Ownership (this phase only)
```
MODIFY:
  src/lib/mdx-utils.ts             — merge DB posts into getAllPosts(), getAllTags()
  src/app/blog/[slug]/page.tsx     — handle DB posts (render markdown content)
  src/app/blog/page.tsx            — no code change needed (uses getAllPosts already)
  src/app/page.tsx                 — no code change needed (uses getAllPosts already)
  src/app/sitemap.ts               — include DB posts in sitemap
  src/components/blog/blog-card.tsx — minor: use read_time from post if available
```

## Key Insights
- `getAllPosts()` is the single source of truth — all pages use it
- Merge strategy: fetch MDX posts + DB posts, combine, sort by date desc
- DB posts use `source: 'db'` marker so slug page knows how to render
- MDX posts rendered via `compileMDX()` (existing), DB posts rendered as markdown via same function
- BlogPost type needs `source` and `id` optional fields

## Architecture

### Updated BlogPost Type
```typescript
export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
  draft: boolean;
  content?: string;
  readTime?: number;      // NEW: from DB posts
  source?: 'mdx' | 'db'; // NEW: content source
  id?: number;            // NEW: DB post ID
};
```

### Merge Logic in getAllPosts()
```
1. Get MDX posts (existing logic, unchanged)
2. Get DB posts via getAllDbPosts() from db.ts
3. Map DB posts to BlogPost shape (parse tags JSON, set source: 'db')
4. Combine arrays, sort by date descending
5. Return merged array
```

### Slug Page Rendering
```
getPostBySlug(slug):
  1. Try MDX file first (existing behavior)
  2. If not found, query DB by slug
  3. Return post with source marker

blog/[slug]/page.tsx:
  - If source === 'mdx': compileMDX (existing)
  - If source === 'db': compileMDX on DB content (same function, content is markdown)
  - Both paths produce same JSX output
```

### generateStaticParams Update
```
- Return slugs from both MDX and DB posts
- DB posts that are drafts excluded from static generation
```

## Implementation Steps

### 1. Update src/lib/mdx-utils.ts (~30 lines added)
- Import `getAllDbPosts`, `getDbPostBySlug` from `./db`
- Add `source` and `id` and `readTime` to BlogPost type
- In `getAllPosts()`: get DB posts, map to BlogPost, merge with MDX posts
- In `getPostBySlug()`: try MDX first, catch → try DB, throw if neither found
- In `getAllTags()`: already uses getAllPosts(), no change needed
- MDX posts get `source: 'mdx'`, DB posts get `source: 'db'`

### 2. Update src/app/blog/[slug]/page.tsx (~10 lines changed)
- `generateStaticParams()`: already calls getAllPosts(), now includes DB slugs
- `BlogPostPage`: both MDX and DB content go through `compileMDX()` — no branching needed since DB stores markdown and compileMDX handles raw markdown
- Use `post.readTime` if available, else calculate from content length (existing logic)

### 3. Update src/app/sitemap.ts (~5 lines)
- Already calls `getAllPosts()` — automatic, DB posts included
- No code change needed if BlogPost type is compatible (it is)

### 4. Update src/components/blog/blog-card.tsx (~3 lines)
- Use `post.readTime` if set, else keep existing calculation
- No other changes needed

### 5. Verify pages that consume getAllPosts()
- `src/app/page.tsx` — uses getAllPosts() + getAllTags(), no change needed
- `src/app/blog/page.tsx` — uses getAllPosts() + getAllTags(), no change needed

## Todo List
- [ ] Update BlogPost type with source/id/readTime fields
- [ ] Update getAllPosts() to merge MDX + DB posts
- [ ] Update getPostBySlug() to check DB as fallback
- [ ] Update blog-card.tsx to use readTime field
- [ ] Verify sitemap includes DB posts
- [ ] Verify home page shows DB posts
- [ ] Verify blog listing shows DB posts
- [ ] Verify blog detail renders DB post content correctly

## Success Criteria
- Create a post via admin → appears on home page and /blog
- Click DB post → renders markdown content correctly
- MDX posts still work identically
- Sitemap XML includes DB post URLs
- Tag filter includes tags from DB posts
- Draft DB posts hidden in production, visible in dev

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| DB import fails at build time (no SQLite in build env) | Medium | High | Wrap DB calls in try-catch, return empty array if DB unavailable |
| Slug collision between MDX and DB | Low | Medium | DB slug validation: reject if MDX file with same slug exists |
| Performance: getAllPosts() now hits DB on every call | Low | Low | SQLite reads are <1ms for <1000 posts; cache later if needed |

## Security Considerations
- DB post content rendered via compileMDX — same XSS protection as MDX posts
- Slug validation reuses existing isValidSlug() function
