# Phase 2: Layout Shell (Navbar + Footer)

## Context Links
- [System Spec](../../system.md) | [Phase 1](./phase-01-project-setup.md)

## Overview
- **Priority:** P1
- **Status:** Complete
- **Effort:** 3h
- Sticky navbar + minimal footer. Responsive. Tailscale-inspired clean design.

## Key Insights
- Navbar: Logo left ("Thanh.dev" or "PNT"), menu center (Blog, Projects, About, Habits), right (Contact/Social + theme toggle)
- Footer: Minimal, social links, copyright
- Mobile: Hamburger menu

## Requirements
- Sticky navbar with blur background
- Responsive: hamburger on mobile
- Footer with social links
- Smooth transitions between pages
- Active link highlighting

## Related Code Files

### Create
- `src/components/layout/navbar.tsx` — Sticky nav with responsive menu
- `src/components/layout/mobile-menu.tsx` — Mobile hamburger menu (custom a11y: focus trap, scroll lock, aria) [RT#15][V#2]
- `src/components/layout/footer.tsx` — Minimal footer
- `src/components/layout/nav-link.tsx` — Nav link with active state
- `src/components/ui/external-link.tsx` — Reusable external link with `rel="noopener noreferrer"` [RT Security]

### Modify
- `src/app/layout.tsx` — Add Navbar + Footer to root layout

## Implementation Steps

1. Create `src/components/layout/navbar.tsx`:
   - Sticky top, `backdrop-blur-md bg-background/80`
   - Left: Logo text link to `/`
   - Center: Desktop nav links (Blog, Projects, About, Habits)
   - Right: GitHub/LinkedIn icons + ThemeToggle
   - Responsive: hide center nav on mobile, show hamburger
2. Create `src/components/layout/mobile-menu.tsx` **[RT#15]**:
   - Slide-in menu for mobile using dialog pattern
   - `aria-expanded` on hamburger button, `role="dialog"` on menu panel
   - Body scroll lock (`overflow: hidden` on `<body>`) when open
   - Focus trap: tab cycles within menu, Escape key closes
   - Same nav links as desktop
   - Close on link click, outside click, or Escape key
3. Create `src/components/layout/nav-link.tsx`:
   - Uses `usePathname()` for active state
   - Active: `text-accent font-medium`, Inactive: `text-muted hover:text-primary`
4. Create `src/components/layout/footer.tsx`:
   - Max-width container
   - Left: Copyright with current year
   - Right: Social icon links (GitHub, LinkedIn, email)
5. Update `src/app/layout.tsx`:
   - Wrap children with `<Navbar />` above and `<Footer />` below
   - Main content: `<main className="min-h-screen pt-16">` (offset navbar height)

## Todo List
- [x] Create navbar with responsive layout
- [x] Create mobile menu with a11y (focus trap, scroll lock, aria) [RT#15]
- [x] Create external-link component with noopener noreferrer
- [x] Create nav-link with active state
- [x] Create footer with ExternalLink for social links
- [x] **[RT#7]** Create placeholder pages for /projects, /about, /habits (minimal "Coming soon")
- [x] Integrate into root layout
- [x] Test responsive behavior (mobile/tablet/desktop)
- [x] Verify sticky nav + blur effect
- [x] Test keyboard navigation and screen reader on mobile menu

## Success Criteria
- Navbar sticks to top on scroll
- Mobile hamburger opens/closes correctly
- Active link highlights current page
- Footer displays at bottom
- All pages share same layout

## Risk Assessment
- **Hydration mismatch**: `usePathname` is client-only. Mitigation: mark nav-link as `"use client"`.
- **Mobile menu accessibility [RT#15]**: Must implement focus trap, escape key, scroll lock, aria attributes. Consider using Radix Dialog as base.
- **[RT#7][V#3] Broken nav links**: Create minimal placeholder pages (heading + "Coming soon"). Quick fix, prevents 404s.

## Next Steps
→ Phase 3: Bento Grid Homepage
