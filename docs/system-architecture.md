# System Architecture

**Last Updated**: 2026-08-06
**Version**: 1.0.0
**Project**: MyBlog - Personal Blog & Portfolio

## Overview

MyBlog is a modern Next.js application with a client-side rendering focus, server-side static generation for blog posts, and a clean component-based architecture. The system combines MDX for dynamic content, Tailwind CSS for styling, and a responsive design system supporting both English and Vietnamese locales.

## Architectural Pattern

### Pattern Classification
**Primary Pattern**: Component-Based React Application with Static Site Generation
**Secondary Patterns**:
- Container/Presentational Components
- Custom Hooks for state management
- Server-Side Rendering (ISG) for blog posts
- Theme Provider Pattern (dark mode)
- Composition over Inheritance

### Design Philosophy
- **Component-Driven**: Reusable, focused React components
- **Content-First**: MDX for flexible, dynamic content
- **Performance-Optimized**: Static generation where possible
- **Mobile-First**: Responsive design from the ground up
- **Accessible**: WCAG 2.1 AA compliance
- **Type-Safe**: TypeScript for runtime safety

## System Components

### 1. Presentation Layer

#### 1.1 Pages (App Router)
**Location**: `src/app/`
**Responsibility**: Route handling and page composition
**Routes**:
- `/` - Home page with hero, featured content, blog preview
- `/blog` - Blog listing with tag filtering
- `/blog/[slug]` - Individual blog article
- `/about` - Career timeline and biography
- `/habits` - Running/fitness dashboard
- `/projects` - Project portfolio

**Technology**: Next.js App Router, React Server Components

#### 1.2 Components
**Location**: `src/components/`
**Responsibility**: Reusable UI elements and layouts
**Organization**:
- `blog/` - Blog-specific components (BlogCard, TagFilter, FontSizer)
- `home/` - Home page components (HeroSection, HumanNote, FeaturedArticle)
- `layout/` - Layout components (Navbar, Footer, MobileMenu)
- `motion/` - Animation wrappers (FadeUp, MotionProvider)
- `ui/` - Generic utilities (ReadingProgress, etc.)

**Technology**: React 19, Framer Motion, Tailwind CSS

#### 1.3 Styling System
**Location**: `src/styles/globals.css`
**Responsibility**: Design tokens, animations, theme variables
**Features**:
- CSS custom properties for colors, spacing
- Animation definitions (pulse-dot, slideUp)
- Theme-aware selectors (light/dark mode)
- Reading font size variable
- Responsive utility classes

**Technology**: Tailwind CSS 4, CSS Custom Properties

### 2. Content Layer
**Location**: `src/content/blog/`
- MDX files with frontmatter (title, date, tags, excerpt, draft)
- Parsed by `src/lib/mdx-utils.ts` using gray-matter + Zod validation
- Compiled at build time via next-mdx-remote/rsc
- Path traversal guard on slug resolution

### 3. Data Layer
**Location**: `src/data/`
- `about-data.ts`: bio (string[]), timeline (TimelineEntry[])
- `habits-data.ts`: runStats (RunStat[]), mafTitle, mafContent
- `projects-data.ts`: projects array with Zod schema validation

### 4. Configuration
- `src/lib/site-config.ts`: name, subtitle, description, navLinks, socialLinks
- `src/lib/structured-data.ts`: JSON-LD generators (Person, BlogPosting)
- `globals.css`: CSS custom properties, theme tokens, animations

### 5. Build & Deploy
- Next.js 15 with standalone output
- Static generation for all pages (SSG)
- Dynamic params for `blog/[slug]`
- Docker multi-stage build (builder -> runner)
- Nginx reverse proxy on VPS (port 8001 -> 3000)
- GitHub Actions: CI (lint+test+build) -> Deploy (SSH to VPS)

## Data Flow

```
MDX files -> gray-matter parse -> Zod validate -> getAllPosts()/getPostBySlug()
                                                      |
Page components <- React Server Components <- compileMDX()
                                                      |
Static HTML -> Nginx -> Cloudflare -> User
```

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, standalone) |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Content | MDX via next-mdx-remote, gray-matter |
| Fonts | Plus Jakarta Sans, Newsreader, JetBrains Mono |
| Theming | next-themes, CSS custom properties |
| Testing | Vitest, @testing-library/react |
| Deploy | Docker, Nginx, GitHub Actions |
| CDN | Cloudflare (DNS + proxy) |

## References

- [Project Overview PDR](./project-overview-pdr.md)
- [Codebase Summary](./codebase-summary.md)
- [Code Standards](./code-standards.md)
