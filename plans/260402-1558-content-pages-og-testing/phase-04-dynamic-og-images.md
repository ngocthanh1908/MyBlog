# Phase 4: Dynamic OG Images

## Context Links
- Current OG config: `src/app/layout.tsx` line 29 — static `/og-image.png`
- Blog metadata: `src/app/blog/[slug]/page.tsx` `generateMetadata()`
- Next.js ImageResponse docs: `next/og`

## Overview
- **Priority:** P1
- **Status:** Pending
- **Description:** Auto-generate OG images per page/blog post using Next.js `ImageResponse` API. Node.js runtime (not Edge) for standalone deployment compatibility.

## Key Insights
- `next.config.ts` already has `output: "standalone"` — must use Node.js runtime, NOT Edge
- Current layout has hardcoded `images: ["/og-image.png"]` — will update to dynamic route
- `ImageResponse` uses Satori under the hood — supports subset of CSS (flexbox, no grid)
- Geist font already used in layout — load same font for OG consistency

## Requirements
**Functional:**
- OG image route: `/og?title=X&description=Y` (query params)
- Default OG for homepage (site name + description)
- Blog post OG: title + date + tags
- Page OG: About/Projects/Habits with page title
- Image size: 1200x630 (standard OG)

**Non-functional:**
- `runtime = "nodejs"` (not edge) for standalone compatibility
- Font loaded from local file or Google Fonts fetch
- Cached via Next.js default caching
- Fallback if params missing

## Architecture
```
src/app/og/route.tsx                  → ImageResponse handler with query params
src/app/layout.tsx                    → update default OG to use /og route
src/app/blog/[slug]/page.tsx          → update generateMetadata to use /og?title=...
src/app/about/page.tsx                → add OG image metadata
src/app/projects/page.tsx             → add OG image metadata
src/app/habits/page.tsx               → add OG image metadata
```

**Data flow:** Page metadata sets `openGraph.images` -> `/og?title=X` -> `ImageResponse` renders JSX to PNG

## Related Code Files
- **Create:** `src/app/og/route.tsx`
- **Modify:** `src/app/layout.tsx` (default OG), `src/app/blog/[slug]/page.tsx` (blog OG), `src/app/about/page.tsx`, `src/app/projects/page.tsx`, `src/app/habits/page.tsx`

## Implementation Steps
1. Create `src/app/og/route.tsx`:
   - `export const runtime = "nodejs"`
   - GET handler: extract `title`, `description` from `searchParams`
   - Use `ImageResponse` from `next/og`
   - JSX layout: gradient background, site name, title (large), description (small)
   - Brand colors matching dark theme
   - 1200x630 size
   - Fallback defaults if params empty
2. Update `src/app/layout.tsx`:
   - Change `images: ["/og-image.png"]` to `images: [{ url: "/og", width: 1200, height: 630 }]`
3. Update `src/app/blog/[slug]/page.tsx` `generateMetadata()`:
   - Add `openGraph: { images: [{ url: "/og?title=...&description=..." }] }`
   - URL-encode title and excerpt
4. Add OG metadata to About, Projects, Habits page metadata (phases 1-3 already added `generateMetadata`)
5. Test locally: visit `/og?title=Test` — should return PNG
6. Verify build: `npm run build`

## Todo List
- [ ] Create `src/app/og/route.tsx` with ImageResponse
- [ ] Update layout.tsx default OG image URL
- [ ] Update blog post generateMetadata with dynamic OG
- [ ] Add OG image metadata to About/Projects/Habits pages
- [ ] Manual test: `/og?title=Hello` returns valid PNG
- [ ] Verify build succeeds

## Success Criteria
- `/og?title=My+Post` returns 1200x630 PNG with title rendered
- Sharing blog post on social media shows custom OG image with post title
- Default OG image shows site name + description
- No Edge runtime dependency — works in standalone Docker

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Satori CSS limitations | Medium | Medium | Stick to flexbox, no grid/advanced CSS |
| Font loading fails in Docker | Low | Medium | Bundle font file or use system fonts as fallback |
| Large image generation time | Low | Low | Next.js caches responses; images are simple |

## Security Considerations
- Sanitize query params (XSS in title could render in image — but ImageResponse renders to PNG, not HTML, so safe)
- Rate limiting not needed for static site

## Next Steps
- Phase 5 tests can validate OG route returns correct content-type
- Phase 6 Docker build must include font assets if bundled
