# Phase C: Tag & Category Management

**Priority:** MEDIUM | **Status:** pending | **Depends on:** none

## Overview
Add tag management UI to admin: view all tags with post counts, rename across posts, delete. Add tag autocomplete to article form.

## Key Insights
- Tags stored as JSON string in `posts.tags` column (e.g. `'["tech","ai"]'`)
- No separate tags table — keep JSON approach (YAGNI for solo blog)
- Need to query distinct tags across all posts
- Rename = batch update all posts containing old tag

## Requirements
### Functional
- Tag list view: all unique tags with post count
- Rename tag: updates all posts containing it
- Delete tag: removes from all posts' tag arrays
- Tag autocomplete in article form editor

### Non-functional
- Operations wrapped in SQLite transaction
- Case-insensitive tag matching

## Architecture
```
GET  /api/tags           → distinct tags with counts
PUT  /api/tags/[name]    → rename tag (body: { newName })
DELETE /api/tags/[name]  → remove tag from all posts
```

Tag queries use SQLite JSON functions or string matching on the tags column.

## Related Code Files
### Modify
- `src/app/admin/page.tsx` — add "tags" view
- `src/components/admin/article-form.tsx` — add tag autocomplete
- `src/lib/db.ts` — add tag helper functions

### Create
- `src/app/api/tags/route.ts` — GET list
- `src/app/api/tags/[name]/route.ts` — PUT rename, DELETE remove
- `src/components/admin/tag-manager.tsx` — tag list UI

## Implementation Steps
1. Add DB helpers: `getAllTags()` (distinct tags + counts), `renameTag()`, `deleteTag()`
2. Create `GET /api/tags` — returns `[{ name, count }]`
3. Create `PUT /api/tags/[name]` — rename across all posts (transaction)
4. Create `DELETE /api/tags/[name]` — remove from all posts (transaction)
5. Create `tag-manager.tsx` — list with rename/delete actions
6. Add "Tags" view to admin page
7. Add tag autocomplete to article form (fetch tags on mount, filter as user types)
8. Test tag operations

## Todo
- [ ] DB helper functions for tag operations
- [ ] GET /api/tags endpoint
- [ ] PUT /api/tags/[name] rename endpoint
- [ ] DELETE /api/tags/[name] endpoint
- [ ] Tag manager UI component
- [ ] Admin page tags view
- [ ] Tag autocomplete in article form
- [ ] Tests for tag CRUD

## Success Criteria
- Can see all tags with post counts
- Can rename tag — all posts updated
- Can delete tag — removed from all posts
- Autocomplete suggests existing tags in editor

## Risk Assessment
- JSON column parsing: SQLite `json_each` or parse in JS — JS simpler, fine for <1000 posts
- Rename collision: check if newName already exists, merge if so
- Transaction safety: wrap rename/delete in `db.transaction()`

## Security
- All endpoints require Bearer token auth
- Tag name sanitized (trim, lowercase)
