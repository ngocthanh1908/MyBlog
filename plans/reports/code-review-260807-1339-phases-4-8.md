# Code Review: CMS Phases 4-8

**Date:** 2026-08-07 | **Reviewer:** code-reviewer | **Scope:** 25+ files across search, comments, admin bar, API routes, Docker, nginx, CI

---

## Critical

- **[CRITICAL] XSS via dangerouslySetInnerHTML in search-box.tsx:101** — Pagefind `r.excerpt` is injected as raw HTML. Pagefind wraps matched terms in `<mark>` tags, but if blog content contains malicious HTML, it will execute. Pagefind does some sanitization but this is a trust-boundary assumption worth validating. Mitigation: sanitize the excerpt or use a DOMPurify pass before rendering.

- **[CRITICAL] Auth route timing attack on password comparison (api/auth/route.ts:32)** — `body.password !== adminPassword` uses JS string comparison which short-circuits on first differing char, enabling timing-based password extraction. Fix: use `crypto.timingSafeEqual(Buffer.from(body.password), Buffer.from(adminPassword))` with length check.

- **[CRITICAL] GET /api/posts/[id] has no auth check (posts/[id]/route.ts:7-13)** — Any unauthenticated user can fetch any post by ID, including drafts, by iterating IDs. PUT/DELETE are protected but GET is not. Fix: check `draft` flag on returned post and require auth if draft.

- **[CRITICAL] Rate limit memory leak in auth route** — `attempts` Map grows unbounded in auth/route.ts. Every unique IP adds an entry that is only deleted on successful login. Under sustained attack from rotating IPs, this is an OOM vector. Fix: add periodic cleanup via `setTimeout` or use a simple LRU with max size.

## High

- **[HIGH] Admin auth is client-side only (admin-bar.tsx, tag-filter.tsx, blog-card.tsx)** — `isAdmin` state is derived solely from `localStorage.getItem("admin_token")`. Any user can set `localStorage.admin_token = "anything"` and see admin UI (edit links, admin bar). The edit links point to `/admin?edit=ID` which presumably has its own auth, but the admin bar's "Quan ly" link and the edit buttons in blog-card expose admin-only UI surface. Not a data breach but leaks admin functionality existence. Consider: acceptable if admin page itself is protected, but the edit link for DB posts reveals post IDs.

- **[HIGH] Giscus repo hardcoded in comments-section.tsx:13** — `repo="ngocthanh1908/MyBlog"` is hardcoded while `repoId` and `categoryId` come from env vars. If the repo is renamed or transferred, the component breaks silently. Should use an env var for consistency, or at minimum document the coupling.

- **[HIGH] Pagefind postbuild path mismatch (package.json:8 vs Dockerfile:20)** — `postbuild` writes to `public/pagefind` but Dockerfile runs pagefind with `--output-path .next/standalone/public/pagefind`. The standalone build copies `public/` to a different location. The `|| true` in the Dockerfile swallows failure silently — if pagefind fails, search is broken in prod with no error signal.

- **[HIGH] No input validation on POST /api/posts body fields** — `body.title` is checked for existence but not sanitized or length-limited. `body.content`, `body.excerpt`, `body.tags` array items, and `body.cover_image` are passed through without validation. A malicious admin could store arbitrarily large content or inject script tags into title/excerpt that renders unsanitized elsewhere. Use the existing `zod` dependency for request body validation.

- **[HIGH] Upload file type validation relies solely on MIME type (upload/route.ts:35)** — `file.type` is client-provided and trivially spoofable. An attacker with admin token can upload `.html` or `.svg` files (which execute JS) by setting MIME to `image/jpeg`. Fix: also validate by file extension and/or magic bytes.

## Medium

- **[MED] SQLite singleton not safe under Next.js hot reload** — `db.ts` uses module-level `let db` which resets on HMR. The `better-sqlite3` connection from the previous module instance stays open, leaking file handles. Standard fix: attach to `globalThis` in dev mode.

- **[MED] `requireAuth` throws Response object (auth-utils.ts:34)** — Throwing a `Response` as an exception is unconventional and fragile. Every caller must catch and re-throw non-Response errors (the `if (res instanceof Response) return res; throw res;` pattern repeated 4 times). If any caller forgets, unhandled Response object crash. Consider returning a result type instead.

- **[MED] nginx uploads location path mismatch risk** — nginx serves `/uploads/` from `/usr/share/nginx/uploads/` but the app writes to `/app/public/uploads/`. These are connected via the `blog-uploads` Docker volume, but the volume mount in docker-compose mounts to `/usr/share/nginx/uploads:ro` for nginx and `/app/public/uploads` for app. If standalone build path differs, uploads won't be found. Verify the volume mount targets match at runtime.

- **[MED] `yearlyRunGoal.targetKm` division in habits page (line 74)** — `Math.round((yearlyRunGoal.currentKm / yearlyRunGoal.targetKm) * 100)` has no guard against `targetKm === 0`. If someone edits habits-data.ts and sets targetKm to 0, the page renders `NaN%` or `Infinity%`.

- **[MED] CSP missing `connect-src` for pagefind** — CSP in next.config.ts sets `connect-src 'self'` which should cover pagefind since it's self-hosted, but if pagefind tries to fetch from a CDN path this will fail silently. Verify pagefind WASM fetch works under this CSP.

## Low

- **[LOW] Search timer not cleaned up on unmount (search-box.tsx:66)** — `timerRef.current` setTimeout is not cleared in a cleanup effect. If the component unmounts mid-debounce, `doSearch` fires on an unmounted component. React 18+ handles setState on unmounted gracefully but it's a wasted network call.

- **[LOW] `getAllTags()` calls `getAllPosts()` which does a full DB scan** — Used on every `/blog` page load. With few posts this is fine, but scales O(n) on total posts. Acceptable for now; add caching or a tags query if post count exceeds ~100.

- **[LOW] Test for search-box mocks pagefind at wrong path** — `vi.mock("/pagefind/pagefind.js")` may not match the dynamic import path resolution. The test only verifies render, not search behavior. Adequate for smoke test, but the mock may silently stop matching.

---

## Positive Observations

- Path traversal protection in both `mdx-utils.ts` (slug validation + resolved path check) and `upload/route.ts` (resolved path check) is solid
- Proper use of parameterized SQL queries throughout `db.ts` — no SQL injection risk
- CSP headers are comprehensive and correctly include giscus frame-src
- Rate limiting on auth endpoint (despite the memory leak issue) is a good baseline defense
- Clean separation of MDX and DB post sources with priority ordering

## Recommended Actions (Priority Order)

1. Fix timing attack on password comparison — 1-line fix with `crypto.timingSafeEqual`
2. Add auth check to GET /api/posts/[id] for draft posts
3. Add cleanup/max-size to rate limit Map
4. Validate upload file extension, not just MIME type
5. Add zod validation to POST/PUT request bodies in API routes
6. Sanitize pagefind excerpt before dangerouslySetInnerHTML or use DOMPurify

## Unresolved Questions

- Is pagefind WASM fetch working under the current CSP in production? Needs runtime verification.
- Is the `|| true` on pagefind in Dockerfile intentional? If pagefind index fails, search is silently broken.
- Does the standalone output correctly include the `data/` directory for SQLite at runtime?
