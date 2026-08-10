# System Architecture

**Last Updated**: 2026-08-10
**Version**: 1.2.0
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
- `admin/` - Admin features (AdminBar for logged-in users)
- `blog/` - Blog-specific components (BlogCard, TagFilter, FontSizer, SearchBox, BlogComments)
- `home/` - Home page components (HeroSection, HumanNote, FeaturedArticle)
- `layout/` - Layout components (Navbar, Footer, MobileMenu)
- `motion/` - Animation wrappers (FadeUp, MotionProvider)
- `ui/` - Generic utilities (ReadingProgress, etc.)

**Technology**: React 19, Framer Motion, Tailwind CSS, Giscus (comments), CodeMirror (editor), rehype-sanitize (XSS protection)

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

### 4. Search & Comments
**Search (Pagefind)**:
- Static indexing at build time via postbuild script
- SearchBox component on /blog page
- Full-text search on all blog posts
- XSS-sanitized excerpts

**Comments (Giscus)**:
- GitHub Discussions-backed comments on blog detail pages
- Theme-synced (light/dark mode)
- Requires: NEXT_PUBLIC_GISCUS_REPO_ID, NEXT_PUBLIC_GISCUS_CATEGORY_ID
- Component: `src/components/blog/blog-comments.tsx`

**Technology**: Pagefind (dev), @giscus/react

### 5. API Layer

**Authentication Endpoints**:
- `POST /api/auth` - Login (returns access + refresh tokens)
- `POST /api/auth/refresh` - Token renewal (refresh token → new access token)

**Content Management**:
- `GET /api/posts` - List all posts (with pagination)
- `GET /api/posts/[id]` - Get post by ID (protected if draft)
- `POST /api/posts` - Create post (requires auth)
- `PUT /api/posts/[id]` - Update post (requires auth)
- `DELETE /api/posts/[id]` - Delete post (requires auth)

**Tag Management** (v1.2+):
- `GET /api/tags` - List all tags (requires auth)
- `POST /api/tags` - Create tag (requires auth)
- `PUT /api/tags/[name]` - Rename tag (requires auth)
- `DELETE /api/tags/[name]` - Delete tag (requires auth)

**Media Management** (v1.2+):
- `GET /api/uploads` - List files with pagination (requires auth)
- `POST /api/uploads` - Upload file (requires auth)
- `DELETE /api/uploads/[name]` - Delete file (requires auth)

**Security**:
- Token type enforcement (access vs refresh)
- Rate limiting with atomic INSERT ON CONFLICT
- Bearer token validation on all protected endpoints
- XSS sanitization in markdown rendering

### 6. Configuration
- `src/lib/site-config.ts`: name, subtitle, description, navLinks, socialLinks
- `src/lib/auth-utils.ts`: Token generation/verification with type checking
- `src/lib/db.ts`: Database operations with rate limiting
- `globals.css`: CSS custom properties, theme tokens, animations

### 7. Build & Deployment

**Build Process**:
- Next.js 15 with standalone output
- Static generation for all pages (SSG)
- Dynamic params for `blog/[slug]`
- Pagefind search index generation via postbuild script
- Docker multi-stage build (builder -> runner)

**Docker Composition**:
- Docker Compose orchestration with named volumes
- `blog-data`: Persistent SQLite database and uploads
- `blog-uploads`: Static files served via Nginx at /uploads/
- Dockerfile optimized for better-sqlite3 native dependencies

**Deployment**:
- Nginx reverse proxy on VPS (port 8001 -> 3000)
- Static asset serving with 10M upload size limit
- GitHub Actions: CI (lint+test+build) -> Deploy (SSH to VPS with --env-file)

**Security**:
- Timing-safe password comparison
- Draft post auth protection on GET /api/posts/[id]
- Rate limiter without connection leaks
- XSS sanitization on search excerpts

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
| Search | Pagefind (static indexing) |
| Comments | Giscus (GitHub Discussions) |
| Database | better-sqlite3 (optional posts storage) |
| Fonts | Plus Jakarta Sans, Newsreader, JetBrains Mono |
| Theming | next-themes, CSS custom properties |
| Testing | Vitest, @testing-library/react |
| Deploy | Docker, Docker Compose, Nginx, GitHub Actions |
| CDN | Cloudflare (DNS + proxy) |

## References

- [Project Overview PDR](./project-overview-pdr.md)
- [Codebase Summary](./codebase-summary.md)
- [Code Standards](./code-standards.md)
