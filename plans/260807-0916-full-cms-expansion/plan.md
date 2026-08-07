---
title: "Full CMS Expansion"
description: "Add admin CRUD, SQLite storage, comments, search, and UI enhancements to existing Next.js 15 blog"
status: pending
priority: P1
effort: 28h
branch: master
tags: [cms, admin, sqlite, giscus, pagefind, ui]
created: 2026-08-07
---

# Full CMS Expansion Plan

## Architecture Overview

```
Browser ──► Nginx:80 ──► Next.js:3000
                            ├── /api/auth          (JWT login)
                            ├── /api/posts          (CRUD)
                            ├── /api/upload          (image files)
                            ├── /admin              (admin UI, client-side auth gate)
                            ├── /blog/[slug]        (MDX + DB posts, Giscus comments)
                            └── / (home)            (Pagefind search + tag filter)

Storage:
  MDX files ── src/content/blog/*.mdx (read-only, existing 2 posts)
  SQLite DB ── data/blog.sqlite (new posts, Docker volume mount)
  Uploads  ── public/uploads/ (images, Docker volume mount)
```

## Data Flow

1. **Read path**: `getAllPosts()` merges MDX posts + SQLite posts, sorted by date desc
2. **Write path**: Admin UI → POST /api/posts → SQLite insert → redirect to admin list
3. **Image path**: Admin form → POST /api/upload → save to public/uploads/ → return URL
4. **Auth path**: Login modal → POST /api/auth → JWT token in localStorage → sent as Bearer header
5. **Search path**: Build-time Pagefind indexes .next output → client loads index on search interaction
6. **Comments path**: Article page renders Giscus component → iframe loads GitHub Discussion

## New Dependencies

| Package | Purpose | Size |
|---------|---------|------|
| better-sqlite3 | SQLite driver (sync, fast) | ~2MB native |
| jsonwebtoken | JWT sign/verify | ~50KB |
| @giscus/react | GitHub Discussion comments | ~3KB |
| pagefind | Static search indexer | CLI tool |

## Phases

| # | Phase | Effort | Status | Files Owned |
|---|-------|--------|--------|-------------|
| 1 | [Database + API Foundation](./phase-01-database-api-foundation.md) | 5h | Pending | src/lib/db.ts, src/lib/auth-utils.ts, src/app/api/**, data/ |
| 2 | [Admin UI](./phase-02-admin-ui.md) | 6h | Pending | src/app/admin/**, src/components/admin/**, src/components/ui/toast.tsx |
| 3 | [Content Layer Integration](./phase-03-content-layer-integration.md) | 3h | Pending | src/lib/mdx-utils.ts, src/app/page.tsx, src/app/blog/**, src/app/sitemap.ts |
| 4 | [Search with Pagefind](./phase-04-search-pagefind.md) | 3h | Pending | src/components/blog/search-box.tsx, package.json scripts, next.config.ts |
| 5 | [Comments with Giscus](./phase-05-comments-giscus.md) | 2h | Pending | src/components/blog/comments-section.tsx |
| 6 | [UI Enhancements](./phase-06-ui-enhancements.md) | 4h | Pending | src/components/layout/admin-bar.tsx, habits page, navbar, blog-card |
| 7 | [Docker & Deployment](./phase-07-docker-deployment.md) | 3h | Pending | Dockerfile, docker-compose.prod.yml, nginx/default.conf, .github/workflows/** |
| 8 | [Testing](./phase-08-testing.md) | 2h | Pending | src/__tests__/** |

## Dependency Graph

```
Phase 1 (DB+API) ──► Phase 2 (Admin UI) ──► Phase 3 (Content Integration)
                                                       │
Phase 4 (Search) ◄────────────────────────────────────┘
Phase 5 (Comments) — independent, can run parallel with Phase 2+
Phase 6 (UI) — depends on Phase 2 (admin bar needs auth context)
Phase 7 (Docker) — depends on Phase 1 (volume mounts for DB+uploads)
Phase 8 (Testing) — depends on all above
```

## Rollback Strategy

- Phase 1-2: Delete API routes + db.ts + admin page. No existing files modified yet.
- Phase 3: Revert mdx-utils.ts to original (MDX-only). One file change.
- Phase 4: Remove pagefind script from build. Search component is additive.
- Phase 5: Remove Giscus component from article page. One line removal.
- Phase 6: Revert individual UI component changes (git revert per commit).
- Phase 7: Revert docker-compose.prod.yml and Dockerfile changes.

## Backwards Compatibility

- Existing 2 MDX posts remain untouched and functional throughout
- No breaking changes to existing URLs
- getAllPosts() returns same BlogPost type, just from two sources
- No database migration needed (fresh SQLite schema)

## Security Checklist

- [ ] JWT_SECRET and ADMIN_PASSWORD in .env.local (git-ignored)
- [ ] API POST/PUT/DELETE routes require valid JWT
- [ ] Image upload: validate mimetype (jpg/png/webp/gif), max 5MB
- [ ] SQLite parameterized queries (no SQL injection)
- [ ] CSP header update for Giscus iframe
- [ ] Rate limiting on auth + upload endpoints
- [ ] Slug validation on DB posts (reuse existing isValidSlug)
