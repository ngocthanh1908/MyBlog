# Code Standards & Codebase Structure

**Last Updated**: 2026-08-06
**Version**: 2.0.0
**Applies To**: MyBlog - Personal Blog & Portfolio

## Overview

Coding standards, file organization, naming conventions, and best practices for MyBlog. All code must adhere to these standards for consistency and maintainability.

## Core Development Principles

### YAGNI (You Aren't Gonna Need It)
- Avoid over-engineering and premature optimization
- Implement features only when needed
- Start simple, refactor when necessary

### KISS (Keep It Simple, Stupid)
- Prefer simple, straightforward solutions
- Write code that's easy to understand and modify
- Choose clarity over cleverness

### DRY (Don't Repeat Yourself)
- Eliminate code duplication
- Extract common logic into reusable functions/modules
- Maintain single source of truth

## File Organization Standards

### Directory Structure

```
myblog/
├── .claude/                    # Claude Code configuration
├── .github/                   # GitHub Actions workflows
├── docs/                      # Project documentation
├── src/                       # Next.js source code
│   ├── app/                   # App Router pages and layouts
│   │   ├── (site)/            # Main site routes
│   │   ├── blog/              # Blog page routes
│   │   └── layout.tsx         # Root layout
│   ├── components/            # React components
│   │   ├── blog/              # Blog-specific components
│   │   ├── home/              # Home page components
│   │   ├── layout/            # Layout components (nav, footer)
│   │   ├── motion/            # Animation components
│   │   └── ui/                # Generic UI components
│   ├── content/               # Blog posts (MDX format)
│   │   └── *.mdx              # Blog article files
│   ├── data/                  # Static data
│   │   ├── about-data.ts      # About page data
│   │   └── habits-data.ts     # Habits/running data
│   ├── lib/                   # Utility functions
│   │   └── site-config.ts     # Site configuration
│   └── styles/                # Global CSS
│       └── globals.css        # Design tokens, animations
├── public/                    # Static assets
├── plans/                     # Implementation plans and reports
├── .gitignore
├── CLAUDE.md                  # Claude Code instructions
├── README.md
├── package.json
├── tsconfig.json              # TypeScript configuration
├── next.config.ts
├── tailwind.config.ts
└── LICENSE
```

### File Naming Conventions

**React Components** (`src/components/`):
- Format: `kebab-case.tsx` (e.g., `blog-card.tsx`, `hero-section.tsx`)
- Export named function matching PascalCase (e.g., `export function BlogCard`)
- Group by feature: `blog/`, `home/`, `layout/`, `motion/`, `ui/`

**Pages** (`src/app/`):
- Follow Next.js App Router conventions: `page.tsx`, `layout.tsx`, `route.tsx`
- Dynamic routes: `[slug]/page.tsx`

**Data Files** (`src/data/`):
- Format: `kebab-case.ts` with descriptive suffix (e.g., `about-data.ts`, `habits-data.ts`)
- Export typed interfaces and const arrays
- Validate with Zod where applicable

**Content** (`src/content/blog/`):
- Format: `kebab-case.mdx` matching URL slug
- Required frontmatter: title, date, tags, excerpt

**Styles** (`src/styles/`):
- Single `globals.css` with CSS custom properties
- Use Tailwind utility classes in components
- Custom animations defined in `globals.css`

**Documentation** (`docs/`):
- Format: `kebab-case.md` with descriptive names
- Examples:
  - `project-overview-pdr.md` -- Project overview and requirements
  - `codebase-summary.md` -- Codebase structure and overview
  - `code-standards.md` -- This file
  - `system-architecture.md` -- Architecture and data flow
  - `design-guidelines.md` -- Design system and component usage

## File Size Management

### Hard Limits
- **Maximum file size**: 500 lines of code
- Files exceeding 500 lines MUST be refactored
- Exception: Auto-generated files (with clear marking)

### Refactoring Strategies

**When file exceeds 500 lines**:
1. **Extract Utility Functions**: Move to separate `utils/` directory
2. **Component Splitting**: Break into smaller, focused components
3. **Service Classes**: Extract business logic to dedicated services
4. **Module Organization**: Group related functionality into modules

## Naming Conventions

### Variables & Functions

**JavaScript/TypeScript**:
- **Variables**: camelCase
  ```typescript
  const blogTitle = 'My Article';
  const isPublished = true;
  const readingTime = 5; // minutes
  ```

- **Functions**: camelCase
  ```typescript
  function formatReadTime(minutes: number): string { }
  const getBlogPost = (slug: string) => { };
  ```

- **React Components**: PascalCase
  ```typescript
  function BlogCard() { }
  const HeroSection = () => { };
  ```

- **Constants**: UPPER_SNAKE_CASE or const (immutable)
  ```typescript
  const MAX_TITLE_LENGTH = 100;
  const BLOG_CATEGORIES = ['Tech', 'Running', 'Life'] as const;
  ```

- **CSS Variables**: kebab-case
  ```css
  --color-primary: #0c5238;
  --color-accent: #3eb481;
  --reading-font-size: 18px;
  ```

### Files & Directories

**Source Files**: kebab-case (`blog-card.tsx`, `site-config.ts`)

**Test Files**: Match source pattern + `.test` (`blog-card.test.tsx`, `habits-data.test.ts`)

**Directories**: kebab-case (`src/components/`, `src/lib/`)

## Code Style

### TypeScript/React
- Strict mode enabled
- Prefer `interface` over `type` for object shapes
- Use `const` assertions for static data
- Named exports (no default exports except pages)
- 2-space indentation, no trailing whitespace
- Prefer 80-100 char lines, hard limit 120

### CSS/Tailwind
- CSS custom properties for theming (`--color-*`)
- Tailwind classes directly in JSX
- Arbitrary values for precise sizing: `text-[1.15rem]`, `max-w-[820px]`
- Animation classes defined in `globals.css`

### Testing
- Vitest + @testing-library/react
- Test files: `src/__tests__/**/*.test.{ts,tsx}`
- Data validation tests for all data files
- Component rendering tests for key UI

### Error Handling
- Use try-catch for async operations
- Provide actionable error messages
- Never expose sensitive data in logs

### Comments
- Explain WHY, not WHAT
- Complex logic requires explanation
- Self-documenting code preferred over comments

## Git Standards

### Commit Messages

**Format**: Conventional Commits (`type(scope): description`)

**Types**: `feat`, `fix`, `docs`, `refactor`, `test`, `ci`, `perf`, `style`

**Rules**:
- Subject line: imperative mood, lowercase, no period, max 72 chars
- Body: explain WHY, not WHAT
- No AI attribution or signatures

### Pre-Commit Checklist

- No secrets or credentials
- No debug code or console.logs
- All tests pass locally
- Files under 500 lines
- Conventional commit message

## Security Standards

- Use environment variables for API keys and credentials
- Add `.env*` to `.gitignore`
- Validate and sanitize all inputs
- Never log passwords or tokens

## References

- [Project Overview PDR](./project-overview-pdr.md)
- [Codebase Summary](./codebase-summary.md)
- [System Architecture](./system-architecture.md)
- [Conventional Commits](https://conventionalcommits.org/)
