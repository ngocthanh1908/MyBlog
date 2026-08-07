# Project Overview & Product Development Requirements (PDR)

**Project Name**: MyBlog - Personal Portfolio & Blog
**Version**: 1.0.0
**Last Updated**: 2026-08-06
**Status**: Active Development (UX Redesign Complete)
**Repository**: https://github.com/ngocthanh1908/MyBlog
**Live Site**: https://blog.phamngocthanh.io.vn

## Executive Summary

MyBlog is a modern personal blog and portfolio built with Next.js 15, featuring a completely redesigned user interface with Vietnamese localization, an improved reading experience, and a compelling visual design using forest green tones and serif typography. The site showcases blog articles, running achievements, project portfolio, and personal information through an elegant, responsive interface.

## Project Purpose

### Vision
Create a beautiful, performant personal blog and portfolio that effectively communicates technical expertise, writing, and personal interests through thoughtful design and engaging content.

### Mission
Deliver a blog platform that:
- Showcases technical writing with excellent reading experience
- Highlights running passion and fitness journey
- Presents portfolio of projects and achievements
- Provides seamless navigation in both English and Vietnamese
- Offers optimal performance on all devices and network speeds
- Maintains clean, maintainable codebase with modern tech stack

### Key Features (Post-Redesign)
- **Multilingual UI**: Full Vietnamese localization for nav, labels, and metadata
- **Forest Green Design**: Custom color palette (#0c5238 light, #3eb481 dark)
- **Reading Experience**: Font sizer controls, reading progress bar, optimized typography
- **Content**: MDX-powered blog posts with metadata and category tagging
- **Portfolio**: Project showcase with links and descriptions
- **Habits**: Running statistics and personal goals dashboard
- **Responsive**: Mobile-first design, optimized for all screen sizes

## Target Audience

### Primary Visitors
1. **Potential Employers/Clients**: Evaluating skills and experience
2. **Technology Enthusiasts**: Reading technical articles and insights
3. **Running Community**: Following running journey and fitness updates
4. **Networking Contacts**: Learning about professional background
5. **Casual Readers**: Enjoying personal essays and thoughts

### User Scenarios

**Scenario 1: Employer Reviewing Portfolio**
- **Goal**: Assess technical skills and project experience
- **Needs**: Clear project descriptions, technical depth, code examples
- **Solution**: Dedicated projects page with links, descriptions, and live demos

**Scenario 2: Blog Reader Discovering Content**
- **Goal**: Find and read interesting articles
- **Needs**: Easy browsing, search/filter by category, responsive reading
- **Solution**: Blog grid with tags, reading progress, font sizing controls

**Scenario 3: Running Community Follower**
- **Goal**: Track running progress and achievements
- **Needs**: Stats, personal records, goals, MAF philosophy
- **Solution**: Habits page with dashboard, timeline, and stats display

## Key Features & Components

### 1. Design System (Post-Redesign)

**Color Palette**:
- **Primary**: Forest green (#0c5238 light, #3eb481 dark)
- **Background**: Warm paper (#f6f4ee light, #111312 dark)
- **Accent Hover**: Derived from primary, adjustable
- **Accessible**: WCAG AA contrast compliance

**Typography**:
- **Sans**: Plus Jakarta Sans (UI, navigation)
- **Serif**: Newsreader (headings, emphasis)
- **Mono**: JetBrains Mono (code blocks)
- **Vietnamese Subsets**: Full support for vi_VN locale

**Layout**:
- **Max Width**: Narrowed to 820px single-column for focused reading
- **Responsive**: Mobile-first, optimized for all screen sizes
- **Animations**: Pulse effects, smooth transitions, fade-in

### 2. Core Pages & Components

**Navigation**:
- **Navbar**: Avatar with initials, name/subtitle, circular theme toggle
- **Footer**: Centered layout, Vietnamese text, social links
- **Mobile Menu**: Responsive hamburger navigation

**Home Page**:
- **Hero**: Status badge with pulse, serif italic heading, Vietnamese copy
- **HumanNote**: Quote block with accent border (NEW)
- **Blog Preview**: Latest articles grid
- **Featured Articles**: Highlighted content
- **Project Showcase**: Portfolio grid
- **Stats**: Running/habits dashboard preview

**Blog Section** (`/blog`):
- **Blog Grid**: Card layout with category tags, Vietnamese dates, read time
- **Tag Filter**: Green pill buttons, active state with shadow
- **Blog Detail**: Full article with reading progress bar, font sizer, back button
- **ReadingProgress**: Fixed top gradient bar tracking scroll (NEW)
- **FontSizer**: A-/A+ controls for font size adjustment (NEW)

**Other Pages**:
- **About** (`/about`): Career timeline layout
- **Habits** (`/habits`): Stats dashboard, MAF philosophy section
- **Projects**: Portfolio showcase (not in main nav, accessible at `/projects`)

### 3. Data Management

**Site Configuration** (`src/lib/site-config.ts`):
- Name, subtitle, description (Vietnamese)
- Navigation links (updated)
- Social links including blog URL

**Content Data** (`src/data/`):
- `about-data.ts`: Biography, career timeline (Vietnamese)
- `habits-data.ts`: Running stats, goals, philosophy (Vietnamese)
- Blog posts: MDX format in `src/content/`

### 4. Visual Enhancements

**Animations**:
- Pulse-dot effect for status badges
- Slide-up transitions for content
- Fade-up motion for elements

**Reading Experience**:
- Font size controls (A-/A+)
- Reading progress bar (top fixed)
- Optimized line height and spacing
- Vietnamese-optimized typography

## Technical Requirements

### Functional Requirements

**FR1: Content Rendering**
- Render MDX blog posts with syntax highlighting
- Support markdown formatting with typography plugin
- Generate OG images dynamically
- Handle metadata (date, title, category, readTime)

**FR2: Navigation & Routing**
- App Router with dynamic routes
- URL-based blog filtering by category
- Proper 404 handling
- Vietnamese locale routing

**FR3: Theme Management**
- Dark/light mode toggle
- Persist theme preference
- Apply theme to all components
- Smooth transitions

**FR4: Reading Experience**
- Display reading progress bar
- Font size controls (+/- buttons)
- Reading time estimation
- Optimized typography per language

**FR5: Data Management**
- Load site configuration
- Parse blog metadata from MDX
- Manage habits/running data
- Handle static content files

**FR6: Internationalization**
- Vietnamese UI labels and content
- Locale-specific date formatting
- Proper HTML lang attribute
- OG locale metadata (vi_VN)

### Non-Functional Requirements

**NFR1: Performance**
- Static generation for blog posts (ISG)
- Optimized images with next/image
- Minimal JavaScript bundle
- Fast Time-to-Interactive < 2s

**NFR2: SEO**
- Proper Open Graph metadata
- Structured data for articles
- XML sitemap support
- Canonical URLs

**NFR3: Accessibility**
- WCAG 2.1 AA compliance
- Semantic HTML markup
- Keyboard navigation support
- Screen reader friendly

**NFR4: Responsiveness**
- Mobile-first design
- Tablet and desktop optimization
- Touch-friendly interactive elements
- Flexible layouts

**NFR5: Maintainability**
- Component-based architecture
- Clear file organization
- Type-safe with TypeScript
- Well-documented code

**NFR6: Reliability**
- Zero unhandled errors
- Graceful fallbacks
- Build validation
- Test coverage > 80%

## Success Metrics

### User Engagement
- Monthly page views
- Average session duration
- Blog post read rate
- Click-through to projects/social

### Technical Performance
- Page load time: < 1.5s (First Contentful Paint)
- Lighthouse Score: > 90
- Core Web Vitals: All green
- Mobile performance: Excellent

### Content Metrics
- Blog posts: 30+ articles
- Project portfolio: 10+ projects
- Running achievements: 100+ runs logged
- Category distribution: Balanced across topics

### Quality Metrics
- Test coverage: > 80%
- Build success rate: 100%
- Deployment frequency: Daily capable
- Error rate: < 0.1%

### SEO & Discoverability
- Indexed pages: 100%
- Organic search traffic: Growing
- Backlinks from technical sites
- Featured snippets in search results

## Technical Architecture

### Tech Stack
| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, standalone output) |
| UI | React 19, Tailwind CSS 4, Framer Motion |
| Content | MDX via next-mdx-remote, gray-matter, Zod |
| Fonts | Plus Jakarta Sans, Newsreader, JetBrains Mono |
| Theming | next-themes (dark/light), CSS custom properties |
| Testing | Vitest, @testing-library/react |
| Deploy | Docker (multi-stage), Nginx reverse proxy |
| CI/CD | GitHub Actions (lint → test → build → SSH deploy) |
| CDN | Cloudflare (DNS proxy, SSL) |
| VPS | Ubuntu on 103.98.160.56, port 8001 |

### Key Architecture Decisions
- **Static generation**: All pages pre-rendered at build time for performance
- **MDX content**: Blog posts as MDX files with Zod-validated frontmatter
- **Single-column layout**: 820px max-width for focused reading experience
- **Vietnamese-first**: All UI labels and metadata in Vietnamese (vi_VN locale)
- **CSS custom properties**: Design tokens for seamless dark/light theming

### See Also
- [System Architecture](./system-architecture.md)
- [Codebase Summary](./codebase-summary.md)
- [Code Standards](./code-standards.md)
- [Design Guidelines](./design-guidelines.md)
- [Deployment Guide](./deployment-guide.md)
