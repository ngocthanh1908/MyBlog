# Phase 8: Testing

## Context Links
- [Existing test setup](../../package.json) — vitest + @testing-library/react
- [Existing tests](../../src/__tests__/)

## Overview
- **Priority**: P2
- **Status**: Pending
- **Effort**: 2h
- **Depends on**: All previous phases
- **Description**: API route tests, content integration tests, component render tests

## File Ownership (this phase only)
```
NEW:
  src/__tests__/api/posts-api.test.ts       — API CRUD tests
  src/__tests__/api/auth-api.test.ts         — Auth endpoint tests
  src/__tests__/lib/db.test.ts               — DB helper tests
  src/__tests__/lib/mdx-utils-merge.test.ts  — Content merge tests
  src/__tests__/components/search-box.test.tsx — Search component test
  src/__tests__/components/toast.test.tsx      — Toast component test
```

## Key Insights
- Vitest already configured, @testing-library/react available
- API route tests: test handler functions directly (import route handler, call with mock Request)
- DB tests: use in-memory SQLite or temp file (better-sqlite3 supports `:memory:`)
- No mocking database — use real SQLite in tests (fast, deterministic)
- Component tests: render tests with @testing-library/react

## Test Matrix

| Area | Type | What | Priority |
|------|------|------|----------|
| DB helpers | Unit | CRUD operations on :memory: SQLite | High |
| Auth utils | Unit | JWT sign/verify, password check | High |
| POST /api/posts | Integration | Create post via handler | High |
| GET /api/posts | Integration | List posts via handler | High |
| PUT /api/posts/[id] | Integration | Update post | Medium |
| DELETE /api/posts/[id] | Integration | Delete post | Medium |
| POST /api/auth | Integration | Login success/failure | High |
| POST /api/upload | Integration | File upload validation | Medium |
| getAllPosts() merge | Unit | MDX + DB posts combined | High |
| getPostBySlug() fallback | Unit | MDX first, then DB | High |
| SearchBox | Render | Component renders, input works | Low |
| Toast | Render | Shows/hides correctly | Low |

## Implementation Steps

### 1. Create src/__tests__/lib/db.test.ts (~60 lines)
- Use `:memory:` SQLite database for tests
- Test: createDbPost, getAllDbPosts, getDbPostById, updateDbPost, deleteDbPost
- Test: duplicate slug rejection
- Test: draft filtering
- Test: tags JSON serialization/deserialization

### 2. Create src/__tests__/api/auth-api.test.ts (~30 lines)
- Test: correct password → returns JWT token
- Test: wrong password → returns 401
- Test: missing password → returns 400
- Test: verifyToken with valid/invalid/expired tokens

### 3. Create src/__tests__/api/posts-api.test.ts (~60 lines)
- Test: GET /api/posts returns empty, then after insert returns post
- Test: POST /api/posts without auth → 401
- Test: POST /api/posts with auth → creates post
- Test: POST /api/posts with duplicate slug → 409
- Test: PUT /api/posts/[id] updates fields
- Test: DELETE /api/posts/[id] removes post
- Test: GET /api/posts/[id] with nonexistent ID → 404

### 4. Create src/__tests__/lib/mdx-utils-merge.test.ts (~40 lines)
- Test: getAllPosts() returns MDX posts when no DB
- Test: getAllPosts() returns both MDX + DB posts, sorted by date
- Test: getPostBySlug() returns MDX post for existing slug
- Test: getPostBySlug() returns DB post for DB-only slug
- Test: getAllTags() includes tags from both sources

### 5. Create src/__tests__/components/toast.test.tsx (~20 lines)
- Test: toast renders with message
- Test: toast auto-dismisses
- Test: toast type styling (success/error)

### 6. Create src/__tests__/components/search-box.test.tsx (~20 lines)
- Test: renders input with Vietnamese placeholder
- Test: input accepts text
- (Pagefind import mocked — can't run wasm in jsdom)

## Todo List
- [ ] Write DB helper tests
- [ ] Write auth API tests
- [ ] Write posts API tests
- [ ] Write content merge tests
- [ ] Write Toast component test
- [ ] Write SearchBox render test
- [ ] Run `npm test` — all pass
- [ ] Verify existing tests still pass

## Success Criteria
- `npm test` passes all new + existing tests
- DB CRUD operations verified
- Auth flow verified (login, token validation)
- Content merge logic verified
- No test uses mocked database (real SQLite :memory:)

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| better-sqlite3 fails in test env | Low | Medium | Works natively on most platforms; CI uses node:20 |
| API route handler testing pattern unfamiliar | Medium | Low | Use NextRequest/NextResponse constructors directly |
| Pagefind can't run in jsdom | Expected | Low | Mock pagefind import in search tests, test UI only |
