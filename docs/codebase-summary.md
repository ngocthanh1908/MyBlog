# Codebase Summary

**Last Updated**: 2026-08-10
**Version**: 1.2.0
**Repository**: [ngocthanh1908/MyBlog](https://github.com/ngocthanh1908/MyBlog)
**Live**: [phamngocthanh.me](https://phamngocthanh.me)

## Overview

MyBlog is a modern personal blog and portfolio built with Next.js 15 featuring a redesigned UI with forest green color scheme, Vietnamese localization, enhanced reading experience with font controls and progress tracking, and responsive design optimized for all devices.

## Project Structure

```
myblog/
├── .claude/               # Claude Code configuration
│   ├── agents/            # Agent definitions
│   ├── hooks/             # Git hooks
│   ├── skills/            # Specialized skills
│   └── rules/             # Development rules
├── .github/               # GitHub Actions workflows
│   └── workflows/         # CI/CD (auto-deploy on push)
├── docs/                  # Project documentation
│   ├── project-overview-pdr.md
│   ├── code-standards.md
│   ├── codebase-summary.md (this file)
│   ├── design-guidelines.md
│   ├── system-architecture.md
│   └── deployment-guide.md
├── src/                   # Next.js source code
│   ├── app/               # App Router pages & layouts
│   │   ├── (site)/        # Main routes
│   │   ├── blog/          # Blog routes
│   │   └── layout.tsx     # Root layout
│   ├── components/        # React components (45+ files)
│   │   ├── blog/          # Blog components
│   │   ├── home/          # Home page components
│   │   ├── layout/        # Nav, footer, mobile menu
│   │   ├── motion/        # Animation wrappers
│   │   └── ui/            # Generic UI utilities
│   ├── content/           # Blog posts (MDX format)
│   ├── data/              # Static data (about, habits)
│   ├── lib/               # Utilities (site config)
│   └── styles/            # Global CSS with design tokens
├── public/                # Static assets
├── plans/                 # Implementation plans & reports
├── tests/                 # Test files (Vitest)
├── CLAUDE.md              # Claude Code instructions
├── README.md              # Project overview
├── package.json           # Dependencies (Next 15, React 19)
├── tsconfig.json          # TypeScript config
├── tailwind.config.ts     # Tailwind configuration
└── LICENSE                # MIT License
```

## Core Technologies

### Framework & Runtime
- **Next.js**: 15.5.14 (App Router, Turbopack)
- **React**: 19.1.0
- **TypeScript**: 5.x
- **Node.js**: 22+ (GitHub Actions CI, upgraded from 20)
- **Package Manager**: npm

### UI & Styling
- **Tailwind CSS**: 4.x
- **Framer Motion**: Animation library
- **next-themes**: Dark mode support
- **Lucide React**: Icon library
- **Tailwind Typography**: Plugin for prose styling

### Content & Data
- **MDX**: Blog posts via next-mdx-remote 6.0.0
- **gray-matter**: Frontmatter parsing
- **Zod**: Data validation

### Development & Quality
- **Vitest**: Unit testing (pool: threads for better-sqlite3 compatibility)
- **@testing-library/react**: Component testing
- **JSDOM**: DOM simulation
- **ESLint**: Code linting (excludes .claude/ directory)
- **TypeScript**: Type safety (strict mode, Turbopack type checking)

### Deployment
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **GitHub Actions**: CI/CD automation
- **Nginx**: Reverse proxy

## Key Components

### Pages & Routes

**App Router Structure** (`src/app/`):
- **Home** - Hero, blog preview, featured content
- **Blog** - Article listing with category tags and filtering
- **Blog Detail** - Individual article with reading controls
- **About** - Career timeline and biography (Vietnamese)
- **Habits** - Running stats and fitness dashboard
- **Projects** - Portfolio showcase (accessible via /projects)

### Component Library (55+ Files)

**Admin Components**:
- `admin-bar.tsx` - Green top bar indicator when logged in
- `admin-auth-provider.tsx` - Auth state management with token refresh
- `article-form.tsx` - Article creation/editing with markdown editor
- `editor-toolbar.tsx` - Markdown editor toolbar with formatting actions
- `markdown-editor.tsx` - CodeMirror-based markdown editor with preview
- `markdown-preview.tsx` - Live preview with rehype-sanitize XSS protection
- `media-library.tsx` - File upload and media management UI
- `tag-manager.tsx` - Tag CRUD interface

**Blog Components**:
- `blog-card.tsx` - Article preview with metadata
- `blog-comments.tsx` - Giscus GitHub Discussions wrapper
- `search-box.tsx` - Full-text search interface (Pagefind)
- `tag-filter.tsx` - Green pill category filters
- `font-sizer.tsx` - A-/A+ font size controls

**Home Components**:
- `hero-section.tsx` - Main hero with pulse animation
- `human-note.tsx` - Quote block with accent border
- `blog-grid.tsx`, `featured-article.tsx` - Content displays
- `featured-project-card.tsx` - Project showcase
- `latest-run-card.tsx` - Running achievement card
- `bento-grid.tsx` - Flexible layout system

**Layout Components**:
- `navbar.tsx` - Navigation with avatar, theme toggle
- `footer.tsx` - Footer with social links
- `mobile-menu.tsx` - Responsive mobile nav

**Motion & UI**:
- `fade-up.tsx` - Animation wrapper
- `reading-progress.tsx` - Fixed top progress bar
- Various utility components

### Content & Data

**Blog Posts** (`src/content/`):
- MDX files with metadata (title, date, category, readTime)
- Syntax highlighting via Tailwind Typography plugin

**Configuration** (`src/lib/site-config.ts`):
- Site name, subtitle, description (Vietnamese)
- Navigation links with Vietnamese labels
- Social media links

**Static Data** (`src/data/`):
- `about-data.ts` - Biography and career timeline
- `habits-data.ts` - Running stats and goals

### Design System (globals.css)

**CSS Variables**:
- Forest green palette (#0c5238 / #3eb481)
- Warm paper backgrounds
- Animation definitions (pulse-dot, slideUp)
- Reading font size control
- Card shadow depths

**Animations**:
- `pulse-dot` - 2s status badge glow
- `slideUp` - 400ms content reveal
- Smooth theme transitions

**Search, Comments & Content**:
- Pagefind indexing at build time
- Giscus comments with theme sync
- XSS-sanitized search excerpts
- Rehype-sanitize for markdown rendering
- CodeMirror markdown editor with syntax highlighting

## Features

### Visual Design
- ✅ Forest green primary color (#0c5238 light, #3eb481 dark)
- ✅ Warm paper backgrounds (#f6f4ee light, #111312 dark)
- ✅ Plus Jakarta Sans + Newsreader + JetBrains Mono
- ✅ Vietnamese font subsets included
- ✅ Responsive single-column layout (max-w-[820px])

### Navigation & Localization
- ✅ Vietnamese UI labels (Bài viết, Chạy bộ, Về tôi)
- ✅ Language toggle / locale management
- ✅ Vietnamese date formatting
- ✅ OG metadata with vi_VN locale

### Reading Experience
- ✅ Fixed top gradient reading progress bar
- ✅ Font size controls (A-/A+) with localStorage persistence
- ✅ Optimized typography for readability
- ✅ Back button in Vietnamese
- ✅ Yearly running progress bar on habits page

### Content & Community
- ✅ Full-text blog search (Pagefind)
- ✅ GitHub Discussions comments (Giscus)
- ✅ Theme-synced comment widget
- ✅ Blog card "Sua" (Edit) link for admins

### Admin Features
- ✅ AdminBar (green top bar when logged in)
- ✅ Draft post protection
- ✅ Admin blog editing with markdown editor
- ✅ Tag management (CRUD)
- ✅ Media library (upload, view, delete files)
- ✅ Token refresh with auto-renewal
- ✅ Tab-based admin interface

### Components
- ✅ Navbar with avatar, name/subtitle, theme toggle
- ✅ Footer with centered layout and social links
- ✅ Hero section with pulse animation status badge
- ✅ HumanNote quote blocks with accent borders
- ✅ Blog cards with category tags and read time
- ✅ Tag filter pills with hover shadow effects
- ✅ About page with timeline layout
- ✅ Habits/running dashboard with stats
- ✅ SearchBox for full-text search
- ✅ BlogComments for Giscus integration

## Build & Testing

**Scripts** (`package.json`):
- `npm run dev` - Development with Turbopack
- `npm run build` - Production build with Pagefind indexing
- `npm start` - Production server
- `npm run test` - Run test suite
- `npm run lint` - Lint source code

**Testing**:
- 45 passing tests across test files
- Vitest configured with React Testing Library
- Coverage includes:
  - DB CRUD operations
  - JWT authentication
  - SearchBox component render
  - Component and utility functions
- 80%+ code coverage target

## Development Standards

### Code Quality
- TypeScript strict mode
- ESLint configuration
- Tailwind CSS best practices
- Component composition over inheritance
- Utility-first CSS approach

### File Organization
- Components under 200 lines (target)
- One component per file
- Utilities in dedicated modules
- Clear separation of concerns
- Descriptive kebab-case filenames

### Git Workflow
- Conventional commits
- Feature branch protection
- Pre-commit hooks (linting, tests)
- Automated deployment on master push

## Deployment

**Environment**: VPS at 103.98.160.56:8001
**Process**: Docker Compose with Nginx reverse proxy
**Volumes**: Named volumes for blog-data (SQLite) and blog-uploads (static files)
**Static Assets**: Nginx /uploads/ serving with 10M size limit
**CI/CD**: GitHub Actions auto-deploy on push with --env-file support
**Deployment Guide**: `docs/deployment-guide.md`
**Security**: Timing-safe auth, draft post protection, rate limiting, XSS sanitization

## Documentation Files

- **project-overview-pdr.md** - Project vision, features, requirements
- **code-standards.md** - Naming conventions, file organization
- **design-guidelines.md** - Color system, typography, components
- **system-architecture.md** - Architecture and data flow
- **deployment-guide.md** - VPS setup and deployment
- **codebase-summary.md** - This file

## Key Metrics

| Metric | Value |
|--------|-------|
| Framework | Next.js 15.5.14 |
| React Version | 19.1.0 |
| Components | 50+ files |
| Search | Pagefind (static indexing) |
| Comments | Giscus (GitHub Discussions) |
| Tests | 45 tests (CRUD, auth, search, render) |
| Test Pass Rate | 100% |
| Build Time | < 30s (Turbopack + Pagefind) |
| Page Load | < 1.5s (FCP) |
| Docker Compose | Named volumes (blog-data, blog-uploads) |

## Related Documentation

- [Project Overview PDR](./project-overview-pdr.md)
- [Code Standards](./code-standards.md)
- [Design Guidelines](./design-guidelines.md)
- [System Architecture](./system-architecture.md)
- [Deployment Guide](./deployment-guide.md)
