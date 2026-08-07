# Phase 2: Projects Page

## Context Links
- Current placeholder: `src/app/projects/page.tsx`
- Homepage card pattern: `src/components/home/featured-project-card.tsx`
- Design tokens: `bg-surface`, `border-border`, `text-accent`, `rounded-2xl`

## Overview
- **Priority:** P1
- **Status:** Pending
- **Description:** Data-driven projects page with cards. Projects defined in a TS config file for easy editing.

## Key Insights
- Homepage already has a `FeaturedProjectCard` with hardcoded data — projects page should be the canonical source
- Use same card styling as blog cards for visual consistency
- Start with 2-3 placeholder projects user fills in later

## Requirements
**Functional:**
- Project data file with typed schema (title, description, techStack[], links {github?, demo?, blog?}, featured flag)
- Grid of project cards showing title, description, tech tags, and action links
- Featured project highlighted (slightly larger or with badge)

**Non-functional:**
- Type-safe project data with Zod validation (matches existing blog pattern)
- SEO metadata
- Zero client JS (server component)

## Architecture
```
src/data/projects-data.ts            → project array with Zod schema
src/app/projects/page.tsx            → server component, grid layout
src/components/projects/project-card.tsx → reusable card component
```

**Data flow:** `projects-data.ts` exports validated array -> `page.tsx` filters/sorts -> `ProjectCard` renders each

## Related Code Files
- **Modify:** `src/app/projects/page.tsx`
- **Create:** `src/data/projects-data.ts`, `src/components/projects/project-card.tsx`

## Implementation Steps
1. Create `src/data/projects-data.ts`:
   - Define `Project` type with Zod schema
   - Export `projects` array with 3 placeholder entries (SAP integration tool, AI assistant, personal blog)
   - Each has: title, description, techStack string[], links object, featured boolean
2. Create `src/components/projects/project-card.tsx`:
   - Card with same border/surface styling as BlogCard
   - Title, description, tech stack tags (pill badges), link icons (Github, ExternalLink from lucide)
   - Wrap in FadeUp animation
3. Update `src/app/projects/page.tsx`:
   - Import projects data
   - Add `generateMetadata()`
   - Render heading + description + project grid (2 cols on desktop)
   - Featured project first
4. Verify build: `npm run build`

## Todo List
- [ ] Create `src/data/projects-data.ts` with Zod schema and placeholder data
- [ ] Create `src/components/projects/project-card.tsx`
- [ ] Rewrite `src/app/projects/page.tsx` with data-driven grid
- [ ] Add page metadata
- [ ] Verify build succeeds

## Success Criteria
- Projects page shows cards with tech tags and links
- Adding a new project = adding an object to the data array (no code changes)
- Responsive grid layout
- Featured project visually distinct

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Too many projects slow page | Very Low | Low | Static data, no DB queries |
| User forgets to update placeholders | Medium | Low | Placeholder text clearly marked as "[Your description here]" |

## Next Steps
- User customizes project entries in `projects-data.ts`
- Consider updating `FeaturedProjectCard` on homepage to pull from same data source (future refactor)
