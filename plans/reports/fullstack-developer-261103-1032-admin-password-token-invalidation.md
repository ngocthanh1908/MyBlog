# Admin Password Change: Token Invalidation Fix

Status: DONE

## Summary

Added a `token_version` claim to JWT access/refresh tokens and an `admin_credentials.token_version`
DB column. `changeAdminPassword` now atomically bumps the version on every password change;
`verifyToken` rejects any token whose embedded version doesn't match the current one. This covers
`getAuthFromRequest`/`requireAuth` (protected routes) and the refresh route's
`verifyToken(refreshToken, "refresh")` call through the single shared `verifyToken` check point, with
no changes needed in `route.ts` or `refresh/route.ts` — confirmed both still call
`signAccessToken()`/`signRefreshToken()` with no args and the version is read internally.

## Files Changed

- `src/lib/db.ts` (+14 lines, 252 -> 266) — added `token_version` column + safe migration
  (`PRAGMA table_info` check before `ALTER TABLE ... ADD COLUMN`, since `ADD COLUMN` throws if
  re-run), extended `AdminCredentials` type, `getAdminCredentials` SELECT, and `setAdminCredentials`
  upsert to atomically bump `token_version` in the same statement as the password/salt write (no
  separate read-then-write race). First-ever password change starts the row at `token_version = 2`
  (not 1) specifically so it invalidates tokens issued while in env-only mode, whose embedded version
  defaults to 1; every later change increments the existing value by 1.
- `src/lib/admin-password.ts` (+9 lines) — added `getCurrentTokenVersion()`, returns the DB row's
  `token_version` or `1` when no row exists (env-only / never-changed mode).
- `src/lib/auth-utils.ts` — `signAccessToken`/`signRefreshToken` embed `v: getCurrentTokenVersion()`;
  `verifyToken` throws when `payload.v !== getCurrentTokenVersion()`. Import is one-directional
  (`auth-utils.ts -> admin-password.ts -> db.ts`; neither `db.ts` nor `admin-password.ts` imports
  `auth-utils.ts`), confirmed no circular dependency before implementing.
- `src/__tests__/lib/admin-password.test.ts` — updated the in-memory `@/lib/db` mock to mirror the
  real atomic-bump upsert (first change -> 2, then +1 each time); added tests for
  `getCurrentTokenVersion` defaulting to 1 and advancing correctly across changes.
- `src/__tests__/lib/auth-utils.test.ts` — added the same `@/lib/db` mock (previously unmocked, which
  would have made these tests touch the real `data/blog.sqlite` file once `auth-utils.ts` started
  depending on `admin-password.ts`/`db.ts`); added tests proving: env-only mode stays valid (no
  spurious invalidation), an old access token is rejected after `changeAdminPassword` while a
  freshly re-issued one works, an old refresh token is likewise rejected, and `requireAuth` rejects a
  request carrying a pre-password-change access token while accepting a post-change one.

No changes to `src/app/api/auth/route.ts`, `src/app/api/auth/refresh/route.ts`,
`src/app/admin/page.tsx`, or `src/components/admin/change-password-form.tsx`.

## Tasks Completed

- [x] `token_version` column + safe idempotent migration on `admin_credentials`
- [x] `getCurrentTokenVersion()` helper (env-only default = 1)
- [x] `changeAdminPassword` bumps `token_version` atomically with the password/salt write
- [x] `signAccessToken`/`signRefreshToken` embed current version
- [x] `verifyToken` rejects stale-version tokens (covers access + refresh, login + refresh routes)
- [x] Confirmed no call-site changes needed in login/refresh routes
- [x] Confirmed no circular import risk

## Tests Status

- Type check (`npx tsc --noEmit`): pass, no output.
- Unit tests (`npm run test`): pass — 13 files, 87 tests, including the 6 new/updated cases above.
- Lint (`npm run lint`): the modified `src/lib/*` and `src/__tests__/lib/*` files have zero
  warnings/errors. The run reports 19 errors / 708 warnings, all confined to pre-existing generated
  vendor files under `public/pagefind/*.js` (`no-this-alias`, `no-unused-vars`,
  `no-unused-expressions`) — unrelated to this change, not introduced by it, verified by grepping the
  lint output for any `src\lib` or `src\__tests__` hits (none).

## Concerns / Flags

- `src/lib/db.ts` grew from 252 to 266 lines, pushing further over the repo's 200-line
  modularization guideline (it was already over before this change). Per the task's explicit
  constraint I did not restructure it, and kept `getCurrentTokenVersion()` in `admin-password.ts`
  instead of `db.ts` specifically to minimize further growth there. Flagging per instructions —
  splitting `db.ts` (e.g. separating post-CRUD, rate-limit, and admin-credentials concerns into
  their own modules) is a reasonable follow-up but out of scope for this fix.
- The first-password-change-starts-at-2 detail is not explicitly in the original design doc (which
  said "increment by 1") but is required for correctness: incrementing from the implicit no-row
  default of 1 to 1 again on first insert would not invalidate env-password-issued tokens on the very
  first password change. Verified via the new test
  `getCurrentTokenVersion advances past the default on the first password change...`.

## Unresolved Questions

None.
