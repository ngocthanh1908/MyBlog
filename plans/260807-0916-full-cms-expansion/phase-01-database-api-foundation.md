# Phase 1: Database + API Foundation

## Context Links
- [CMS Architecture Research](../reports/researcher-260807-0916-cms-architecture.md)
- [Current MDX utils](../../src/lib/mdx-utils.ts)
- [Site config](../../src/lib/site-config.ts)

## Overview
- **Priority**: P1 — everything depends on this
- **Status**: Pending
- **Effort**: 5h
- **Description**: SQLite database, CRUD API routes, JWT auth, image upload endpoint

## Key Insights
- better-sqlite3 is synchronous — no async/await needed for DB calls
- Single-user blog — no concurrent write concerns
- SQLite file stored outside .next to survive rebuilds
- Standalone output requires `outputFileTracingIncludes` for native modules

## File Ownership (this phase only)
```
NEW:
  src/lib/db.ts                      — SQLite wrapper + schema init
  src/lib/auth-utils.ts              — JWT sign/verify + auth middleware
  src/app/api/auth/route.ts          — POST login endpoint
  src/app/api/posts/route.ts         — GET all + POST create
  src/app/api/posts/[id]/route.ts    — GET one + PUT update + DELETE
  src/app/api/upload/route.ts        — POST image upload
  data/.gitkeep                      — SQLite directory placeholder
  public/uploads/.gitkeep            — Upload directory placeholder

MODIFY:
  package.json                       — add better-sqlite3, jsonwebtoken, @types/*
  next.config.ts                     — add outputFileTracingIncludes for better-sqlite3
  .gitignore                         — add data/*.sqlite, public/uploads/*
  .env.example                       — document required env vars
```

## Architecture

### Database Schema
```sql
CREATE TABLE IF NOT EXISTS posts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL DEFAULT '',
  tags TEXT NOT NULL DEFAULT '[]',        -- JSON array string
  content TEXT NOT NULL DEFAULT '',       -- markdown content
  cover_image TEXT DEFAULT NULL,
  draft INTEGER NOT NULL DEFAULT 0,      -- 0=published, 1=draft
  read_time INTEGER NOT NULL DEFAULT 1,  -- minutes
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_draft ON posts(draft);
```

### API Routes

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | /api/auth | No | Login with ADMIN_PASSWORD, returns JWT |
| GET | /api/posts | No | List all published posts (drafts if ?drafts=true + auth) |
| POST | /api/posts | Yes | Create post |
| GET | /api/posts/[id] | No | Get single post by ID |
| PUT | /api/posts/[id] | Yes | Update post |
| DELETE | /api/posts/[id] | Yes | Delete post |
| POST | /api/upload | Yes | Upload image file |

### Auth Flow
```
Client sends: POST /api/auth { password: "xxx" }
Server checks: password === process.env.ADMIN_PASSWORD
Server returns: { token: jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '7d' }) }
Client stores: localStorage.setItem('admin_token', token)
Subsequent requests: Authorization: Bearer <token>
```

### Image Upload Flow
```
Client sends: POST /api/upload (multipart/form-data, field: "file")
Server validates: mimetype in [image/jpeg, image/png, image/webp, image/gif], size < 5MB
Server saves: public/uploads/{timestamp}-{sanitized-filename}
Server returns: { url: "/uploads/{timestamp}-{sanitized-filename}" }
```

## Implementation Steps

### 1. Install dependencies
```bash
npm install better-sqlite3 jsonwebtoken
npm install -D @types/better-sqlite3 @types/jsonwebtoken
```

### 2. Create src/lib/db.ts (~80 lines)
- Lazy-init singleton pattern for Database instance
- DB path: `path.join(process.cwd(), 'data', 'blog.sqlite')`
- Auto-create `data/` directory if missing
- Run schema CREATE TABLE on first connection
- Export helper functions: `getAllDbPosts()`, `getDbPostById(id)`, `getDbPostBySlug(slug)`, `createDbPost(data)`, `updateDbPost(id, data)`, `deleteDbPost(id)`
- Tags stored as JSON string, parse on read

