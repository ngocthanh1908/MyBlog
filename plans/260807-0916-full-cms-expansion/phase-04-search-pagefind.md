# Phase 4: Search with Pagefind

## Context Links
- [Search Research](../reports/researcher-260807-0916-comments-search-images.md)
- [Home page](../../src/app/page.tsx)
- [HTML Mockup](../../uiux/phamngocthanh_blog_full.html) — search box on home page

## Overview
- **Priority**: P2
- **Status**: Complete
- **Effort**: 3h
- **Depends on**: Phase 3 (all posts must be rendered for indexing)
- **Description**: Build-time static search via Pagefind, search UI on blog page

## File Ownership (this phase only)
```
NEW:
  src/components/blog/search-box.tsx  — search input + results dropdown

MODIFY:
  package.json                       — add pagefind dev dependency + postbuild script
  next.config.ts                     — update CSP if needed for pagefind wasm
  src/app/blog/page.tsx              — add SearchBox above tag filter
```

## Key Insights
- Pagefind indexes the built HTML output, not source files
- Must run `pagefind` CLI after `next build` (postbuild script)
- Pagefind generates files in `public/pagefind/` — served as static assets
- Client-side: dynamically import pagefind JS, call `search()` method
- Vietnamese text: Pagefind handles Unicode diacritics natively
- Standalone output: index goes into `.next/standalone/public/pagefind/`

## Architecture

### Build Pipeline
```
next build → generates .next/standalone/ with HTML
pagefind --site .next/standalone/.next/server/app → indexes HTML pages
copy pagefind output → public/pagefind/ (served by Next.js)
```

### Search Flow
```
User types in SearchBox → debounce 300ms
  → import('/pagefind/pagefind.js')
  → pagefind.search(query)
  → display results (title, excerpt, URL)
  → click result → navigate to /blog/[slug]
```

## Implementation Steps

### 1. Install pagefind
```bash
npm install -D pagefind
```

### 2. Add postbuild script to package.json
```json
"scripts": {
  "build": "next build",
  "postbuild": "npx pagefind --site .next/standalone --output-path public/pagefind"
}
```
Note: Exact `--site` path may need adjustment based on Next.js standalone output structure. Test locally first.

### 3. Create src/components/blog/search-box.tsx (~80 lines)
- 'use client' component
- Search input with magnifying glass icon (lucide-react Search icon)
- Debounced input (300ms)
- On first keystroke: dynamically import pagefind
- Display results in dropdown below input
- Each result: title + excerpt snippet + link
- "Không tìm thấy kết quả" if empty results
- Click outside closes dropdown
- Styling: matches existing card design (bg-surface, border-border, rounded-xl)
- Vietnamese placeholder: "Tìm kiếm bài viết..."

### 4. Update src/app/blog/page.tsx (~3 lines)
- Import SearchBox
- Add `<SearchBox />` between hero section and TagFilter
- Wrap in Suspense (client component)

### 5. Update next.config.ts CSP if needed
- Pagefind uses WebAssembly — may need `script-src 'wasm-unsafe-eval'`
- Test without change first, add only if pagefind fails to load

### 6. Handle Docker build
- Postbuild script runs after `next build` in Dockerfile
- Pagefind output must be included in final image
- Update Dockerfile build stage if needed:
  ```dockerfile
  RUN npx next build && npx pagefind --site .next/standalone --output-path public/pagefind
  ```

## Todo List
- [x] Install pagefind
- [x] Add postbuild script
- [x] Create SearchBox component
- [x] Add SearchBox to blog page
- [x] Test search with existing posts
- [x] Test Vietnamese diacritic search
- [x] Verify Docker build includes pagefind index
- [x] Update CSP if wasm blocked

## Success Criteria
- Search "SAP" → returns matching posts
- Search "chạy bộ" → returns matching posts (Vietnamese)
- Search "thanh" finds "thành" (accent-insensitive)
- Empty search → no dropdown
- No results → shows "Không tìm thấy kết quả"
- Click result → navigates to article
- Works in Docker production build

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Pagefind can't find HTML in standalone output | Medium | Medium | Test --site path; may need to point at server/app directory |
| CSP blocks WebAssembly | Medium | Low | Add wasm-unsafe-eval to CSP |
| Pagefind index not included in Docker image | Medium | Medium | Ensure COPY in Dockerfile includes public/pagefind/ |
| DB posts not indexed (created after build) | Expected | Low | Known limitation: only build-time posts indexed. Rebuild to index new posts. Acceptable for low-frequency publishing. |
