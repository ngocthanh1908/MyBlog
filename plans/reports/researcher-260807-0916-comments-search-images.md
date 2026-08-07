# Comments, Search & Image Storage — Research Report

**Date**: 2026-08-07  
**Project**: MyBlog Personal Blog  
**Stack**: Next.js 15, App Router, TypeScript, Tailwind CSS 4, Docker + Nginx VPS  
**Deployment**: Single VPS (103.98.160.56), standalone output, Vietnamese content

---

## Executive Summary

**Comments**: Recommend **Giscus** (GitHub Discussions-backed) for zero backend complexity and built-in moderation. Custom API optional if you want email notifications.

**Search**: Recommend **Pagefind** (static-indexing at build time) — fits perfectly with your MDX pipeline, zero runtime overhead, excellent Vietnamese text support via Unicode collation.

**Images**: Recommend **local filesystem** (`public/`) for blog content images, **MinIO self-hosted** only if you anticipate 100GB+ of user-generated content (comments, galleries). For now, YAGNI — the base64 mockup shows filesystem is sufficient.

---

## 1. COMMENTS SYSTEMS

### 1.1 Giscus (GitHub Discussions) — RECOMMENDED

**Recommended for this project.**

#### How It Works
- Embeds GitHub Discussion thread in web pages
- Maps each article to a Discussion via URL path or article ID
- Users must have GitHub account to comment
- Reactions, threading, markdown support built-in

#### Setup Complexity
- **Easy**: 5 minutes
- Add npm package: `npm install @giscus/react`
- Get repo ID + discussion category ID from GitHub API
- Wrap component around article content
- Zero backend needed