### 3. Create src/lib/auth-utils.ts (~50 lines)
- `signToken()`: creates JWT with { admin: true }, 7-day expiry
- `verifyToken(token)`: verifies + decodes JWT
- `requireAuth(request)`: extracts Bearer token from Authorization header, verifies, throws 401 if invalid
- Use env vars: `JWT_SECRET`, `ADMIN_PASSWORD`

### 4. Create API route: src/app/api/auth/route.ts (~30 lines)
- POST handler: parse JSON body, check password, return token or 401
- Rate limit: track attempts per IP (simple in-memory Map, reset after 1 min)

### 5. Create API route: src/app/api/posts/route.ts (~60 lines)
- GET: return all published posts from SQLite (add ?drafts=true for drafts, requires auth)
- POST: require auth, validate body (title, slug, excerpt, tags, content), insert into DB
- Auto-generate slug from title if not provided (slugify: lowercase, replace spaces with hyphens, remove special chars)
- Return 400 for validation errors, 409 for duplicate slug

### 6. Create API route: src/app/api/posts/[id]/route.ts (~60 lines)
- GET: return single post by ID
- PUT: require auth, validate body, update post, set updated_at
- DELETE: require auth, delete post by ID
- Return 404 if not found

### 7. Create API route: src/app/api/upload/route.ts (~50 lines)
- POST: require auth, parse FormData
- Validate file: check mimetype allowlist, check size < 5MB
- Generate filename: `{Date.now()}-{sanitized-original-name}`
- Save to `public/uploads/` directory (create if missing)
- Return JSON: `{ url: "/uploads/filename" }`

### 8. Update next.config.ts
- Add `serverExternalPackages: ['better-sqlite3']` (Next.js 15 config key)
- Add data/ to outputFileTracingIncludes if needed

### 9. Update .gitignore
```
data/*.sqlite
public/uploads/*
!public/uploads/.gitkeep
.env.local
```

### 10. Create .env.example
```
ADMIN_PASSWORD=your-admin-password-here
JWT_SECRET=your-random-secret-here-min-32-chars
NEXT_PUBLIC_SITE_URL=https://blog.phamngocthanh.io.vn
```

## Todo List
- [ ] Install better-sqlite3 + jsonwebtoken
- [ ] Create src/lib/db.ts with schema init + CRUD helpers
- [ ] Create src/lib/auth-utils.ts with JWT helpers
- [ ] Create POST /api/auth route
- [ ] Create GET/POST /api/posts route
- [ ] Create GET/PUT/DELETE /api/posts/[id] route
- [ ] Create POST /api/upload route
- [ ] Update next.config.ts for better-sqlite3
- [ ] Update .gitignore + create .env.example
- [ ] Create data/.gitkeep + public/uploads/.gitkeep
- [ ] Test all endpoints with curl

## Success Criteria
- `curl GET /api/posts` returns empty array
- `curl POST /api/auth` with correct password returns JWT
- `curl POST /api/posts` with JWT creates a post
- `curl GET /api/posts` now returns the created post
- `curl POST /api/upload` with JWT + file saves image and returns URL
- `curl PUT /api/posts/1` updates the post
- `curl DELETE /api/posts/1` removes the post
- All 401 on protected routes without JWT

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| better-sqlite3 native build fails in Docker | Medium | High | Use `node:20-alpine` + apk add build deps in Dockerfile build stage |
| SQLite file permissions in Docker | Low | Medium | Ensure `nextjs` user owns data/ directory |
| JWT_SECRET not set in prod | Low | High | Fail-fast: throw on startup if env vars missing |

## Security Considerations
- Parameterized SQL queries only (no string interpolation)
- File upload: allowlist mimetypes, reject executables
- JWT expiry: 7 days, no refresh token (single user, re-login is fine)
- Rate limit auth endpoint: 5 attempts per minute per IP
- Sanitize uploaded filenames: strip path components, allow only alphanumeric + dash + dot
