# CMS Architecture Research: Next.js 15 Static Blog
**Date**: 2026-08-07  
**Project**: MyBlog (Personal blog on VPS with Docker)  
**Focus**: Single-user CMS, self-hosted, admin UI + image upload + data export

---

## Executive Summary

For a single-user personal blog on a VPS running Docker, **Hybrid Approach (Keep MDX + Add API for new posts)** is the clear winner. It reuses your existing MDX infrastructure, requires minimal dependencies, and adds a lightweight API layer for admin content management.

**Why hybrid over alternatives:**
- Doesn't force a full database migration for existing 2 posts
- Simplest Docker deployment (one container, no extra services)
- No vendor lock-in (Strapi, Payload, Sanity are heavier)
- Lowest abandonment risk (pure Next.js, standard APIs)
- Fastest time-to-ship (API routes + SQLite for new posts, keep MDX for archive)

---

## Approach 1: Next.js API Routes + SQLite/JSON Storage

### Overview
API routes handle CRUD operations. Posts stored in SQLite (single file) or JSON. Existing MDX posts untouched; new posts go to database.

### Complexity Assessment
**Implementation**: Low-Medium
- API routes: 5-8 routes (GET /posts, POST, PUT, DELETE, etc.)
- SQLite setup: `better-sqlite3` or `sql.js` (2-3 files)
- Admin UI: React component form (existing in mockup)
- Image upload: File storage on VPS filesystem or cloud (local simpler)

### Self-Hosting Feasibility
**✓ Excellent**
- No external service required
- Single `node:20-alpine` container
- SQLite file lives in Docker volume
- Minimal memory footprint (~50MB at scale)

### Authentication Options
- Simple approach: hardcoded password + session cookie (not secure, fine for personal blog)
- Better: JWT + environment variable secret (simple, stateless)
- Best: next-auth with credentials provider (overkill for solo user)

**Recommendation**: JWT token stored in localStorage, validated in API middleware.

### Image Upload/Storage
**Option A: Filesystem storage** (simplest)
- POST `/api/upload` → save to `public/uploads/`
- Return URL like `/uploads/img-2026-08-07-abc123.jpg`
- Volume mount in Docker: `volumes: [./public:/app/public]`
- Works with Nginx serving static files

**Option B: Cloud (AWS S3, Cloudinary)**
- Heavier but more scalable
- Not worth it for personal blog

**Recommendation**: Filesystem storage with volume mount. Keep it simple.

### Docker Deployment Compatibility
**✓ Native compatibility**
```dockerfile
# No changes to current Dockerfile needed
COPY --from=builder /app/public ./public  # includes uploads/
# Persistent volume mount in compose:
volumes:
  - ./public/uploads:/app/public/uploads
```

### Performance Impact
- No impact on static generation (MDX still SSG)
- API responses: ~10-50ms for SQLite reads
- Build time: unchanged (no build-time DB dependencies)

### Trade-offs Summary
| Pro | Con |
|-----|-----|
| Single-file database | SQL language learning curve |
| No external deps | Concurrent writes may lock (edge case) |
| Trivial Docker setup | Backup/migration is manual |
| Works offline | Schema changes require code |

### When to Use
- ✓ Solo user, low traffic
- ✓ Simple data (posts, metadata)
- ✓ Run-it-yourself deployments
- ✗ High concurrency (>5 simultaneous writers)
- ✗ Complex queries/analytics

---

## Approach 2: Next.js API Routes + PostgreSQL

### Overview
Replaces SQLite with a managed PostgreSQL database. API routes same as Approach 1, but queries hit Postgres.

### Complexity Assessment
**Implementation**: Medium-High
- Add `pg` or `prisma` client (~500 LOC for schema + migrations)
- Two containers: Next.js + PostgreSQL
- Environment secrets for DB credentials
- Database backups/restore procedures

### Self-Hosting Feasibility
**✓ Good, but more overhead**
- Requires docker-compose with two services
- PostgreSQL uses ~200-300MB RAM at rest
- VPS needs 1GB+ RAM to avoid swap
- Backup complexity increases (pg_dump, restore)

### Authentication Options
Same as Approach 1 (JWT recommended).

### Image Upload/Storage
Same as Approach 1 (filesystem or cloud). Database unchanged.

### Docker Deployment Compatibility
**✓ Works, but more complex**
```yaml
services:
  app:
    # ... Next.js service
    depends_on:
      - db
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/postgresql/data
volumes:
  db_data:
```

### Performance Impact
- API latency: ~5-20ms (connection pooling required)
- Static generation: unchanged
- Build time: unchanged
- Storage: SQLite (~10MB for 100 posts) vs Postgres (~500MB minimum)

