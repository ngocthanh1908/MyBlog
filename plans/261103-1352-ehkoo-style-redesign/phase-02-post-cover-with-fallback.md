# Phase 2 — Post cover with fallback

## Context
`BlogPost.coverImage?: string` exists (frontmatter + DB `cover_image`) but nothing renders it. Uploads are served from `/uploads/*`. CSP allows only same-origin images.

## Requirements
`PostCover` component: props `{ src?: string; alt: string; topic: string; className?: string }`.
- With `src`: `<img>` in a `aspect-video` wrapper, `object-cover`, `loading="lazy"`, `decoding="async"`, rounded, `alt` = post title.
- Without `src`: same wrapper, gradient `from-accent-light to-accent-border` (tokens, so dark mode works) with the topic label centered, `aria-hidden`.
- Image load error → swap to fallback (client state), so a bad path never shows a broken icon.
- Same box size in both cases → no layout shift.
- Only accept `src` starting with `/` (local); anything else → fallback (CSP would block it anyway).

## Files
- create `src/components/blog/post-cover.tsx` (client component, small)
- create `src/__tests__/components/post-cover.test.tsx` (first)

## Steps
1. Tests: renders img when src; fallback when no src; fallback when src is external URL; fallback after `error` event; alt text set.
2. Implement.

## Validation
`npx vitest run src/__tests__/components/post-cover.test.tsx`

## Risk / rollback
New file only. Cover guidance for authors (16:9, 1600×900, WebP < 150 KB, no text in image, safe margins) goes in docs in Phase 5.
