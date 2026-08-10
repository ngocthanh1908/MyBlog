# CMS Expansion v2 — Brainstorm Report

**Date:** 2026-08-07
**Context:** Solo-author Next.js blog with SQLite CMS (phases 1-8 complete)

## Problem Statement

Current CMS has raw textarea editor, no media management, flat JSON tags, and in-memory rate limiter. Need: rich editing experience, media library, tag management, auth hardening.

## Decisions

- **Writer count:** Solo (no multi-user needed)
- **Editor style:** Markdown + live preview (not WYSIWYG)
- **Build order:** Media Library → Editor → Tags → Auth (dependency-driven)

---

## Phase A: Media Library

**Approach:** API + grid UI in admin panel

### What to build
- `GET /api/uploads` — list files in `public/uploads/`, return name/size/date/url
- `DELETE /api/uploads/[filename]` — auth-guarded, delete file from disk
- Admin UI: grid of thumbnails with delete button, copy-markdown-syntax button
- Reuse existing `POST /api/upload` for new uploads

### Key considerations
- Sanitize filename in list endpoint (no path traversal on delete)
- Thumbnails: use `<img>` with object-fit cover, lazy load
- Filter by type (image only for now)
- No folders — flat list, YAGNI

### Estimated scope
~150 LOC across API + UI component

---

## Phase B: Markdown Editor with Live Preview

**Approach:** CodeMirror + react-markdown preview pane

### What to build
- Replace admin textarea with split-pane editor
- Left: CodeMirror with `@codemirror/lang-markdown` (syntax highlighting, keybindings)
- Right: `react-markdown` live preview (debounced 300ms)
- Toolbar: Bold, Italic, Heading, Link, Image (opens media library picker)
- Image insert from media library → inserts `![alt](url)` at cursor

### Dependencies
- `@codemirror/view`, `@codemirror/state`, `@codemirror/lang-markdown` (~80KB gzipped)
- `react-markdown` + `remark-gfm` for preview

### Key considerations
- Dark mode: CodeMirror theme synced with app theme
- Mobile: stack panes vertically on small screens
- Keyboard shortcuts: Ctrl+B bold, Ctrl+I italic, etc.
- Autosave draft to localStorage every 30s

### Estimated scope
~200 LOC editor component + ~50 LOC toolbar

---

## Phase C: Tag & Category Management

**Approach:** Keep JSON column, add management UI + autocomplete

### What to build
- Admin tag list view: all tags with post counts, rename, delete
- Tag rename: update all posts containing old tag name
- Tag autocomplete in post editor (query existing tags)
- No DB migration — JSON column sufficient for solo blog

### Key considerations
- Rename = batch UPDATE on posts table WHERE tags LIKE '%oldTag%'
- Delete tag = remove from all posts' tag arrays
- Autocomplete: query distinct tags from all posts on editor mount

### Estimated scope
~120 LOC across API + UI

---

## Phase D: Auth Hardening

**Approach:** SQLite rate limiter + refresh token rotation

### What to build
- Rate limit table in SQLite: `ip, endpoint, count, window_start`
- Cleanup old entries on each request (or periodic)
- Refresh token: issue short-lived access token (15min) + longer refresh token (7d)
- Token refresh endpoint: `POST /api/auth/refresh`
- Admin UI: auto-refresh token before expiry

### Key considerations
- SQLite rate limiter survives server restart (current in-memory resets)
- Refresh token stored in httpOnly cookie (not localStorage)
- Access token stays in memory (not persisted)
- Skip TOTP/2FA — YAGNI for solo user

### Estimated scope
~100 LOC across DB schema + API changes

---

## Risk Assessment

| Risk | Mitigation |
|------|------------|
| CodeMirror bundle size | Tree-shake, lazy load editor component |
| Media library disk usage | Add max storage check (configurable, default 500MB) |
| Tag rename data corruption | Transaction wrap, test with edge cases |
| Rate limiter table growth | Auto-cleanup entries older than 1 hour |

## Success Metrics
- Editor: can write, preview, and publish post without touching raw HTML
- Media: can upload, browse, insert, delete images from admin
- Tags: can see all tags, rename, delete, autocomplete in editor
- Auth: rate limiter persists across restarts, tokens auto-refresh

## Next Steps
Create implementation plan with 4 phases, each independently deployable.
