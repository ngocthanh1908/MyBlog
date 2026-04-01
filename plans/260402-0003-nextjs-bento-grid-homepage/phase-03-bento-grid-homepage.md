# Phase 3: Bento Grid Homepage

## Context Links
- [System Spec](../../system.md) | [Brainstorm](../reports/brainstorm-260402-0003-nextjs-bento-grid-homepage.md)

## Overview
- **Priority:** P1
- **Status:** Complete
- **Effort:** 4h
- Hero section + Bento Grid dashboard. Core visual identity of the site.

## Key Insights
- Bento Grid: CSS Grid 4-col asymmetric layout (Tailscale-style)
- Framer Motion fade-up on scroll for each card
- Cards: rounded-2xl, border, hover effect (border-accent transition)
- Grid layout (desktop): Block1 span-2x2, Block2 span-2x1, Block3 span-1x1, Block4 span-1x1

## Requirements

### Functional
- Hero with headline, sub-heading, 2 CTAs
- 4 Bento cards: Featured Project, Latest Run, AI Spotlight, Blog Preview
- Cards link to respective sections/pages
- Responsive: 4-col desktop → 2-col tablet → 1-col mobile

### Non-Functional
- Animations: fade-up on scroll (whileInView)
- Micro-interactions: hover scale/border effects
- Performance: lazy load images, optimize LCP

## Architecture

### Grid Layout (Desktop)
```
┌──────────────────┬──────────┐
│                  │ AI       │
│  Featured        │ Spotlight│
│  Project         ├──────────┤
│  (span 2x2)     │ Blog     │
│                  │ Preview  │
├──────────────────┴──────────┤
│     Latest Run (span full)  │
└─────────────────────────────┘
```

## Related Code Files

### Create
- `src/components/home/hero-section.tsx` — Hero with heading + CTAs
- `src/components/home/bento-grid.tsx` — Grid container layout
- `src/components/home/bento-card.tsx` — Reusable card wrapper (hover + animation)
- `src/components/home/featured-project-card.tsx` — Large featured web app card
- `src/components/home/latest-run-card.tsx` — Running stats / inspiration quote
- `src/components/home/ai-spotlight-card.tsx` — AI project mini card
- `src/components/home/blog-preview-card.tsx` — Latest blog post preview
- `src/components/motion/fade-up.tsx` — Reusable Framer Motion fade-up wrapper

### Modify
- `src/app/page.tsx` — Compose Hero + BentoGrid

## Implementation Steps

1. Create `src/components/motion/fade-up.tsx`:
   ```tsx
   "use client"
   // Framer Motion wrapper: initial={{ opacity: 0, y: 24 }}
   // whileInView={{ opacity: 1, y: 0 }}
   // viewport={{ once: true, margin: "-100px" }}
   ```
2. Create `src/components/home/bento-card.tsx`:
   - Base card: `rounded-2xl border border-border bg-surface p-6`
   - Hover: `hover:border-accent transition-colors duration-300`
   - Accepts `className` for grid span overrides
   - Wraps content in FadeUp
3. Create `src/components/home/hero-section.tsx`:
   - Headline: "Engineering SAP Systems & Running Marathons" (Extra Bold, large)
   - Sub-heading: 20-year IT experience, AI-Enabled SAP Architect
   - CTAs: "Explore Projects" (primary) + "Read Blog" (outline)
   - FadeUp animation
4. Create individual card contents:
   - `featured-project-card.tsx`: Image placeholder + tech stack tags + link
   - `latest-run-card.tsx`: Running icon + stats (km, MAF HR) or inspiration quote
   - `ai-spotlight-card.tsx`: Bot icon + mini project description
   - `blog-preview-card.tsx`: Latest post title + date + tag
5. Create `src/components/home/bento-grid.tsx`:
   - CSS Grid container: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
   - Featured: `lg:col-span-2 lg:row-span-2`
   - AI Spotlight: `lg:col-span-2` or `lg:col-span-1`
   - Adjust spans per layout diagram
6. Update `src/app/page.tsx`:
   ```tsx
   <main>
     <HeroSection />
     <BentoGrid />
   </main>
   ```
7. Static data for now (no real API calls). Blog preview will connect to MDX in Phase 4.
8. **[RT#8]** Do NOT use `ssr: false` on FadeUp/Framer Motion wrappers. Use `LazyMotion` with `domAnimation` feature bundle to reduce bundle while keeping SSR. FadeUp should render children server-side with `initial={{ opacity: 0, y: 24 }}` style so layout space is reserved (prevents CLS).

## Todo List
- [x] Create fade-up motion wrapper
- [x] Create bento-card base component
- [x] Create hero-section
- [x] Create featured-project-card
- [x] Create latest-run-card
- [x] Create ai-spotlight-card
- [x] Create blog-preview-card
- [x] Create bento-grid layout container
- [x] Compose homepage (page.tsx)
- [x] Test responsive grid (1/2/4 columns)
- [x] Verify hover effects and scroll animations
- [x] Test dark mode appearance

## Success Criteria
- Grid displays 4 asymmetric cards on desktop
- Collapses to 2-col tablet, 1-col mobile
- Fade-up animation triggers on scroll
- Hover border color transitions to accent
- Dark mode renders correctly
- No layout shift (CLS)

## Risk Assessment
- **[RT#8] Framer Motion bundle**: Do NOT use `ssr: false`. Use `LazyMotion` + `domAnimation` for tree-shaking. SSR must render children for SEO.
- **Grid span math**: Test on all breakpoints thoroughly
- **Image loading**: Use Next.js `<Image>` with priority for LCP card

## Next Steps
→ Phase 4: Blog MDX System (connect blog-preview-card to real data)
