# Phase 2: Admin UI

## Context Links
- [Phase 1: Database + API](./phase-01-database-api-foundation.md)
- [HTML Mockup](../../uiux/phamngocthanh_blog_full.html) — login modal, article CRUD modal, admin bar
- [Existing tag-filter component](../../src/components/blog/tag-filter.tsx)

## Overview
- **Priority**: P1
- **Status**: Pending
- **Effort**: 6h
- **Depends on**: Phase 1 (API routes must exist)
- **Description**: Admin login modal, article list/create/edit/delete UI, toast notifications

## File Ownership (this phase only)
```
NEW:
  src/app/admin/page.tsx                    — admin dashboard page
  src/components/admin/admin-login-modal.tsx — password login form
  src/components/admin/article-form.tsx      — create/edit article form
  src/components/admin/article-list.tsx      — admin article table with actions
  src/components/admin/admin-auth-provider.tsx — auth context (token in localStorage)
  src/components/ui/toast.tsx               — toast notification component
  src/components/ui/modal.tsx               — reusable modal component

NO MODIFY (Phase 3 handles content integration):
  src/app/page.tsx
  src/app/blog/**
```

## Key Insights
- Admin UI is client-side only — no SSR for admin pages
- Auth state lives in React context + localStorage (no cookies needed)
- Vietnamese labels throughout admin UI (matching mockup)
- Reuse existing design tokens (--color-accent, --card-shadow, etc.)
- Article form: title, slug (auto-generated), tags, excerpt, content (textarea), cover image (URL or upload)

## Architecture

### Auth Context
```typescript
// AdminAuthProvider wraps /admin route
// Stores JWT in localStorage
// Provides: { token, isLoggedIn, login(password), logout() }
// On mount: check localStorage for existing valid token
```

### Admin Page Flow
```
/admin → AdminAuthProvider checks token
  ├── No token → show AdminLoginModal
  └── Valid token → show ArticleList
       ├── "Tạo bài viết mới" button → ArticleForm (create mode)
       └── Edit button on row → ArticleForm (edit mode, pre-filled)
```

### Component Tree
```
/admin/page.tsx
  └── AdminAuthProvider (client)
       ├── AdminLoginModal (if not authed)
       └── <div>
            ├── Header ("Quản lý bài viết")
            ├── ArticleList
            │    └── rows with Edit/Delete buttons
            └── Modal > ArticleForm (when creating/editing)
```

## Implementation Steps

### 1. Create src/components/ui/modal.tsx (~40 lines)
- Reusable modal: overlay + centered content card
- Props: `isOpen`, `onClose`, `title`, `children`
- Click outside or Escape to close
- Uses existing design tokens (bg-surface, border-border, rounded-[20px])

### 2. Create src/components/ui/toast.tsx (~50 lines)
- Simple toast notification component
- Types: success (green), error (red), info (blue)
- Auto-dismiss after 3 seconds
- Position: fixed bottom-right
- State: `useToast()` hook returns `{ show(message, type) }`
- Keep it simple: single active toast, no queue

### 3. Create src/components/admin/admin-auth-provider.tsx (~50 lines)
- React context: `AdminAuthContext`
- On mount: read token from localStorage, verify via decode (not API call — JWT is self-contained)
- `login(password)`: POST /api/auth, store token, set state
- `logout()`: clear localStorage, reset state
- `useAdminAuth()` hook

### 4. Create src/components/admin/admin-login-modal.tsx (~40 lines)
- Password input + "Đăng nhập" button
- Show error on wrong password ("Mật khẩu không đúng")
- On success: context updates, modal disappears
- Match mockup styling: centered card, green accent button

### 5. Create src/components/admin/article-list.tsx (~70 lines)
- Fetch GET /api/posts?drafts=true with auth header
- Table/card list: title, status (draft/published), date, actions
- Actions: "Sửa" (edit) → opens form modal, "Xóa" (delete) → confirm then DELETE
- "Tạo bài viết mới" button at top
- Show toast on delete success/error
- Vietnamese labels

### 6. Create src/components/admin/article-form.tsx (~100 lines)
- Mode: create (empty) or edit (pre-filled from existing post)
- Fields:
  - Title (text input)
  - Slug (auto-generated from title, editable)
  - Tags (comma-separated text input)
  - Read time (number, minutes)
  - Excerpt (textarea, 2-3 lines)
  - Cover image (text URL input + "Tải lên" upload button)
  - Content (large textarea, markdown)
  - Draft toggle (checkbox)
- Image upload: click "Tải lên" → file input → POST /api/upload → insert URL
- Submit: POST /api/posts (create) or PUT /api/posts/[id] (edit)
- Validation: title required, slug required, content required
- Show toast on success/error

### 7. Create src/app/admin/page.tsx (~40 lines)
- Mark as `'use client'`
- Wrap with AdminAuthProvider
- Render ArticleList (which handles login gate internally via useAdminAuth)
- Page metadata: `title: "Quản lý"`

## Todo List
- [ ] Create reusable Modal component
- [ ] Create Toast component + useToast hook
- [ ] Create AdminAuthProvider context
- [ ] Create AdminLoginModal
- [ ] Create ArticleList with fetch + delete
- [ ] Create ArticleForm with create/edit + image upload
- [ ] Create /admin page
- [ ] Test full CRUD flow in browser

## Success Criteria
- Navigate to /admin → see login modal
- Enter correct password → see article list (empty initially)
- Click "Tạo bài viết mới" → fill form → submit → article appears in list
- Click edit → form pre-filled → modify → save → changes reflected
- Click delete → confirm → article removed
- Upload image → URL inserted into content/cover field
- Toast shows on every action (success/error)
- Logout → back to login modal

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| localStorage not available (SSR) | Low | Medium | Guard with typeof window check, 'use client' directive |
| Large content textarea UX | Medium | Low | Sufficient for MVP; add markdown preview in future if needed |
| Form state lost on accidental close | Medium | Low | Confirm dialog on modal close if form dirty |

## Security Considerations
- Admin page is client-rendered — no SSR data leak
- Token checked client-side for UI gating, server-side for API calls
- No admin-only data in page source (fetched via authenticated API calls)