### Trade-offs Summary
| Pro | Con |
|-----|-----|
| Scales to 1000s posts | Extra container + resource overhead |
| Proper ACID guarantees | Backup/restore complexity |
| Can run complex queries | Password management in env secrets |
| Supports concurrent writes | Overkill for personal blog |

### When to Use
- ✓ Expecting growth to 100+ posts
- ✓ Want proper backups from day one
- ✓ Comfortable with Docker Compose multi-service
- ✗ Single VPS with <1GB RAM
- ✗ Want simplicity over scalability

---

## Approach 3: Headless CMS (Strapi, Payload CMS, Sanity)

### Comparison Table

| Feature | Strapi | Payload CMS | Sanity |
|---------|--------|------------|--------|
| **Setup time** | 30-60 min | 20-40 min | 10 min (cloud) |
| **Self-hosted** | ✓ (heavy) | ✓ (medium) | ✗ (cloud only) |
| **Admin UI** | Built-in, auto-generated | Built-in, customizable | Built-in, polished |
| **Learning curve** | Medium | Medium-Low | Low (cloud) |
| **Docker** | Multi-service (app+DB) | Single container possible | Cloud API only |
| **Image storage** | Local or cloud | Local or cloud | Cloud (built-in) |
| **Cost** | Free (self-hosted) | Free (self-hosted) | $99+/mo (cloud) |
| **Abandonment risk** | Low (Strapi Inc backed) | Low (open-source) | Medium (vendor) |

### Strapi
**Complexity**: High
- Container runs `strapi` server + admin panel
- Requires separate DB (PostgreSQL recommended)
- Setup: `npx create-strapi-app` → config → build Docker image
- ~1.5GB RAM consumption for full stack

**Pros**:
- Beautiful, auto-generated admin panel
- Plugin ecosystem (media library, permissions, workflows)
- Can serve API separately from Next.js frontend

**Cons**:
- Heavy for a personal blog
- Requires PostgreSQL (adds complexity)
- Learning curve for data modeling
- Your Next.js app still needs to query Strapi API separately

### Payload CMS
**Complexity**: Medium
- Lighter than Strapi
- Next.js-native (can run in same process or separate)
- Admin panel at `/admin`
- PostgreSQL optional (SQLite supported)

**Pros**:
- Built on TypeScript, same as your stack
- Admin panel auto-built from schema
- Can run in single container if using SQLite
- Good docs

**Cons**:
- Smaller ecosystem than Strapi
- Still adds ~400MB+ to container
- Not as polished as Strapi admin UI
- Overkill if you only need 1-2 content types

### Sanity
**Complexity**: Low (but vendor-dependent)
- Cloud-only: no self-hosting
- Minimal setup: create dataset → define schema
- Free tier: 3 projects, 125k assets, API reads/writes
- Admin panel in browser

**Pros**:
- Zero ops, zero hosting concerns
- Beautiful, fast admin interface
- Real-time collaboration (not needed, but nice)
- Generous free tier

**Cons**:
- Vendor lock-in (data in Sanity cloud)
- No offline access
- Free tier limits: 3 projects max
- Paid plans $99+/mo (for production)
- Doesn't fit "self-hosted on VPS" requirement

### Trade-offs Summary
| Criteria | Strapi | Payload | Sanity |
|----------|--------|---------|--------|
| Simplicity | ✗✗ | ✗ | ✓ |
| Self-hosted | ✓ (heavy) | ✓ (light) | ✗ |
| Admin UI | ✓✓ | ✓ | ✓✓ |
| Learning time | 3-5 hrs | 2-3 hrs | 30 min |
| VPS-friendly | ✗ (2GB+ RAM) | ✓ (1GB+) | ✗ (cloud) |
| Cost | Free | Free | $99+/mo |

### When to Use
- ✓ Want production-grade admin UI immediately
- ✓ Plan 50+ content types / complex data
- ✓ Multi-user team editing
- ✗ Personal solo blog
- ✗ Want minimal Docker overhead
- ✗ Sanity unless you accept cloud hosting + costs

---

## Approach 4: Hybrid (Recommended)

### Architecture
Keep existing MDX posts + add API layer for new posts.

**Two-tier storage**:
1. **Legacy tier**: Existing 2 MDX files in `src/content/blog/` — read-only in app
2. **New tier**: New posts stored in SQLite via API — writable via admin UI

