# Phase 5: Comments with Giscus

## Context Links
- [Comments Research](../reports/researcher-260807-0916-comments-search-images.md)
- [Blog detail page](../../src/app/blog/[slug]/page.tsx)
- [HTML Mockup](../../uiux/phamngocthanh_blog_full.html) — comments section

## Overview
- **Priority**: P2
- **Status**: Complete
- **Effort**: 2h
- **Depends on**: None (can run parallel with Phase 2+)
- **Description**: Add Giscus (GitHub Discussions-backed) comments to article detail page

## File Ownership (this phase only)
```
NEW:
  src/components/blog/comments-section.tsx  — Giscus wrapper component

MODIFY:
  src/app/blog/[slug]/page.tsx              — add CommentsSection below article
  next.config.ts                            — update CSP for giscus.app iframe
  package.json                              — add @giscus/react
```

## Key Insights
- Giscus loads in iframe from giscus.app — requires CSP frame-src update
- Maps articles to GitHub Discussions via pathname
- Supports dark/light theme (use next-themes to sync)
- Vietnamese locale available: `lang="vi"`
- ~3KB client bundle (iframe does the heavy lifting)

## Architecture

### Giscus Config
```typescript
// Comments mapped by pathname: /blog/my-article → Discussion titled "blog/my-article"
// Category: "Announcements" (or create "Blog Comments" category in repo)
// Reactions enabled
// Lazy loading: load when scrolled into view
```

### Component Structure
```
blog/[slug]/page.tsx
  └── <article> ... </article>
  └── <CommentsSection /> (client component)
       └── <Giscus
             repo="ngocthanh1908/MyBlog"
             repoId="..." 
             category="..."
             categoryId="..."
             mapping="pathname"
             theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
             lang="vi"
             loading="lazy"
           />
```

## Prerequisites (manual steps)
1. Enable GitHub Discussions on the repo (Settings → Features → Discussions)
2. Create a "Blog Comments" category (or use existing "Announcements")
3. Install Giscus GitHub App on the repo: https://github.com/apps/giscus
4. Get repo ID + category ID from https://giscus.app (config tool)

## Implementation Steps

### 1. Install @giscus/react
```bash
npm install @giscus/react
```

### 2. Create src/components/blog/comments-section.tsx (~40 lines)
- 'use client' component
- Import Giscus from @giscus/react
- Import useTheme from next-themes
- Render Giscus with config props
- Theme sync: `theme={resolvedTheme === 'dark' ? 'dark' : 'light'}`
- Add section heading: "Bình luận" with separator
- Wrap in div with same max-width and padding as article

### 3. Update src/app/blog/[slug]/page.tsx (~3 lines)
- Import CommentsSection
- Add `<CommentsSection />` after the `</article>` closing tag
- Wrap in Suspense for client component loading

### 4. Update next.config.ts CSP
- Add `frame-src 'self' https://giscus.app;` to Content-Security-Policy
- Add `script-src 'self' 'unsafe-inline' https://giscus.app;` if needed

### 5. Add env vars for Giscus config (optional)
- Can hardcode repo/category IDs (they're public info, not secrets)
- Or use NEXT_PUBLIC_GISCUS_REPO, NEXT_PUBLIC_GISCUS_REPO_ID, etc.

## Todo List
- [x] Enable GitHub Discussions on repo
- [x] Install Giscus GitHub App
- [x] Get repo ID + category ID from giscus.app
- [x] Install @giscus/react
- [x] Create CommentsSection component
- [x] Add to blog detail page
- [x] Update CSP for giscus.app
- [ ] Test comment posting (manual GitHub setup)
- [x] Test dark/light theme sync
- [x] Verify Vietnamese locale

## Success Criteria
- Comments section appears below every article
- Can post a comment (requires GitHub login)
- Comments persist (stored in GitHub Discussions)
- Theme changes → Giscus theme updates
- Vietnamese UI labels in Giscus widget
- No CSP errors in console

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| CSP blocks Giscus iframe | High | Medium | Update CSP before deploying; test locally |
| GitHub Discussions not enabled | Low | High | Document prerequisite steps clearly |
| Giscus API rate limit (60/hr) | Low | Low | Non-issue for personal blog traffic |
