# Code Review: Next.js 15 Personal Brand Website

**Date:** 2026-04-02
**Reviewer:** code-reviewer
**Scope:** 27 files (~850 LOC) -- layout, pages, components, lib, config, styles

---

## Overall Assessment

Solid foundation. Clean component architecture, good SSR/client split, proper path traversal protection, MDX allowlist, and security headers. A few issues need attention before production -- primarily around CSP policy, `<a>` tag in MDX allowlist, `LazyMotion` repeated instantiation, and missing `img` handling in MDX.

---

## Critical Issues

### C1. MDX allowlist includes raw `<a>` tag -- XSS vector
**File:** `src/app/blog/[slug]/page.tsx:16`

The MDX component allowlist passes `<a {...props} />` without sanitizing `href`. MDX content authored by you is low-risk, but if any MDX is contributed externally or if frontmatter values are interpolated into content, an attacker could inject `javascript:` protocol links.

```tsx
// Current
a: (props: React.ComponentProps<"a">) => <a {...props} />,

// Fix: sanitize href
a: (props: React.ComponentProps<"a">) => {
  const href = typeof props.href === "string" && props.href.startsWith("javascript:")
    ? "#"
    : props.href;
  return <a {...props} href={href} target="_blank" rel="noopener noreferrer" />;
},
```

**Impact:** XSS if MDX source is ever untrusted. Low risk now since content is local files, but defense-in-depth matters.

### C2. CSP allows `'unsafe-eval'` -- defeats much of the CSP benefit
**File:** `next.config.ts:26`

`script-src 'self' 'unsafe-inline' 'unsafe-eval'` effectively disables CSP protection against script injection. Next.js needs `'unsafe-inline'` for hydration, but `'unsafe-eval'` is unnecessary for production builds.

```ts
// Remove 'unsafe-eval' from script-src:
"script-src 'self' 'unsafe-inline';"
```

If `'unsafe-eval'` is needed for dev only, use conditional CSP based on `process.env.NODE_ENV`.

---

## High Priority

### H1. `LazyMotion` wrapper instantiated on every `FadeUp` mount
**File:** `src/components/motion/fade-up.tsx:14`

Each `FadeUp` creates its own `LazyMotion` provider. Framer Motion docs recommend a single `LazyMotion` at the app root. Current approach loads `domAnimation` features multiple times per page.

**Fix:** Move `LazyMotion` to `layout.tsx` (inside a client wrapper) and use bare `m.div` in `FadeUp`.

### H2. MDX allowlist missing `img` element
**File:** `src/app/blog/[slug]/page.tsx`

If any MDX post includes an image (`![alt](url)`), it will render as an unstyled/uncontrolled `<img>`. Since `img` is not in the allowlist, it falls through to default rendering without width/height constraints or lazy loading. Add it explicitly:

```tsx
img: (props: React.ComponentProps<"img">) => (
  <img {...props} loading="lazy" decoding="async" />
),
```

### H3. `getPostBySlug` throws on missing file -- no graceful 404 for `generateMetadata`
**File:** `src/app/blog/[slug]/page.tsx:37-45`

In `generateMetadata`, the catch returns `{ title: "Post Not Found" }` but doesn't call `notFound()`. The page itself does call `notFound()`, so this is cosmetic -- but the metadata function re-reads the file (double I/O). Consider caching or passing result between functions.

### H4. `new Date().getFullYear()` in Footer is SSR-evaluated
**File:** `src/components/layout/footer.tsx:11`

For a statically generated site, the year is baked at build time. If the site is deployed Dec 31 and not rebuilt until February, the footer shows the wrong year. This is a known Next.js pattern, but worth noting -- consider making Footer a client component or accepting it as a build-time value.

---

## Medium Priority

### M1. `getAllPosts()` called redundantly
**Files:** `src/app/blog/page.tsx:11`, `src/components/home/blog-preview-card.tsx:7`

`getAllPosts()` reads all files from disk synchronously on every call. For the homepage, this is called once per build (SSG) so impact is low. But `getAllTags()` internally calls `getAllPosts()` again -- double file scan. Consider memoizing or having `getAllTags` accept a posts array.

```ts
// In blog/page.tsx, already have posts:
const tags = [...new Set(posts.flatMap(p => p.tags))].sort();
```

### M2. `BlogPreviewCard` is a server component calling `getAllPosts()` directly
**File:** `src/components/home/blog-preview-card.tsx`