### Implementation
```
src/
├── app/api/
│   ├── posts/         # API routes
│   │   ├── route.ts   # GET (all), POST (create)
│   │   └── [id]/route.ts  # GET, PUT, DELETE
│   └── upload/route.ts  # Image upload
├── lib/
│   ├── mdx-utils.ts   # Existing MDX loader (unchanged)
│   └── db.ts          # SQLite wrapper (new)
├── content/
│   └── blog/          # Existing MDX files (unchanged)
└── data/
    └── blog-db.sqlite # New posts DB
```

**Admin UI**: React form component (you already have mockup)
- Form: title, excerpt, tags, content (plain text or MDX)
- Image upload: drag-drop to upload
- List: view/edit/delete all posts
- Export: JSON dump of all posts (legacy + new)

### Complexity Assessment
**Implementation**: Low
- SQLite setup: 150 LOC (`better-sqlite3` wrapper)
- API routes: 300 LOC (CRUD + auth middleware)
- Admin UI: 200 LOC (form, list, delete)
- Total: ~700 LOC (fits in 2-3 files)

### Self-Hosting Feasibility
**✓ Excellent**
- Single Next.js container (unchanged Dockerfile)
- SQLite file as volume mount (optional, can persist in `.next`)
- No extra services
- VPS with 512MB RAM is enough

### Authentication
JWT token in localStorage:
```typescript
// POST /api/auth (should be protected by password in env)
const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '7d' })
return { token }

// Middleware validates token on all POST/PUT/DELETE requests
```

### Image Upload
Filesystem storage to `public/uploads/`:
```typescript
// POST /api/upload
POST /uploads/{timestamp}-{filename}
volume mount: ./public/uploads -> /app/public/uploads
```

### Docker Deployment
**No Dockerfile changes**. Just mount volumes:
```yaml
services:
  app:
    build: .
    ports: ["3000:3000"]
    volumes:
      - ./public/uploads:/app/public/uploads
      - ./.next/data:/app/.next/data  # persist DB
```

### Performance Impact
- Build time: +5 sec (gathers SQLite posts for export/sitemap)
- API latency: ~10-20ms (SQLite reads are fast)
- Static generation: MDX posts unchanged, new posts can be SSG or dynamic
- Memory: +20MB for sqlite3 driver

### Migration Path
1. **Phase 1**: Deploy with API routes + SQLite, keep MDX read-only
2. **Phase 2** (later): If you want to consolidate, migrate old MDX → SQLite + rebuild with `next export`
3. **Phase 3** (optional): Switch to Postgres if you exceed 1000 posts

### Trade-offs Summary
| Pro | Con |
|-----|-----|
| **Reuses existing MDX** | Need to maintain two post sources initially |
| **Minimal new dependencies** | Migration effort later (if consolidate) |
| **Single container** | Backup includes both sources |
| **Fast API response** | SQLite locks on concurrent writes (rare for solo user) |
| **Simple auth (JWT)** | No built-in multi-user support (not needed) |
| **Easy to extend** | Manual schema management |

### Production Checklist
- [ ] SQLite file backed up daily (volume snapshot)
- [ ] API authenticated via JWT (no anonymous writes)
- [ ] Image upload validates file type/size (mime + max 5MB)
- [ ] Rate limiting on upload endpoint (prevent DoS)
- [ ] Admin UI only accessible if token valid
- [ ] Export endpoint includes both MDX + SQLite posts
- [ ] Nginx serves `public/uploads/*` (cache headers)

---

## Decision Matrix

| Criteria | SQLite+API | Postgres+API | Strapi | Payload | Sanity | Hybrid ⭐ |
|----------|-----------|-------------|--------|---------|--------|---------|
| Setup time | 2 hrs | 4 hrs | 5 hrs | 3 hrs | 30 min | 3 hrs |
| Implementation LOC | 400 | 600 | 0* | 0* | 0* | 700 |
| Ongoing ops | ✓ Low | Medium | Medium-High | Medium | ✗ Vendor | ✓ Low |
| VPS-friendly | ✓✓ | ✓ | ✗ | ✓ | ✗ | ✓✓ |
| Docker simplicity | ✓✓ | ✗ | ✗ | ✓ | N/A | ✓✓ |
| Admin UI quality | ✗ (build own) | ✗ (build own) | ✓✓ | ✓ | ✓✓ | ✓ (lightweight) |
| Learning curve | Medium | High | High | Medium | Low | Low |
| Reuse MDX | ✗ (migrate) | ✗ (migrate) | ✗ (migrate) | ✗ (migrate) | ✗ (migrate) | ✓✓ (keep) |
| Future scale | Max 1K posts | 10K+ posts | 10K+ posts | 5K+ posts | Unlimited | 2K posts |
| Solo VPS cost | Free | Free | Free | Free | $99+/mo | Free |

\* Strapi/Payload/Sanity provide admin UI, but require scaffolding and integration overhead not captured in LOC.

