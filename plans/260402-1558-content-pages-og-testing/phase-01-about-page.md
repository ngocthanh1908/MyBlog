# Phase 1: About Page

## Context Links
- Current placeholder: `src/app/about/page.tsx`
- Site config: `src/lib/site-config.ts`
- Existing patterns: `BentoCard`, `FadeUp` animation wrapper

## Overview
- **Priority:** P1
- **Status:** Pending
- **Description:** Replace placeholder About page with real bio, expertise areas, and interests sections.

## Key Insights
- User is "Senior SAP Consultant, AI-Enabled Architect, Marathon Runner"
- Reuse existing design tokens (`text-muted`, `bg-surface`, `border-border`, `text-accent`)
- Keep layout simple — no tabs/accordion, just stacked sections with FadeUp animation

## Requirements
**Functional:**
- Bio section with intro paragraph
- Expertise grid: SAP, AI/ML, Software Architecture (icon + title + description each)
- Interests section: marathon running, mindfulness, technology
- Social links at bottom (reuse `siteConfig.socialLinks`)

**Non-functional:**
- SEO metadata (title, description, OG)
- Structured data (Person JSON-LD already exists in layout — no duplication needed)
- Page loads fast (no client-side JS needed, server component only)

## Architecture
```
src/data/about-data.ts        → expertise items, interests, bio text
src/app/about/page.tsx         → server component, imports data, renders sections
```

**Data flow:** `about-data.ts` exports typed arrays -> `page.tsx` maps over them -> static HTML

## Related Code Files
- **Modify:** `src/app/about/page.tsx`
- **Create:** `src/data/about-data.ts`

## Implementation Steps
1. Create `src/data/about-data.ts` with typed exports:
   - `bio`: string (2-3 paragraphs)
   - `expertiseAreas`: array of `{ icon: string, title: string, description: string }`
   - `interests`: array of `{ title: string, description: string }`
2. Update `src/app/about/page.tsx`:
   - Add `generateMetadata()` returning title "About" and description
   - Import data from about-data
   - Render: Hero heading + bio -> Expertise grid (3 cols) -> Interests list -> Social links
   - Use `FadeUp` for section animations
   - Use lucide-react icons for expertise areas
3. Verify build compiles: `npm run build`

## Todo List
- [ ] Create `src/data/about-data.ts` with bio, expertise, interests
- [ ] Rewrite `src/app/about/page.tsx` with real content sections
- [ ] Add page metadata export
- [ ] Verify build succeeds

## Success Criteria
- About page renders with real content (no "Coming soon")
- Page is fully server-rendered (no `"use client"`)
- Metadata appears in page source
- Responsive: stacks on mobile, grid on desktop

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Bio content not finalized | Medium | Low | Use placeholder text user can edit in data file |
| Icon imports bloat bundle | Low | Low | Tree-shake via named imports from lucide-react |

## Next Steps
- User edits `about-data.ts` to personalize bio text
- Phase 4 will generate OG image using page title
