# Phase 1 — Group posts by topic

## Context
`getAllPosts()` in `src/lib/mdx-utils.ts` returns posts sorted by date desc; `tags: string[]` per post.

## Requirements
Pure function `groupPostsByTopic(posts, relatedLimit = 5)` returning
`{ topic: string; featured: BlogPost; related: BlogPost[]; total: number }[]`.
- Group key = `post.tags[0]`; posts with no tags go to topic `"Khác"`.
- Featured = newest post in group; related = next `relatedLimit` newest.
- Groups sorted by `total` desc, tie → featured date desc.

## Files
- create `src/lib/group-posts-by-topic.ts`
- create `src/__tests__/lib/group-posts-by-topic.test.ts` (write first)

## Steps
1. Tests: empty input; single post; two posts same first tag; untagged → "Khác"; ordering by count then date; related capped at limit; second tag ignored.
2. Implement. No fs/db import (pure, client-safe).

## Validation
`npx vitest run src/__tests__/lib/group-posts-by-topic.test.ts`

## Risk / rollback
Pure new file; delete to roll back.
