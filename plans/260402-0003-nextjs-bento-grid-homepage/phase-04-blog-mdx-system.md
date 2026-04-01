# Phase 4: Blog System (MDX)

## Context Links
- [System Spec](../../system.md) | [Phase 3](./phase-03-bento-grid-homepage.md)

## Overview
- **Priority:** P2
- **Status:** Complete
- **Effort:** 4h
- File-based blog with MDX, frontmatter, tags, listing page, detail page.

## Key Insights
- next-mdx-remote for RSC-compatible MDX rendering
- gray-matter for frontmatter parsing
- Tags: #Mindfulness, #SAP, #Running, #AI
- Minimalist card design with hover effects

## Requirements

### Functional
- Blog listing page with all posts sorted by date
- Tag filtering (clickable tags)
- Individual blog post page with MDX rendering
- Frontmatter: title, date, tags, excerpt, coverImage (optional)

### Non-Functional
- Typography plugin for prose styling
- Code syntax highlighting (optional, nice-to-have)
- Static generation with `generateStaticParams`

## Related Code Files

### Create
- `src/content/blog/hello-world.mdx` — Sample blog post
- `src/content/blog/running-maf-method.mdx` — Sample running post
- `src/lib/mdx-utils.ts` — getAllPosts, getPostBySlug, post type definitions
- `src/app/blog/page.tsx` — Blog listing with tag filter
- `src/app/blog/[slug]/page.tsx` — Blog detail with MDX rendering
- `src/components/blog/blog-card.tsx` — Blog list item card
- `src/components/blog/tag-filter.tsx` — Tag filter chips

### Modify
- `src/components/home/blog-preview-card.tsx` — Connect to real latest post data

## Implementation Steps

1. Create `src/content/blog/` directory with 2 sample `.mdx` files:
   ```mdx
   ---
   title: "Hello World"
   date: "2026-04-01"
   tags: ["AI", "SAP"]
   excerpt: "First post on my personal blog."
   ---

   Content here...
   ```
2. Create `src/lib/mdx-utils.ts`:
   - **[RT#3]** Validate slug: `/^[a-z0-9-]+$/` regex, reject slugs with `/`, `\`, `..`, null bytes. Resolve final path and assert it starts with content directory.
   - **[RT#14]** Validate frontmatter with Zod schema: `{ title: string, date: string, tags: string[], excerpt: string, coverImage?: string, draft?: boolean }`. Skip/warn on invalid posts, don't crash build.
   - **[V#5]** Support draft posts: `draft: true` in frontmatter → filtered out from `getAllPosts()` in production. Show drafts in dev mode only (`process.env.NODE_ENV === 'development'`).
   - `getAllPosts()`: Read all `.mdx` from content/blog, parse + validate frontmatter, sort by date desc
   - `getPostBySlug(slug)`: Sanitize slug → read single post → return frontmatter + serialized MDX content
   - Type: `BlogPost { slug, title, date, tags, excerpt, coverImage?, content? }`
   - Install `zod` as dependency for schema validation
3. Create `src/app/blog/page.tsx`:
   - Fetch all posts via `getAllPosts()`
   - Render tag filter + blog cards
   - Tag filter uses search params for URL state
4. **[RT#9]** Create `src/components/blog/tag-filter.tsx`:
   - Horizontal chip list of all unique tags
   - "All" option to reset
   - Client component using `useSearchParams`
   - **Architecture:** Blog listing page (Server Component) passes ALL posts to a Client Component wrapper. Tag filtering happens entirely client-side (show/hide). No `force-dynamic` needed — page is statically generated.
5. Create `src/components/blog/blog-card.tsx`:
   - Title, date, excerpt, tags
   - Hover: bg-surface border-accent transition
   - Link to `/blog/[slug]`
6. Create `src/app/blog/[slug]/page.tsx`:
   - `generateStaticParams` from all slugs
   - `generateMetadata` from frontmatter
   - **[RT#5]** Use `compileMDX` from `next-mdx-remote/rsc` (NOT `MDXRemote`) — this is the RSC-compatible API
   - **[RT#12]** Pass explicit `components` allowlist to `compileMDX` (whitelist only safe HTML elements, no `<script>`, no raw imports). Document that MDX files are trusted-only content.
   - Apply `@tailwindcss/typography` prose classes to content wrapper
7. Update `blog-preview-card.tsx` in homepage to fetch latest post from `getAllPosts()[0]`

## Todo List
- [x] Create content/blog directory with 2 sample posts
- [x] Install zod for frontmatter validation
- [x] Implement mdx-utils.ts with slug sanitization [RT#3] and Zod schema [RT#14]
- [x] Create blog listing page (SSG, pass all posts to client wrapper) [RT#9]
- [x] Create blog-card component
- [x] Create tag-filter component (client-side filtering) [RT#9]
- [x] Create blog detail page using compileMDX from next-mdx-remote/rsc [RT#5]
- [x] Configure MDX components allowlist [RT#12]
- [x] Connect blog-preview-card to real data
- [x] Test blog listing, filtering, detail navigation
- [x] Verify prose styling in dark mode

## Success Criteria
- Blog listing shows all posts sorted by date
- Tag filter works (URL-based state)
- Blog detail renders MDX correctly with styled prose
- `generateStaticParams` pre-renders all blog routes
- Homepage blog preview shows latest real post

## Risk Assessment
- **[RT#5] next-mdx-remote RSC**: Use `compileMDX` from `next-mdx-remote/rsc`, not `MDXRemote`. Interactive custom components need client wrapper with serialization boundary.
- **[RT#3] Path traversal**: Slug must be validated before constructing fs path. Regex + path containment check.
- **[RT#4] Standalone fs access**: Content files must be in `outputFileTracingIncludes` (handled in Phase 1).
- **File system access in edge runtime**: Use Node runtime (default) for fs operations.

## Next Steps
→ Phase 5: SEO & Performance