This works but couples a UI component directly to the filesystem. If the component is ever used client-side, it will break. Consider passing `latestPost` as a prop from the parent.

### M3. No `aria-current="page"` on active nav link
**File:** `src/components/layout/nav-link.tsx:14`

`isActive` is used for styling but `aria-current="page"` is the standard way to communicate the active page to assistive technology.

```tsx
<Link href={href} onClick={onClick} aria-current={isActive ? "page" : undefined} ...>
```

### M4. Tag filter uses `router.push` -- triggers full re-render
**File:** `src/components/blog/tag-filter.tsx:29`

`router.push` triggers a server roundtrip in App Router. Since all posts are already client-side, use `router.replace` (avoids adding history entries for each filter) or better, use `useQueryState` / local state to filter without navigation.

### M5. `NavLink` marks root `/` active for all paths starting with `/`
**File:** `src/components/layout/nav-link.tsx:14`

```ts
const isActive = pathname === href || pathname.startsWith(`${href}/`);
```

If `href="/"` were ever added, every page matches. Currently not an issue since `/` is not in `navLinks`, but fragile. Guard with `href !== "/"` or check exact match for root.

---

## Low Priority

### L1. Hardcoded social links are placeholder values
**File:** `src/lib/site-config.ts:13-15`

`github: "https://github.com"` and `linkedin: "https://linkedin.com"` are generic -- will need real URLs before deploy.

### L2. `outputFileTracingIncludes` key should be `/blog/[slug]`
**File:** `next.config.ts:6`

The glob `/blog/*` may not match the dynamic route correctly in standalone mode. Verify with a production build that MDX files are included in the trace output.

### L3. Missing `<meta name="robots">` or `robots.ts`
No robots configuration found. Next.js App Router supports `app/robots.ts` for generating `robots.txt`.

### L4. No `sitemap.ts` for SEO
Consider adding `app/sitemap.ts` that calls `getAllPosts()` to generate a sitemap.

---

## Positive Observations

- **Path traversal protection** in `mdx-utils.ts` is well-implemented: regex slug validation + resolved path check
- **Zod frontmatter validation** catches malformed MDX early with clear warnings
- **Draft filtering** respects `NODE_ENV` -- good dev/prod separation
- **MDX component allowlist** is a proper security measure (just needs `img` and `a` hardening)
- **Focus trap** in mobile menu is correctly implemented with Escape key support
- **Security headers** are comprehensive: HSTS, X-Frame-Options, Referrer-Policy, CSP
- **`suppressHydrationWarning`** correctly applied for theme provider pattern
- **`generateStaticParams`** properly pre-renders blog post pages
- **Clean component decomposition** -- files are small, focused, well-named
- **Tailwind v4** usage with `@theme inline` is correct modern pattern
- **`params` as Promise** in dynamic route -- correct Next.js 15 pattern

---

## Metrics

| Metric | Value |
|--------|-------|
| Files reviewed | 27 |
| LOC (approx) | ~850 |
| Critical issues | 2 |
| High issues | 4 |
| Medium issues | 5 |
| Low issues | 4 |
| TypeScript strict | Yes |
| Test coverage | Not evaluated (no tests found) |

---

## Recommended Actions (Priority Order)

1. **Remove `'unsafe-eval'` from CSP** (C2) -- quick config change
2. **Harden `<a>` in MDX allowlist** (C1) -- sanitize `javascript:` protocol
3. **Add `img` to MDX allowlist** with lazy loading (H2)
4. **Hoist `LazyMotion` to app root** (H1) -- performance win
5. **Add `aria-current="page"` to NavLink** (M3) -- accessibility
6. **Use `router.replace` in TagFilter** (M4) -- UX improvement
7. **Deduplicate `getAllPosts` calls** (M1) -- minor perf
8. **Replace placeholder social links** before deploy (L1)
9. **Add `robots.ts` and `sitemap.ts`** (L3, L4) -- SEO

---

## Unresolved Questions

- Is `'unsafe-eval'` in CSP needed for Turbopack dev mode only? If so, make it conditional.
- Will `outputFileTracingIncludes` with `/blog/*` correctly capture MDX files in standalone Docker builds? Needs production build verification.
- Are there plans for image optimization (next/image) in blog posts? Current `img` passthrough skips Next.js image optimization.

---

**Status:** DONE
**Summary:** Clean Next.js 15 codebase with good security foundations. Two critical items (CSP `unsafe-eval`, MDX `<a>` sanitization) and four high-priority items to address before production deployment.
