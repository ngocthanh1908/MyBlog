# Phase 5: SEO & Performance

## Context Links
- [System Spec](../../system.md) | [Phase 3](./phase-03-bento-grid-homepage.md) | [Phase 4](./phase-04-blog-mdx-system.md)

## Overview
- **Priority:** P2
- **Status:** Complete
- **Effort:** 3h
- Metadata, Open Graph, sitemap, robots, Lighthouse optimization.

## Requirements

### Functional
- Page-level metadata (title, description, OG tags)
- Auto-generated sitemap.xml
- robots.txt
- Structured data (JSON-LD) for person + blog posts

### Non-Functional
- Lighthouse score > 90 all categories
- LCP < 2.5s
- CLS < 0.1
- FID < 100ms

## Related Code Files

### Create
- `src/app/sitemap.ts` — Dynamic sitemap generation
- `src/app/robots.ts` — Robots.txt config
- `src/app/opengraph-image.tsx` — Default OG image (dynamic)
- `src/lib/structured-data.ts` — JSON-LD helpers

### Modify
- `src/app/layout.tsx` — Add default metadata, structured data
- `src/app/page.tsx` — Homepage metadata
- `src/app/blog/page.tsx` — Blog listing metadata
- `src/app/blog/[slug]/page.tsx` — Per-post metadata + OG

## Implementation Steps

1. Set default metadata in `src/app/layout.tsx`:
   ```ts
   export const metadata: Metadata = {
     title: { default: 'Thanh.dev', template: '%s | Thanh.dev' },
     description: 'Senior SAP Consultant, AI Architect, Marathon Runner',
     metadataBase: new URL('https://thanh.dev'),
   }
   ```
2. Add `generateMetadata` to each page for specific titles/descriptions
3. Create `src/app/sitemap.ts`:
   - Static pages: /, /blog, /projects, /about
   - Dynamic: all blog post slugs from `getAllPosts()`
4. Create `src/app/robots.ts`:
   - Allow all, sitemap URL
5. Create `src/lib/structured-data.ts`:
   - Person schema for homepage
   - BlogPosting schema for blog posts
6. **[RT#6]** OG image strategy — default to static OG image:
   - Place static `public/og-image.png` (1200x630) as default
   - Reference in metadata: `openGraph: { images: ['/og-image.png'] }`
   - Dynamic `opengraph-image.tsx` is a **stretch goal** — test on standalone before relying on it
7. Performance optimizations:
   - **[RT#8]** Do NOT use `ssr: false` for Framer Motion. Use `LazyMotion` + `domAnimation` feature bundle for tree-shaking while keeping SSR rendering.
   - Next.js `<Image>` with `priority` on hero/featured images
   - Font display: `swap` (Geist already handles this)
   - Preconnect to external domains if any
8. **[RT#13]** Use `process.env.NEXT_PUBLIC_SITE_URL || 'https://thanh.dev'` for `metadataBase`. Add to `.env.example`.
9. Run Lighthouse audit, fix any issues

## Todo List
- [x] Set default metadata in root layout (env-based metadataBase) [RT#13]
- [x] Add generateMetadata to all pages
- [x] Create sitemap.ts
- [x] Create robots.ts
- [x] Create structured data helpers
- [x] Add static OG image to public/ [RT#6]
- [x] Configure LazyMotion + domAnimation (NOT ssr:false) [RT#8]
- [x] Optimize images with Next.js Image
- [x] Create .env.example with NEXT_PUBLIC_SITE_URL
- [x] Run Lighthouse audit
- [x] Fix any performance issues

## Success Criteria
- All pages have proper title, description, OG tags
- sitemap.xml accessible at /sitemap.xml
- robots.txt accessible at /robots.txt
- Lighthouse > 90 all categories
- No hydration warnings in console

## Risk Assessment
- **[RT#6] OG image generation**: `@vercel/og` wasm may not work in standalone. Mitigation: static OG image as default. Dynamic generation is stretch goal.
- **[RT#8] Framer Motion SSR**: `ssr: false` kills SEO + causes CLS. Mitigation: `LazyMotion` keeps SSR while reducing bundle.

## Next Steps
- Project Showcase page (future phase)
- About page (future phase)
- Habits/Running tracker integration (future phase)
