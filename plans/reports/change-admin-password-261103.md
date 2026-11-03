# Change Admin Password — Implementation Report

Date: 2026-11-03

## Status
DONE

## Summary
Added a single-admin password change flow: a new `admin_credentials` SQLite table,
a shared `verifyAdminPassword`/`changeAdminPassword` helper using Node's built-in
`crypto.scrypt`, a new `POST /api/auth/change-password` endpoint guarded by
`requireAuth` and rate-limited, and an admin UI tab/form wired to it. The existing
`ADMIN_PASSWORD` env-var login path is preserved byte-for-byte in behavior when no
password has ever been changed.

## Files Created
- `src/lib/admin-password.ts` (49 lines) — `hasConfiguredAdminPassword`,
  `verifyAdminPassword(password)`, `changeAdminPassword(newPassword)`. Scrypt with a
  random 16-byte salt (hex), 64-byte derived key (hex), timing-safe comparisons.
- `src/app/api/auth/change-password/route.ts` (48 lines) — `requireAuth` guard,
  SQLite-backed rate limit (`checkRateLimit(ip, "change-password", 5, 60)`),
  validates both fields present, `newPassword.length >= 8`, verifies
  `currentPassword` via the shared helper, then persists the new hash.
- `src/components/admin/change-password-form.tsx` (109 lines) — current/new/confirm
  password fields, client-side match + length validation, calls the new endpoint
  with `Authorization: Bearer <token>` (same pattern as `tag-manager.tsx`), feedback
  via the existing `useToast` provider.
- `src/__tests__/lib/admin-password.test.ts` (76 lines) — mocks `@/lib/db` with an
  in-memory stand-in (never touches the real `data/blog.sqlite`), covers: env-var
  fallback (no regression), unconfigured state, no-throw on length-mismatched
  compare, hash/salt persistence shape, DB-row-takes-precedence-over-env, and the
  end-to-end "old password fails / new password succeeds" scenario required by the
  acceptance criteria.

## Files Modified
- `src/lib/db.ts` — added `CREATE TABLE IF NOT EXISTS admin_credentials (...)`
  (same `IF NOT EXISTS` migration pattern as `rate_limits`/`posts`), plus
  `getAdminCredentials()` and `setAdminCredentials(hash, salt)` (upsert, single row
  `id = 1`).
- `src/app/api/auth/route.ts` — replaced the inline env-only check with
  `hasConfiguredAdminPassword()` (preserves the 500 "Server misconfigured" case)
  and `verifyAdminPassword(body.password)` (preserves the 401 "Invalid password"
  case). Response shape, status codes, and cookie handling are unchanged.
- `src/app/admin/page.tsx` — added `"password"` to the `View` union, added the
  "Doi mat khau" tab (no-diacritics label matching "Bai viet"/"Thu vien anh"), and
  rendered `<ChangePasswordForm />` for that view.

## Tasks Completed
- [x] `admin_credentials` table via the existing migration pattern
- [x] scrypt hashing with random salt, no new dependency
- [x] login checks DB row first, falls back to env var — unchanged contract
- [x] `POST /api/auth/change-password`, auth-guarded, rate-limited, validated
- [x] shared `verifyAdminPassword` helper (DRY between login and change-password)
- [x] admin UI tab + form wired to the endpoint with toast feedback
- [x] tests for the no-regression path and the end-to-end old/new password case

## Tests Status
- Type check (`npx tsc --noEmit`): pass, no output.
- Unit tests (`npm run test`): pass — 13 test files, 81 tests (was 12/??? before;
  +1 new file, all existing tests untouched and still green).
- Lint (`npm run lint`): the full repo-wide run reports pre-existing errors only in
  generated build artifacts (`public/pagefind/pagefind*.js`, `this`-aliasing
  errors from the vendored Pagefind bundle, unrelated to this change). Targeted
  `npx eslint` on every file created/modified in this task
  (`src/lib/admin-password.ts`, `src/lib/db.ts`, `src/app/api/auth/route.ts`,
  `src/app/api/auth/change-password/route.ts`,
  `src/components/admin/change-password-form.tsx`, `src/app/admin/page.tsx`,
  `src/__tests__/lib/admin-password.test.ts`) produced zero errors/warnings.

## Design Notes / Choices
- **Mismatch check is client-only.** The server only ever receives one
  `newPassword` value — there's nothing for it to re-check a confirmation against,
  so adding a second field server-side would add no real protection. Documented
  inline in `change-password/route.ts`.
- **`db.ts` grew to 252 lines**, above the repo's 200-line guideline. It was
  already at 218 lines before this change. The task's design explicitly directs
  following `db.ts`'s exact `CREATE TABLE IF NOT EXISTS` pattern for the new
  table and keeping schema/accessors there (matching `posts`/`rate_limits`), so I
  kept schema + simple CRUD (`getAdminCredentials`/`setAdminCredentials`) in
  `db.ts` and moved all hashing/business logic into the new, separate
  `src/lib/admin-password.ts` (49 lines) rather than splitting `db.ts` itself,
  which would have broken from the established single-file-per-table-group
  pattern already in use. Flagging this as a deliberate judgment call rather than
  a silent deviation.
- Auth-check ordering in `change-password/route.ts`: `requireAuth` runs before
  rate limiting, so unauthenticated requests get a clean 401 regardless of rate
  limit state (matches the acceptance criterion explicitly calling out 401 for
  unauthenticated requests as a distinct case from 429).

## Concerns/Blockers
None. All acceptance criteria are met:
- Existing env-var-only login still works, covered by test.
- New endpoint rejects unauthenticated (401), wrong current password (401), short
  new password (400), is rate-limited (429), and persists a scrypt hash on
  success.
- Old password fails / new password succeeds after a change, verified end-to-end
  via `verifyAdminPassword`.
- Admin UI has a working form with toast success/error feedback.
- `npm run test` and the targeted lint of all touched files pass; the full-repo
  lint's only errors are pre-existing, unrelated to this change, in vendored
  `public/pagefind` build output.

## Unresolved Questions
None.