---

## Recommendation: Hybrid Approach

### Why Hybrid Wins for YOUR Project

1. **Respects your current investment**: 2 existing MDX posts stay put; no disruption
2. **Fits VPS constraints**: Single container, minimal resources, Docker-native
3. **Fastest iteration**: Admin UI + API in 1 week, not 2-3 weeks
4. **Zero vendor lock-in**: Pure Next.js, can migrate later
5. **Simplest operations**: One compose file, one container, backups are filesystem snapshots
6. **Matches scale**: Personal blog doesn't need enterprise CMS features

### Implementation Roadmap

**Phase 1** (Week 1): API + Auth + Upload
- [ ] SQLite schema + migrations (1 day)
- [ ] API routes: GET /posts, POST /posts, DELETE (2 days)
- [ ] JWT auth middleware (0.5 day)
- [ ] Image upload to `public/uploads/` (0.5 day)
- [ ] Test with Postman/curl (1 day)

**Phase 2** (Week 2): Admin UI + Polish
- [ ] React admin page: form + list + delete (2 days)
- [ ] Edit endpoint (PUT /posts/:id) (0.5 day)
- [ ] Export endpoint (JSON dump) (0.5 day)
- [ ] Rate limiting + error handling (1 day)
- [ ] Docker volume mount + deployment (0.5 day)

**Phase 3** (Future): Consolidate (Optional)
- Migrate old MDX → SQLite if you hit 50+ posts
- Use single query (SELECT * FROM posts UNION SELECT * FROM mdx_files)
- Rebuild once

### Implementation Files to Create/Modify
```
NEW:
- src/app/api/posts/route.ts        (100 LOC)
- src/app/api/posts/[id]/route.ts   (100 LOC)
- src/app/api/upload/route.ts       (80 LOC)
- src/app/api/auth/route.ts         (40 LOC)
- src/lib/db.ts                     (150 LOC)
- src/lib/auth.ts                   (50 LOC)
- src/app/admin/page.tsx            (250 LOC)
- public/.gitkeep                   (for uploads/)

MODIFY:
- package.json                      (add better-sqlite3, jsonwebtoken)
- docker-compose.prod.yml           (add volumes for uploads + db)
- src/lib/mdx-utils.ts              (keep, maybe add SQLite fallback)

NO CHANGE:
- Dockerfile                        (works as-is)
- GitHub Actions workflow           (works as-is)
```

### Security Notes
- [ ] JWT secret in `.env.local` (git-ignored)
- [ ] Admin password or token stored in VPS env var (not git)
- [ ] API routes validate input (title length, tag count, etc.)
- [ ] Rate limit POST/PUT/DELETE (e.g., 10 req/min per IP)
- [ ] Nginx config: no auth needed (JWT in header)

### Deployment Steps
1. Create `.env.local` with `JWT_SECRET` (random string)
2. Build: `docker compose -f docker-compose.prod.yml build`
3. Run: `docker compose -f docker-compose.prod.yml up -d`
4. Admin UI at: `https://blog.phamngocthanh.io.vn/admin` (add auth gate)
5. Create first post via admin UI
6. Verify post appears on blog (SEO sitemap updated)

---

## Unresolved Questions

1. **Image storage after upload**: Keep on VPS filesystem, or push to CDN later? (Recommend: start local, add cloud if images exceed 1GB)
2. **MDX vs plain text for new posts**: Store content as markdown or compiled MDX? (Recommend: markdown, compile at render time)
3. **SEO sitemap generation**: How to include SQLite posts in `sitemap.xml`? (Recommend: build-time query of SQLite, generate static sitemap)
4. **Backup strategy for SQLite**: Daily snapshots via cron on VPS? (Recommend: volume snapshot + monthly export to GitHub release)
5. **Admin UI access control**: One password for all admins or unique tokens? (Recommend: single JWT secret, rotate every 6 months)

---

## References

- Next.js 15 API Routes: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- better-sqlite3: Synchronous SQLite wrapper, fast, minimal dependencies
- next-mdx-remote: Your current tool, works great with hybrid (MDX posts)
- JWT (jsonwebtoken package): Simple token-based auth, industry standard
- Strapi CMS: https://strapi.io (if you change mind later)
- Payload CMS: https://payloadcms.com (lighter Strapi alternative)

---

**Status**: DONE  
**Summary**: Hybrid approach (keep MDX + add SQLite API layer) is optimal for your single-user VPS blog. Requires ~700 LOC, single container, zero ops overhead, and reuses existing MDX infrastructure. Strapi/Postgres/Sanity are overkill; pure SQLite+API is the lazy-efficient solution.
