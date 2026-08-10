# MyBlog - Project Changelog

**Last Updated**: 2026-08-10
**Repository**: [ngocthanh1908/MyBlog](https://github.com/ngocthanh1908/MyBlog)

All notable changes to MyBlog are documented below. Format follows [Keep a Changelog](https://keepachangelog.com).

---

## [1.2.0] - 2026-08-10 (CMS Expansion v2 & Security Hardening)

### Security Enhancements (Critical)
- **Token Type Enforcement**: Enforce access vs refresh token types in `verifyToken()` to prevent token misuse attacks
- **Rate Limit TOCTOU Fix**: Replaced race condition in rate limiting with atomic `INSERT ON CONFLICT` upsert
- **Rate Limit Index**: Added index on `rate_limits(window_start)` for cleanup query performance
- **XSS Prevention**: Integrated `rehype-sanitize` in markdown preview to prevent XSS via markdown rendering
- **API Pagination**: Added pagination to uploads API to prevent unbounded directory listing vulnerability

### Features Added
- **Markdown Editor**: New editor with CodeMirror integration, live preview, and toolbar (editor-toolbar.tsx, markdown-editor.tsx, markdown-preview.tsx)
- **Tag Management**: Complete tag CRUD API (src/app/api/tags/*) with admin UI (tag-manager.tsx)
- **Token Refresh Endpoint**: New POST /api/auth/refresh route for token auto-renewal
- **Media Library**: Media file manager component for article uploads (media-library.tsx)
- **File Deletion**: New DELETE endpoint for removing uploaded files (src/app/api/uploads/[name]/route.ts)
- **Auth Auto-Renewal**: Improved AdminAuthProvider with automatic token refresh before expiry
- **Admin Tab Navigation**: Enhanced admin page with tab-based interface
- **Modal Accessibility**: Improved modal component with better focus management and ARIA attributes

### Dependencies Added
- `rehype-sanitize` - HTML sanitization for markdown rendering

### Modified Components
- `admin-auth-provider.tsx` - Token auto-renewal, improved refresh flow
- `article-form.tsx` - Integrated markdown editor and media library
- `modal.tsx` - Accessibility improvements (focus trap, ARIA roles)
- `auth/route.ts` - Enhanced auth flow with refresh token
- `uploads/route.ts` - Pagination support

### Related Commits
- `4a072f1` - feat: add CMS expansion v2
- `5ea1650` - fix: address critical security vulnerabilities

---

## [1.1.0] - 2026-08-07 (CMS Expansion Phases 4-8)

### Infrastructure & CI Fixes
- **ESLint Config**: Excluded `.claude/` directory from linting (447 lint errors from skill scripts)
- **Vitest Pool**: Switched from `forks` to `threads` (better-sqlite3 native addon segfaulted on Node 24 with worker pools)
- **CI/Deploy Workflows**: Upgraded Node.js from 20 to 22 (Node 20 deprecated on GitHub Actions, forced to Node 24 causing segfault)
- **Pagefind Import**: Uses indirect `new Function` to bypass Turbopack static resolution at build time
- **SQLite Runtime Files**: Removed `.sqlite-shm`, `.sqlite-wal` from git, added to `.gitignore`
- **Type Safety**: Added type annotation and undefined guard for post variable in blog page (Turbopack stricter type checking)

### Added
- **Pagefind Search**: Static search indexing at build time for all blog posts
  - SearchBox component on /blog page for full-text search
  - postbuild script for index generation
  - Dependency: `pagefind` (dev)
- **Giscus Comments**: GitHub Discussions-backed comments on blog detail pages
  - Theme-synced (light/dark mode)
  - Dependency: `@giscus/react`
  - Env vars: `NEXT_PUBLIC_GISCUS_REPO_ID`, `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
- **Admin UI Enhancements**:
  - AdminBar component (green top bar when logged in)
  - Yearly running progress bar on habits page
  - Blog card "Sua" (Edit) link for DB posts when admin logged in
- **Docker & Deployment**:
  - Dockerfile updated for better-sqlite3 native dependencies + pagefind
  - docker-compose.yml with named volumes (blog-data, blog-uploads)
  - Nginx /uploads/ static serving with 10M upload limit
  - GitHub Actions deploy workflow with --env-file support
- **Testing**:
  - DB CRUD operations tests
  - JWT authentication tests
  - SearchBox component render tests
  - Total: 45 tests passing
- **Security Fixes**:
  - Timing-safe password comparison in auth
  - Draft auth check on GET /api/posts/[id]
  - Rate limit memory leak fix
  - XSS sanitization on search excerpts

### Changed
- API auth middleware refined for draft posts
- Admin component styling for consistency
- Docker image optimized for better-sqlite3 builds

### Dependencies Added
- `pagefind` (dev) - Static search indexing
- `@giscus/react` - Comments widget

### Environment Variables
- `NEXT_PUBLIC_GISCUS_REPO_ID` - GitHub repo ID for discussions
- `NEXT_PUBLIC_GISCUS_CATEGORY_ID` - GitHub discussions category ID

---

## [1.0.0] - 2026-08-06 (UX Redesign Complete)

### Added
- **Forest green design system** (#0c5238 / #3eb481)
- **Vietnamese localization** (UI labels, dates, OG metadata)
- **Enhanced reading experience**:
  - Font size controls (A-/A+)
  - Reading progress bar (fixed top, gradient)
  - HumanNote component (quote blocks)
- **Component library** (45+ files)
  - Navbar with avatar and theme toggle
  - Blog cards with tags and read time
  - Tag filter pills
  - Hero section with pulse animation
  - Timeline layout for About page
  - Stats dashboard for Habits page
- **Responsive design** across all devices
- **Comprehensive test suite** (35 tests, 6 files)

### Features
- Dark mode support via next-themes
- Tailwind CSS 4 with custom properties
- MDX blog posts with gray-matter parsing
- GitHub Actions CI/CD pipeline
- Docker multi-stage build
- Nginx reverse proxy configuration

---

## Version History

| Version | Date | Phase | Status |
|---------|------|-------|--------|
| 1.1.0 | 2026-08-07 | CMS Expansion (4-8) | ✅ Released |
| 1.0.0 | 2026-08-06 | UX Redesign | ✅ Released |

---

## Related Documents

- [Development Roadmap](./project-roadmap.md)
- [System Architecture](./system-architecture.md)
- [Code Standards](./code-standards.md)
