# Phase A: Media Library

**Priority:** HIGH | **Status:** pending | **Depends on:** none

## Overview
Add media management to admin: list uploaded files, delete, preview, copy Markdown syntax. Foundation for editor image insertion in Phase B.

## Key Insights
- Existing `POST /api/upload` handles upload + path-traversal guard + 5MB limit
- Files stored in `public/uploads/` with timestamp-prefixed names
- No list/delete API exists yet
- Admin already has `ArticleForm` with cover image upload

## Requirements
### Functional
- List all files in uploads directory with thumbnail preview
- Delete files via API (auth-guarded)
- Copy Markdown image syntax `![](url)` to clipboard
- Show file size and upload date
- Insert image into post content from media picker

### Non-functional
- Lazy load thumbnails
- Handle empty state gracefully

## Architecture
```
GET  /api/uploads          → list files (name, size, date, url)
DELETE /api/uploads/[name] → delete file (auth required)
```

Admin UI: new "Media" tab/view in admin page with grid of thumbnails.

## Related Code Files
### Modify
- `src/app/admin/page.tsx` — add "media" view state
- `src/components/admin/article-form.tsx` — add media picker button

### Create
- `src/app/api/uploads/route.ts` — GET list endpoint
- `src/app/api/uploads/[name]/route.ts` — DELETE endpoint
- `src/components/admin/media-library.tsx` — grid UI component

## Implementation Steps
1. Create `GET /api/uploads` — read `public/uploads/`, return file metadata array
2. Create `DELETE /api/uploads/[name]` — auth-guarded, sanitize name, delete file
3. Create `media-library.tsx` — grid component with thumbnails, delete, copy-markdown buttons
4. Add "Media" view to admin page (list → create → edit → **media**)
5. Add media picker modal to article-form for inserting images into content
6. Test all endpoints and UI

## Todo
- [ ] GET /api/uploads endpoint
- [ ] DELETE /api/uploads/[name] endpoint
- [ ] Media library grid component
- [ ] Admin page media view
- [ ] Media picker in article form
- [ ] Tests for upload list/delete APIs

## Success Criteria
- Can browse all uploaded images in admin
- Can delete images
- Can copy Markdown syntax
- Can insert image from library into post content

## Risk Assessment
- Path traversal on delete → sanitize filename, verify resolved path within uploads dir
- Large number of files → paginate if needed (YAGNI for now)

## Security
- All endpoints require Bearer token auth
- Filename sanitization on delete (reuse existing `sanitizeFilename`)
- Verify resolved path stays within UPLOAD_DIR
