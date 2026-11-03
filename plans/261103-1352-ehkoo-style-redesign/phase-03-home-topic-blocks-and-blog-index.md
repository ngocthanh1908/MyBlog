# Phase 3 — Home topic blocks + blog index

## Context
`src/app/page.tsx` renders `HeroSection`, `HumanNote`, `TagFilter`. `/blog` renders its own hero + `TagFilter` → `BlogCard` (no cover).

## Requirements
- `TopicSection` (server component): header `#Topic` (link to `/blog?tag=Topic`), featured card (PostCover + title + excerpt + date) linking to post, and "Bài cùng chủ đề" list of related titles. Desktop: card left, list right; mobile: stacked.
- Home: compact intro line (name + one sentence, no big hero), SearchBox, then `TopicSection` per group from Phase 1. Remove `HeroSection`/`HumanNote` usage from home (keep files only if used elsewhere, else delete).
- `/blog`: keep TagFilter + SearchBox; `BlogCard` gains a small `PostCover` thumbnail (hidden below `sm`? no — keep stacked, 16:9, max-height clamp).
- Empty state when no posts.
- Keep Vietnamese copy; fix nothing unrelated.

## Files
- create `src/components/home/topic-section.tsx`
- modify `src/app/page.tsx`
- modify `src/components/blog/blog-card.tsx` (add cover)
- modify `src/app/blog/page.tsx` only if hero needs trimming for consistency
- delete `src/components/home/hero-section.tsx`, `human-note.tsx` if no remaining imports (grep first)
- create `src/__tests__/components/topic-section.test.tsx` (first)

## Steps
1. Tests: renders topic heading, featured title, related links, fallback cover when no coverImage, no related list when `related` empty.
2. Implement `TopicSection`, wire home, update `BlogCard`.
3. Grep for dead imports (`HeroSection`, `HumanNote`, bento/blog-grid already unused — leave).

## Validation
`npx vitest run` + manual check at http://localhost:3000 (dev server already running) at 375/768/1280, light + dark, with one post given a `coverImage` and one without.

## Risk
Only 2 posts / 4 tags today → home looks sparse (each block has 0 related). Acceptable; layout must still look intentional with featured-only blocks.
