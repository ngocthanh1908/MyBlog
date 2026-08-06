# Design Guidelines & Visual System

**Last Updated**: 2026-08-06
**Version**: 1.0.0
**Project**: MyBlog - Personal Blog & Portfolio

## Overview

MyBlog uses a carefully curated design system built on forest green tones, warm paper backgrounds, and elegant typography. This guide ensures visual consistency across all pages and components.

## Color Palette

### Primary Colors

| Color | Light Mode | Dark Mode | Usage |
|-------|-----------|-----------|-------|
| Forest Green (Primary) | `#0c5238` | `#3eb481` | Buttons, links, accents |
| Warm Paper | `#f6f4ee` | `#111312` | Background |
| Dark Text | `#1a1a1a` | `#f0f0f0` | Body text |

### Semantic Colors

| Name | Light | Dark | Purpose |
|------|-------|------|---------|
| `--color-ac-hover` | Derived hover state | Derived hover state | Interactive hover |
| `--color-ac-light` | Light accent | Light accent | Backgrounds, borders |
| `--color-ac-border` | Border accent | Border accent | Dividers, outlines |
| `--card-shadow` | Subtle shadow | Darker shadow | Card depth (default) |
| `--card-hover-shadow` | Elevated shadow | Elevated shadow | Card depth (hover) |

### CSS Variables (globals.css)

```css
/* Light Mode */
:root {
  --color-bg: #f6f4ee;
  --color-text: #1a1a1a;
  --color-primary: #0c5238;
  --color-accent: #3eb481;
  --color-ac-hover: rgba(60, 180, 129, 0.2);
  --color-ac-light: rgba(60, 180, 129, 0.1);
  --color-ac-border: rgba(12, 82, 56, 0.3);
  --card-shadow: 0 1px 3px rgba(0,0,0,0.1);
  --card-hover-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

/* Dark Mode */
[data-theme='dark'] {
  --color-bg: #111312;
  --color-text: #f0f0f0;
  --color-primary: #3eb481;
  --color-accent: #0c5238;
  /* ... adjusted colors for dark mode ... */
}
```

## Typography

### Font Stack

| Usage | Font | Fallback | Notes |
|-------|------|----------|-------|
| UI, Labels | Plus Jakarta Sans | system-ui | Clean, modern sans-serif |
| Headings, Emphasis | Newsreader | Georgia, serif | Elegant serif for impact |
| Code Blocks | JetBrains Mono | Courier New, mono | Monospace for code |

### Font Sizes

```css
/* Responsive scales */
h1: 2.5rem (mobile) → 3.5rem (desktop)
h2: 2rem → 2.5rem
h3: 1.5rem → 2rem
body: 1rem (18px)
small: 0.875rem
code: 0.9rem
```

### Line Height & Spacing

```css
--line-height-tight: 1.2;    /* Headings */
--line-height-normal: 1.6;   /* Body text */
--line-height-relaxed: 1.8;  /* Long-form reading */
```

## Component Specifications

### Navbar

- **Height**: 64px
- **Background**: Warm paper (inherits theme)
- **Avatar**: Circular, 40px diameter, initials "Th"
- **Toggle**: Circular theme button, right-aligned

**Layout**:
```
[Avatar + Name/Subtitle] [spacer] [Theme Toggle]
```

### Blog Card

```
┌─────────────────────┐
│ [Category Tags]     │
│ Title               │
│ Excerpt (2 lines)   │
│ Date • Read Time    │
└─────────────────────┘
```

- **Shadow**: `--card-shadow` (default), `--card-hover-shadow` (hover)
- **Padding**: 1.5rem
- **Hover**: Lift effect (transform: translateY(-2px))
- **Tags**: Green pills with `--color-ac-light` background

### Reading Progress Bar

- **Position**: Fixed top (z-index: 40)
- **Height**: 3px
- **Gradient**: Left to right, forest green
- **Width**: % based on scroll position
- **Smooth**: Transition-based updates

### Font Sizer (Blog Article)

```
[A-] [Current Size] [A+]
```

- **Position**: Sticky, article top-right
- **Size Range**: 14px → 24px
- **Storage**: localStorage `reading-font-size`
- **Applies**: Article content only (`article` tag)

### Hero Section

- **Heading**: Serif, italic, 2.5rem+
- **Status Badge**: Pulse animation, "Building" text
- **Pulse Animation**: Green glow, 2s cycle

```css
@keyframes pulse-dot {
  0%, 100% { box-shadow: 0 0 0 0 rgba(60, 180, 129, 0.7); }
  50% { box-shadow: 0 0 0 10px rgba(60, 180, 129, 0); }
}
```

### HumanNote (Quote Block)

```
│                         
│ "Insightful quote
│ or personal note
│ here..."
│
```

- **Border**: Left accent (3px, forest green)
- **Padding**: 1.5rem, left-3rem
- **Font**: Serif, italic, slightly larger
- **Background**: `--color-ac-light`

## Animations

### Slide Up

```css
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

**Duration**: 400-600ms
**Timing**: ease-out
**Usage**: Initial page load, content reveal

### Fade In

```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
```

**Duration**: 300-400ms
**Usage**: Theme transitions, subtle reveals

### Pulse Dot

Green pulsing glow for status badges.
**Duration**: 2s, infinite
**Scale**: 0 → 10px shadow

## Responsive Design

### Breakpoints

```typescript
// Tailwind config values
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Container Query

```css
max-w-[820px]: Single column, comfortable reading width
```

### Mobile-First Approach

1. Base styles: Mobile (320px+)
2. Tablet: `md:` (768px+)
3. Desktop: `lg:` (1024px+)

## Accessibility

### Color Contrast

- **Text on Background**: 7:1 ratio (AAA)
- **Interactive Elements**: 4.5:1 minimum (AA)
- **Large Text**: 3:1 minimum (AA)

### Focus States

```css
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

### Motion Preferences

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## Internationalization

### Vietnamese Typography

- **Font**: Plus Jakarta Sans handles Vietnamese diacritics
- **Date Format**: DD/MM/YYYY (Vietnamese standard)
- **Pluralization**: Not needed (Vietnamese has no plural forms)
- **Text Direction**: LTR (left-to-right)

### Language-Specific Adjustments

- Slightly increased line-height for Vietnamese text
- Proper Unicode support for combining marks (ă, ê, ô, etc.)

## Dark Mode Implementation

Theme toggle via `next-themes`:
1. Reads `data-theme` attribute on `<html>`
2. CSS uses `:root[data-theme='dark']` selector
3. Components use `useTheme()` hook if needed
4. Persisted to localStorage

## Component Library

### Reusable Components

- **BlogCard**: Article preview with metadata
- **TagFilter**: Category filter pills
- **HeroSection**: Main hero area
- **HumanNote**: Quote/note block
- **ReadingProgress**: Scroll indicator
- **FontSizer**: Font size controls
- **Navbar**: Main navigation
- **Footer**: Site footer

All components accept Tailwind `className` props for flexibility while maintaining design consistency.

## Best Practices

1. **Use CSS Variables**: Never hardcode colors; always use `var(--color-*)`
2. **Mobile First**: Style mobile baseline, then enhance with media queries
3. **Semantic HTML**: Use proper heading hierarchy, alt text for images
4. **Accessibility**: Test with keyboard navigation and screen readers
5. **Performance**: Lazy load images, minimize animation complexity
6. **Vietnamese Text**: Test with Vietnamese diacritics and long text

## References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Next.js Image Optimization](https://nextjs.org/docs/basic-features/image-optimization)
- [next-themes Documentation](https://github.com/pacocoursey/next-themes)
