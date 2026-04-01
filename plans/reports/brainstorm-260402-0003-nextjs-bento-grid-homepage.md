# Brainstorm: Next.js Project Init & Bento Grid Homepage

## Problem Statement
Initialize Next.js 15 personal brand website (Tailscale-style) with Bento Grid homepage. Combining portfolio, blog, and personal identity for Senior SAP Consultant.

## Decisions

| Topic | Choice | Rationale |
|---|---|---|
| Framework | Next.js 15 (App Router) | Stable, SEO-optimal, mature ecosystem |
| Package Manager | npm | Default, no extra install |
| Deploy | Self-hosted / VPS | `output: 'standalone'` in next.config |
| Blog Content | Local MDX | Git-versioned, no external deps |
| Animation | Framer Motion | Rich API, fade-up on scroll per spec |
| Responsive | 1→2→4 columns | Mobile-first, clean UX |
| Theme | Light + Dark | next-themes, system.md palette + dark variant |

## Recommended Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout (fonts, theme provider)
│   ├── page.tsx                # Homepage (Bento Grid)
│   ├── blog/
│   │   ├── page.tsx            # Blog listing
│   │   └── [slug]/page.tsx     # Blog detail (MDX)
│   ├── projects/
│   │   └── page.tsx            # Project showcase
│   └── about/
│       └── page.tsx            # About page
├── components/
│   ├── layout/
│   │   ├── navbar.tsx          # Sticky nav
│   │   └── footer.tsx
│   ├── home/
│   │   ├── hero-section.tsx    # Hero with CTA
│   │   ├── bento-grid.tsx      # Grid container
│   │   ├── bento-card.tsx      # Individual card with hover
│   │   ├── featured-project-card.tsx
│   │   ├── latest-run-card.tsx
│   │   ├── ai-spotlight-card.tsx
│   │   └── blog-preview-card.tsx
│   ├── blog/
│   │   └── blog-card.tsx
│   ├── ui/
│   │   ├── theme-toggle.tsx
│   │   └── button.tsx
│   └── motion/
│       └── fade-up.tsx         # Reusable Framer Motion wrapper
├── lib/
│   ├── mdx.ts                  # MDX parsing utilities
│   └── constants.ts            # Design tokens, site config
├── content/
│   └── blog/
│       └── *.mdx               # Blog posts
└── styles/
    └── globals.css             # Tailwind base + custom tokens
```

## Evaluated Approaches

### A. Bento Grid Implementation
**Option 1: Pure CSS Grid (Recommended)**
- `grid-template-columns` + `grid-column: span X` for asymmetric blocks
- Tailwind `grid-cols-4` with responsive breakpoints
- Pros: Zero JS overhead, native browser, maintainable
- Cons: Manual span management

**Option 2: CSS Grid + Container Queries**
- Modern approach, per-card responsive
- Pros: Cards adapt to own container
- Cons: Overkill for this layout, browser support ~95%

**Winner: Option 1** — KISS principle. Tailwind grid classes handle responsive perfectly.

### B. MDX Strategy
**Option 1: next-mdx-remote (Recommended)**
- Dynamic MDX loading, no build-time compilation needed
- Works with App Router `generateStaticParams`
- Pros: Simple setup, active maintenance, RSC compatible
- Cons: Slightly slower than build-time

**Option 2: @next/mdx**
- Built-in Next.js MDX support
- Pros: Official, zero-config
- Cons: Less flexible for file-based content, no frontmatter parsing built-in

**Option 3: Contentlayer**
- Type-safe content layer
- Pros: Great DX, auto-generated types
- Cons: **Deprecated/unmaintained** — risky long-term

**Winner: Option 1** — next-mdx-remote + gray-matter for frontmatter.

### C. Dark Mode Palette (Extension of system.md)

| Token | Light | Dark |
|---|---|---|
| Background | #FFFFFF | #0F0F0F |
| Surface | #F3F4F6 | #1A1A2E |
| Primary Text | #000000 | #F9FAFB |
| Accent | #312E81 | #818CF8 (Indigo 400) |
| Border | #E5E7EB | #374151 |
| Muted | #6B7280 | #9CA3AF |

## Key Dependencies

```json
{
  "next": "^15",
  "react": "^19",
  "tailwindcss": "^4",
  "framer-motion": "^12",
  "next-mdx-remote": "^5",
  "gray-matter": "^4",
  "next-themes": "^0.4",
  "lucide-react": "^0.400",
  "@tailwindcss/typography": "^0.5"
}
```

## Implementation Considerations

### Phase 1 — Project Setup
- `npx create-next-app@15` with TypeScript, Tailwind, App Router, src/ directory
- Configure `output: 'standalone'` in next.config
- Setup Geist font (bundled with create-next-app)
- Setup next-themes ThemeProvider in root layout
- Define CSS custom properties for design tokens (light/dark)

### Phase 2 — Layout Shell
- Sticky Navbar: Logo left, menu center, contact + theme toggle right
- Footer: Minimal, social links
- Responsive container with max-width

### Phase 3 — Bento Grid Homepage
- Hero section: Bold heading + sub-heading + 2 CTAs
- Bento grid: CSS Grid 4-col layout
  - Block 1 (span 2x2): Featured Web App
  - Block 2 (span 2x1): Latest Run stats
  - Block 3 (span 1x1): AI Agent Spotlight
  - Block 4 (span 1x1): Blog Preview
- Each card: `rounded-2xl border hover:border-indigo` + FadeUp animation
- Framer Motion `whileInView` for scroll reveal

### Phase 4 — Blog System (MDX)
- Content directory with `.mdx` files + frontmatter
- Blog listing with tag filter (#Mindfulness, #SAP, #Running)
- Blog detail page with MDX rendering + typography plugin

### Phase 5 — SEO & Performance
- Metadata API for each page
- Open Graph images
- Sitemap generation
- Lighthouse optimization

## Risks & Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Framer Motion bundle size (~30KB) | Performance | Dynamic import, only load on pages that need it |
| MDX content growing large | Build time | ISR with revalidation, not full SSG |
| Dark mode flash (FOUC) | UX | next-themes handles this with script injection |
| Tailwind v4 breaking changes | DX | Pin version, follow migration guide |

## Success Criteria
- [ ] Homepage loads < 2s on 3G
- [ ] Lighthouse score > 90 all categories
- [ ] Bento Grid renders correctly on mobile/tablet/desktop
- [ ] Dark/Light mode toggles without flash
- [ ] Blog posts render from MDX files
- [ ] SEO metadata present on all pages

## Next Steps
Create detailed implementation plan with phases and tasks → delegate to `planner` agent.