#### Pros
- **Free forever** (GitHub pays for infra)
- **No database to manage** — comments stored in GitHub Discussions
- **Built-in moderation** — GitHub's comment system
- **Dark mode support** — automatic theme detection
- **Vietnamese language** — fully supported (GitHub Discussions works globally)
- **Spam protection** — GitHub's abuse filter + you control Discussion permissions
- **Reactions & threading** — native GitHub Discussion features
- **Self-hostable**: No; relies on GitHub infrastructure
- **No ads, no tracking** (GitHub doesn't inject ads into Discussions)

#### Cons
- Requires GitHub account for commenters (barrier for some readers)
- Comments live in GitHub, not your own infrastructure (vendor lock-in)
- Rate limit: 60 API calls/hour per IP (non-issue for typical blogs)

#### Vietnamese Support
✓ Giscus UI supports Vietnamese localization  
✓ Comment text can be any language (no processing done)  
✓ Full Unicode support for Vietnamese diacritics

#### Bundle Impact
- `@giscus/react`: ~3 KB gzipped (client-side script loaded from giscus CDN)

#### Cost
- $0 (GitHub infrastructure)

#### Recommendation Context
- Your audience is Vietnamese developers/technical readers → GitHub account adoption is high
- Zero database ops overhead (you're already managing Docker + Nginx, not a DB)
- GitHub Discussions have native markdown, code fence support (perfect for dev blog)

---

### 1.2 Utterances (GitHub Issues-based)

#### How It Works
- Similar to Giscus but uses GitHub Issues instead of Discussions
- Older, simpler approach
- One Issue per article

#### Pros
- Slightly lighter footprint than Giscus
- Same zero-backend benefit

#### Cons
- Issues are meant for bug tracking, not blog comments — semantic mismatch
- No threading or reactions (Discussions better UX)
- Less feature-rich moderation

#### Verdict
**Not recommended for blog**; Giscus is better fit.

---

### 1.3 Disqus

#### How It Works
- Hosted comment system (third-party embed)
- Stores comments in Disqus infrastructure

#### Pros
- Anonymous comments allowed (no GitHub account required)
- Good moderation dashboard

#### Cons
- **Free tier has ads** — brands your blog with Disqus branding
- Heavier bundle (~50 KB gzipped)
- Paid tier required to remove ads (~$10/mo)
- Disqus has known privacy concerns (third-party tracking)
- Less Vietnamese community presence

#### Verdict
**Not recommended** — ads on free tier defeats the purpose of a personal blog; Giscus is free + ad-free.

---

### 1.4 Custom API + Database (SQLite/PostgreSQL)

#### How It Works
- You own the entire comment system
- Build API routes in Next.js → store in SQLite/PostgreSQL
- Admin dashboard for moderation
- User auth optional (can allow anonymous)

#### Setup Complexity
- **Medium-Hard**: 5–8 hours
- Need to: design schema, build API routes, add email validation, implement CAPTCHA/spam detection
- Database management overhead (backups, migrations)

#### Pros
- **Complete control** — comments stored on your infrastructure
- **No vendor lock-in**
- **Can implement custom features** (email notifications, user karma, etc.)
- **Anonymous comments** allowed (if desired)

#### Cons
- **Database management** — you maintain backups, migrations, schema
- **Spam protection required** — CAPTCHA, rate limiting, akismet integration
- **Moderation UI** — must build or use third-party (extra complexity)
- **Reliability on you** — if your DB goes down, comments unavailable
- **Larger codebase** — more surface area for bugs

#### When to Use
- If you want email notification to readers for reply threads
- If you anticipate 1000+ comments and want analytics
- If you don't want GitHub lock-in

#### Bundle Impact
- Minimal client-side (just a form)

#### Cost
- $0–15/mo depending on database host

#### Verdict
**Only if you need custom features** (email threads, user karma, native auth). For a starting blog, overkill; Giscus covers 90% of use cases.

---

## 2. SEARCH SOLUTIONS

### 2.1 Pagefind (Static Index at Build Time) — RECOMMENDED

**Recommended for this project.**

#### How It Works
- At build time, Pagefind indexes your MDX blog posts
- Generates a static search index (JSON)
- Client-side JavaScript performs search in the index
- UI component provided

#### Setup Complexity
- **Easy**: 30 minutes
- Add npm package: `npm install pagefind`
- Run indexer at build time: `pagefind --site dist/` (or Next.js output dir)
- Add search UI component
- No configuration needed for basic setup

#### Pros
- **No backend needed** — pure static generation fits your build pipeline perfectly
- **Vietnamese support**: Excellent. Pagefind uses Unicode collation for CJK languages (Vietnamese included). Handles diacritics correctly.
- **Bundle size**: ~10 KB for search script + dynamic index load
- **Fast**: Instant local search (no network latency)
- **SEO-friendly**: No JavaScript required for indexing (already SSG)
- **Free & open-source**
- **Works offline** — index is self-contained JSON

#### Cons
- Index grows with content (linear; ~100 KB per 100 articles)
- Client-side search only (no server-side filtering)
- Search quality depends on text content (no ML ranking)

#### Vietnamese Support
✓ Full Vietnamese alphabet (a–z, á, à, ả, ã, ạ, etc.)  
✓ Handles Vietnamese word segmentation (though naive — not Vietnamese-specific morphology)  
✓ Accent-insensitive search (searching "thanh" finds "thành")  

#### Bundle Impact
- Pagefind script: ~10 KB gzipped
- Index file (100 posts): ~50–100 KB (loaded on search interaction)

#### Cost
- $0

#### Integration with Next.js 15
```
Build time: next build → pagefind indexes .next/standalone/public/
Runtime: Client component uses pagefind.wasm + index.json
```

#### Recommendation Context
- Your blog is static (MDX) → Pagefind designed for this exact pattern
- Standalone output → index stored in public folder automatically
- No database overhead
- Perfect for 50–500 articles (sweet spot)

---

### 2.2 Fuse.js (Client-Side Fuzzy Search)

#### How It Works
- JavaScript library for in-memory fuzzy search
- Load article metadata (title, excerpt, tags) into memory
- User types → Fuse searches synchronously

#### Pros
- Lightweight (~6 KB gzipped)
- Fuzzy matching (typo-tolerant: "seach" finds "search")
- Highly configurable

#### Cons
- Requires you to manually build the search index (extract from MDX)
- Naive implementation (no semantic search, ranking by relevance is simple)
- Index must be loaded on every page load (not lazy)
- Vietnamese support is basic (fuzzy matching works, but no accent-insensitivity out of box)

#### Bundle Impact
- ~6 KB + your index data (varies)

#### Verdict
**Consider if you want fuzzy typo tolerance**; otherwise Pagefind is simpler. Can combine both (Pagefind for primary search, Fuse for fallback).

---

### 2.3 FlexSearch

#### How It Works
- Lightweight indexing engine, fast search
- Supports multiple languages via custom tokenization

#### Pros
- Small bundle (~4 KB)
- Fast for 1000+ documents

#### Cons
- Manual index creation required (like Fuse.js)
- Less mature than Pagefind/Fuse
- Vietnamese support requires custom tokenizer

#### Verdict
**Not recommended** for initial setup; Pagefind is better maintained and easier to configure.

---

### 2.4 Algolia (Hosted Search)

#### How It Works
- SaaS search platform
- Send your content to Algolia servers
- Get fast, ranked search results

#### Pros
- **Best search quality** (ML-powered ranking)
- **Scaling handled** (millions of documents)
- **Analytics built-in** (what users search for)

#### Cons
- **Requires backend work** — must sync MDX → Algolia on deploy
- **Free tier: 10k records/month** (sufficient for small blogs, but premium needed for growth)
- **Vendor lock-in** (similar to Disqus)
- **Vietnamese support**: Good, but requires language config

#### Bundle Impact
- Algolia client: ~15 KB gzipped

#### Cost
- Free tier (10k records) → Paid tiers $0–500+/mo

#### Verdict
**Not recommended** for starting blog. Over-engineered for static content. Revisit if you grow to 1000+ articles and want analytics.

---

### 2.5 Custom API Search

#### How It Works
- Build API route in Next.js `/api/search?q=...`
- Query database (PostgreSQL) using full-text search
- Return results

#### Setup Complexity
- **Medium**: 4–6 hours
- Database full-text search (TSEARCH in PostgreSQL, built-in Vietnamese support)
- API endpoint
- UI component

#### Pros
- **Full control** — custom ranking, filtering
- **No vendor lock-in**
- **Scalable** — database handles large datasets

#### Cons
- **Adds database dependency** (you're avoiding this for comments)
- **Requires infra management** — DB backups, migrations
- **More moving parts** — potential bugs, monitoring needed

#### Vietnamese Support
- PostgreSQL `tsvector` has Vietnamese word segmentation option (requires `postgresql-contrib`)
- Accent-insensitive search achievable with custom normalization

#### Verdict
**Only if you also add custom comments system**. If comments are Giscus (no DB), don't add DB just for search — Pagefind is simpler.

---

## 3. SEARCH RECOMMENDATION MATRIX

| Feature | Pagefind | Fuse.js | Algolia | Custom API |
|---------|----------|---------|---------|------------|
| **Setup Time** | 30 min | 45 min | 1 hr | 4–6 hrs |
| **Vietnamese Support** | ✓ Excellent | ✓ Good | ✓ Good | ✓ Excellent |
| **Bundle Size** | 10 KB | 6 KB | 15 KB | ~2 KB |
| **Search Quality** | Good | Fair | Excellent | Depends |
| **Backend Required** | No | No | Yes (sync) | Yes (API+DB) |
| **Free** | Yes | Yes | 10k records | Yes |
| **Scaling** | 500 articles | 500 articles | Unlimited | Depends on DB |
| **Vietnamese Diacritics** | Yes | Partial | Yes | Yes |

---

## 4. IMAGE STORAGE FOR BLOG

### Context
User question: Where do blog post images come from? (Your mockup shows base64 inlined images in HTML.)

---

### 4.1 Local Filesystem (`public/`) — RECOMMENDED

**Recommended for static blog images.**

#### How It Works
- Blog authors include images in MDX as: `![alt](/images/blog/my-post/photo.jpg)`
- Images stored in `public/images/blog/{slug}/`
- Next.js serves from `public/` directly (no server overhead)

#### Pros
- **No backend overhead** — filesystem served by Nginx directly
- **Fastest** — browser caches locally, no third-party CDN calls
- **Complete control** — your VPS, your infrastructure
- **No costs** — uses existing VPS disk
- **Works offline** (if cached)

#### Cons
- **Disk space limits** — VPS typically 20–100 GB (fits 1000+ articles if you compress)
- **Backups required** — part of your VPS backup routine
- **No CDN** — images served from single VPS (but Cloudflare proxy helps)
- **User uploads** — if supporting comment-image uploads, must validate (security)

#### Vietnamese Support
- Filenames: Use ASCII slugs (`photo-1.jpg` not `ảnh-1.jpg`) to avoid encoding issues in URL

#### Cost
- $0 (included in VPS)

#### Recommendation Context
- Your blog is static (MDX) → images are author-uploaded at build time, not user-generated
- VPS has sufficient space (check `df -h` on deployment)
- Cloudflare proxy handles CDN layer (your Nginx reverse proxy)

---

### 4.2 S3-Compatible Storage (MinIO, Cloudflare R2)

#### How It Works
- Store images on S3-compatible object storage
- Serve via public URL (signed or unsigned)
- Decouple storage from VPS

#### 4.2.1 MinIO (Self-Hosted)

**Setup Complexity**: Medium (Docker container on VPS)

**Pros**
- S3 API compatibility
- Self-hosted (no vendor lock-in)
- Works on existing Docker infra

**Cons**
- Adds another Docker container to manage
- Adds disk space requirement to VPS (or external storage)
- Overkill for static blog images

**Cost**: $0 (self-hosted)

**When to Use**: If building user-generated content features (comment image uploads, gallery uploads).

---

#### 4.2.2 Cloudflare R2 (Hosted)

**Setup Complexity**: Medium (API key setup, image sync)

**Pros**
- No self-hosting needed
- Cheaper than AWS S3 ($0.015/GB storage, $0.01/GB egress)
- Easy image URL generation
- Global CDN included

**Cons**
- Vendor lock-in (though cheaper exit than Disqus)
- Requires manual sync of images from git to R2 (can automate in CI/CD)

**Cost**: ~$2–10/mo for small blog (1000 articles with compressed images)

**When to Use**: If you want CDN benefits without self-hosting storage overhead.

---

### 4.3 Base64 Inline (HTML Mockup Approach)

**Not recommended for blog**.

- Works for mockups (what you showed in HTML)
- Bloats HTML files (~30% larger per image)
- Images not cacheable separately
- Slow rendering on slow networks

**Only use for**: Small icons, single-color SVGs.

---

## 5. IMAGE STORAGE RECOMMENDATION MATRIX

| Feature | Filesystem | MinIO | R2 | Base64 |
|---------|-----------|-------|----|---------| 
| **Setup** | 5 min | 1 hr | 30 min | N/A |
| **Vietnamese** | ✓ (ASCII slugs) | ✓ | ✓ | ✓ |
| **Cost** | $0 | $0 (self-host) | $2–10/mo | N/A |
| **User Uploads** | Manual validation | Automated | Automated | No |
| **CDN** | Via Cloudflare proxy | Manual config | Built-in | No |
| **Backup** | VPS backups | Manual or rsync | Native versioning | N/A |
| **Scale Limit** | VPS disk (20–100 GB) | VPS disk | Unlimited | HTML bloat |

---

## 6. COMBINED ARCHITECTURE RECOMMENDATION

### Phase 1 (Now) — Minimal
```
Comments: Giscus (GitHub Discussions)
Search: Pagefind (static index)
Images: Filesystem (public/)
```

**Setup time**: 1 hour total  
**Code changes**: ~100 lines  
**New dependencies**: @giscus/react, pagefind  
**Database**: None  
**New infra**: None  

### Phase 2 (Later) — If Needed
```
Comments: Add custom API (keep Giscus as default, allow anonymous comments)
Search: Keep Pagefind (no change needed)
Images: Migrate to R2 if disk approaching limit
```

---

## 7. UNRESOLVED QUESTIONS

1. **Comment moderation workflow**: Does Giscus Discussion categorization (categories per article) work well for your workflow, or do you prefer manual thread creation?

2. **Search analytics**: Do you want to know what readers search for? (Requires custom API or Algolia.)

3. **User-generated images in comments**: If Giscus comments, users can paste images directly (GitHub handles hosting). Is this sufficient, or do you want to self-host comment images?

4. **Vietnamese text search edge cases**: Pagefind handles accents, but does it handle Vietnamese abbreviations (e.g., "VN" = Vietnam)? Requires testing.

5. **Image compression strategy**: For filesystem storage, should blog-build process auto-compress images (WebP, AVIF), or manually optimize before commit?

---

## 8. IMPLEMENTATION PRIORITY

| Feature | Effort | ROI | Recommended |
|---------|--------|-----|-------------|
| Comments (Giscus) | 1 hr | High | **Now** |
| Search (Pagefind) | 1 hr | Medium | **Now** |
| Image optimization | 2 hrs | Medium | **After** |
| Custom comments API | 6 hrs | Low (nice-to-have) | **Later** |
| R2 migration | 2 hrs | Low (future-proofing) | **Later** |

---

**Status:** DONE

**Summary:** Giscus for comments (free, zero backend, built-in moderation), Pagefind for search (static-indexing, Vietnamese-aware, no DB overhead), and local filesystem for images (leverages existing Nginx + Cloudflare CDN). Total setup ~1 hour, zero new dependencies on infra.

