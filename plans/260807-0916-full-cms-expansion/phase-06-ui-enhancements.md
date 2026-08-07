# Phase 6: UI Enhancements

## Context Links
- [HTML Mockup](../../uiux/phamngocthanh_blog_full.html) — admin bar, progress bar, enhanced cards
- [Navbar](../../src/components/layout/navbar.tsx)
- [NavLink](../../src/components/layout/nav-link.tsx)
- [BlogCard](../../src/components/blog/blog-card.tsx)
- [Habits page](../../src/app/habits/page.tsx)
- [Habits data](../../src/data/habits-data.ts)

## Overview
- **Priority**: P3
- **Status**: Pending
- **Effort**: 4h
- **Depends on**: Phase 2 (admin bar needs auth context)
- **Description**: Admin bar, running progress bar, enhanced blog cards, active nav underline

## File Ownership (this phase only)
```
NEW:
  src/components/layout/admin-bar.tsx      — green top bar when logged in

MODIFY:
  src/app/layout.tsx                       — add AdminBar above Navbar
  src/app/habits/page.tsx                  — add progress bar section
  src/data/habits-data.ts                  — add yearly goal data
  src/components/layout/nav-link.tsx       — add active underline effect
  src/components/blog/blog-card.tsx        — add admin edit/delete in footer (when logged in)
```

## Implementation Steps

### 1. Create src/components/layout/admin-bar.tsx (~40 lines)
- 'use client' component
- Check admin token in localStorage (same pattern as admin auth provider)
- If logged in: show green bar at top with:
  - Left: "Admin" label
  - Right: "Quản lý" link to /admin + "Đăng xuất" button
- Background: bg-accent, text-white, fixed top, z-50
- Height: ~36px, compact
- If not logged in: render nothing

### 2. Update src/app/layout.tsx (~3 lines)
- Import AdminBar
- Add `<AdminBar />` before `<Navbar />` inside body
- Adjust main padding-top if admin bar is fixed position

### 3. Update src/data/habits-data.ts (~10 lines)
- Add yearly running goal data:
  ```typescript
  export const yearlyRunGoal = {
    year: 2026,
    targetKm: 1000,
    currentKm: 780,
    label: "Mục tiêu chạy năm 2026",
  };
  ```

### 4. Update src/app/habits/page.tsx (~20 lines)
- Import yearlyRunGoal
- Add progress bar section between dashboard and MAF philosophy:
  - Title: "Mục tiêu chạy năm {year}"
  - Progress bar: green fill, percentage label
  - Stats: "{currentKm} / {targetKm} KM ({percentage}%)"
  - Same card styling as existing sections

### 5. Update src/components/layout/nav-link.tsx (~5 lines)
- Use `usePathname()` to detect current route
- Add bottom border/underline when active: `border-b-2 border-accent`
- Transition on hover/active state

### 6. Update src/components/blog/blog-card.tsx (~15 lines)
- Check admin token in localStorage (client-side)
- If admin: show edit/delete buttons in card footer
- Edit: link to `/admin?edit={post.id}` or open modal
- Delete: confirm dialog → DELETE /api/posts/{id} → refresh
- Non-admin: card unchanged (existing behavior)
- ponytail: keep it simple — just show "Sửa" link to admin page, no inline delete on public cards

## Todo List
- [ ] Create AdminBar component
- [ ] Add AdminBar to root layout
- [ ] Add yearly goal data to habits-data.ts
- [ ] Add progress bar to habits page
- [ ] Update nav-link with active underline
- [ ] Add admin actions to blog-card footer
- [ ] Test admin bar visibility toggle
- [ ] Test progress bar rendering

## Success Criteria
- Logged in: green admin bar visible on all pages
- Admin bar: "Quản lý" navigates to /admin, "Đăng xuất" clears auth
- Habits page: progress bar shows 780/1000 KM (78%)
- Active nav link has green underline
- Blog cards show "Sửa" link when admin (for DB posts only)
- All enhancements use existing design tokens

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Admin bar layout shift | Low | Low | Use fixed position or reserve space |
| localStorage check on every card render | Low | Low | Single check in parent, pass isAdmin prop down |
| Progress bar data hardcoded | Expected | Low | Fine for MVP; integrate Strava API later if needed |
