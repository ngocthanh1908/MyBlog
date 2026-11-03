# Design Guidelines & Visual System

**Last Updated**: 2026-08-06
**Version**: 1.0.0
**Project**: MyBlog - Personal Blog & Portfolio

## Overview

MyBlog's visual system (updated 2026-11-03) follows the reference site ehkoo.com: light grey page, 2px outlined cards with coloured tabs, indigo accent, Work Sans. Values below under "Color Palette"/"Typography" that mention forest green, Newsreader or Plus Jakarta Sans are **superseded** by the palette in the next block; the source of truth is `src/styles/globals.css` and `src/app/layout.tsx`.

**Current tokens** — light: bg `#f8f9fa`, text `#343a40`, muted `#495057`, card border `#666968` (2px), hairline `#dee2e6`, accent `#4c6ef5`. Dark: bg `#1f2021`, text `#e9ecef`, muted `#adb5bd`, card border `#4b4c4c`, accent `#91a7ff`. Fonts: Work Sans (body and headings), Inconsolata (code). Tab colours per topic: `src/lib/topic-tab-color.ts`.

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

- **Desktop (≥1024px)**: sticky left sidebar (13rem): `t{` logo (links to `/admin`), vertical links with icons: Trang chủ, Bài viết, Sở thích (with Chạy bộ nested under it), theme toggle
- **Mobile/tablet**: top bar with logo, site name, theme toggle, menu button (slide-in menu)
- Nav tree lives in `src/lib/nav-links.ts` (`children` render indented and stay collapsed until the parent row or its chevron is pressed; the group opens by itself while a child page is current; rendered by `components/layout/nav-tree.tsx`, shared by sidebar and mobile drawer). `/hobbies` is the "Sở thích" landing page listing its children
- Layout grid lives in `src/app/layout.tsx` (sidebar + content column, max 90rem)

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

### Posts index: Topic Blocks

The home page (`/`) is the "Về tôi" content (`AboutContent`); `/about` permanently redirects to `/`. The topic cards live on `/blog` (`BlogIndex`): with `?tag=` it shows the filtered list instead. The page = search + one `TopicSection` per topic (structure inspired by ehkoo.com; no assets reused).

- **Grouping**: `groupPostsByTopic()` in `src/lib/group-posts-by-topic.ts`. A post appears in the block of **every** tag it has (untagged → "Khác"). There is no "Tất cả" card. Tag cards are ordered by post count, then newest featured post.
- **Card**: coloured `#topic` tab (links to `/blog?tag=`). **Collapsed by default**: featured title (2 lines), 2-line excerpt, date, the 16:9 cover (or gradient fallback) and a "Xem thêm" button. Expanded: full excerpt and the "Bài cùng chủ đề" list (up to 5 titles); "Thu gọn" collapses it. Expanding one card does not stretch the others.
- **Grid**: 1 column on phones, 2 from `sm`, 4 from `xl`, so the default view fits one screen (the content column fills the viewport and the footer sits at the bottom).
- `/blog` stays a flat archive (search + tag filter); `BlogCard` shows a cover on top.

### Post Cover (`PostCover`)

- Source: frontmatter/DB `coverImage` (optional). Alt text = post title.
- Always a 16:9 box, so adding/removing an image never shifts layout.
- Fallback (no image, external URL, or load error): gradient from `--color-ac-light` to `--color-ac-border` with the topic label.
- Local paths only (e.g. `/uploads/x.webp`); site CSP is `img-src 'self'`.
- **Image spec for authors**: 16:9, 1600×900 preferred (1200×675 min), WebP/AVIF under ~150 KB, subject centered with ~10% safe margin (cropped for cards and 1.91:1 social previews), no text baked into the image, one consistent visual style, you own the rights. Dark mode dims images slightly via CSS; no second asset needed.

### Footer

One row: `© year name. tagline` on the left, LinkedIn/GitHub on the right (wraps on mobile).

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
.site-container: max-width 960px, 1.5rem gutter (globals.css) — used by navbar, footer, home, /blog, /about, /habits, /projects, admin bar
max-w-[820px]: article page (/blog/[slug]) keeps the narrow reading column
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
- **TopicSection**: Home topic block (featured card + related list)
- **PostCover**: 16:9 cover with gradient fallback
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
