# Code Review: Password-Reuse Prevention (last-5 history)

## Scope
- `src/lib/db.ts` — new `admin_password_history` table + index, `addPasswordHistoryEntry`/`getPasswordHistory`
- `src/lib/admin-password.ts` — `isPasswordReused`, `matchesEnvPassword`/`matchesHash`, `changeAdminPassword` archiving
- `src/app/api/auth/change-password/route.ts` — reuse check, reordered validation
- `src/__tests__/lib/admin-password.test.ts`

## Verification performed
- `npm run test -- --run` → 13 files, **91/91 passed**
- `npx tsc --noEmit` → clean, no output
- `npx eslint` on all 4 touched files → clean, no output
- Full diff read line-by-line (`git diff` on each file); confirmed against `git show HEAD:...` for the pre-change route.ts

## Findings

### 1. `addPasswordHistoryEntry` trim logic — CORRECT, no off-by-one
```sql
INSERT INTO admin_password_history (...) VALUES (?, ?);
DELETE FROM admin_password_history
WHERE id NOT IN (SELECT id FROM admin_password_history ORDER BY id DESC LIMIT 4);
```
Both statements run inside `d.transaction(() => {...})()` (better-sqlite3), so insert+trim is atomic. Insert-then-delete-outside-top-4-by-id correctly keeps exactly the 4 most recent rows after each call (never 3, never 5). Using `id DESC` instead of `created_at` is a deliberate and correct choice — avoids same-second timestamp ties on fast sequential changes (SQLite `datetime('now')` has 1-second resolution). No bug.

### 2. `isPasswordReused` — CORRECT, timing-safe, correct fallback
`matchesHash` reuses the exact same `hashPassword` + `timingSafeStringEqual` path as `verifyAdminPassword` (scrypt-derive then `crypto.timingSafeEqual`), applied to the current row and each of the up to 4 history rows. No plaintext comparison anywhere against stored hashes. Env fallback is only used `if (!row)` — i.e., only when the password has truly never been changed and no history can exist yet. This matches the documented and tested contract (`isPasswordReused` test: "env-only mode" case). No bug.

Minor pre-existing (not introduced here) characteristic: `timingSafeStringEqual` short-circuits on length mismatch before calling `crypto.timingSafeEqual`, which is a comparison-length timing leak. This is unchanged from the already-shipped `verifyAdminPassword` and is low-risk here since all compared values are fixed-length (128-hex-char) scrypt outputs — practically unexploitable. Documented for completeness, not a new regression.

### 3. `changeAdminPassword` sequencing — not fully atomic, but no credential loss or wrong token_version (Medium)
```js
const currentRow = getAdminCredentials();
if (currentRow) addPasswordHistoryEntry(currentRow.password_hash, currentRow.salt); // txn A
const salt = ...; const passwordHash = hashPassword(newPassword, salt);
setAdminCredentials(passwordHash, salt); // single atomic UPSERT, txn B
```
These are two **separate** SQLite transactions, not one enclosing transaction. If the process dies/throws between txn A and txn B (e.g. disk full, process kill), the outcome is: the outgoing password is archived into history, but `admin_credentials` is untouched — meaning the current (unchanged) password now also has a duplicate entry in history. This does **not** lose the live credential, does **not** corrupt `token_version` (that bump only happens inside `setAdminCredentials`'s own atomic UPSERT, which either fully applies or fully doesn't), and does not create a situation where an admin is locked out. It's a harmless duplicate at worst.

Recommendation (non-blocking): wrap both statements in a single `getDb().transaction(() => {...})()` for correctness-by-construction rather than relying on "the failure mode happens to be benign." Not required to ship, but should be a fast follow since the pattern (`addPasswordHistoryEntry`) already demonstrates the project knows how to use `d.transaction`.

### 4. Validation reorder in route.ts — no logic gap, no new timing side-channel (confirmed safe)
Original order: length check → current-password check. New order: current-password check → length check → reuse check.
- `checkRateLimit(ip, "change-password", 5, 60)` still runs **before** body parsing and all three checks — confirmed unchanged at the top of the handler. Rate limiting is not bypassed for any of the new logic.
- No check was dropped; all three (`verifyAdminPassword`, length, `isPasswordReused`) still execute as independent early-returns in sequence. A caller must pass all three to succeed, same as before plus the new rule.
- Reordering doesn't introduce a timing side-channel: `verifyAdminPassword` (scrypt, ~constant-ish work per call regardless of position) now runs first instead of second; relative cost of the length check (`O(1)` string length) is negligible either way, so there's no information leaked through response timing that wasn't already present.

### 5. Bug coverage — confirmed fixed, confirmed no false positive
`isPasswordReused` checks the current credential row first, then history. Submitting the current password as the "new" password now hits `matchesHash(candidatePassword, row.password_hash, row.salt) === true` and is rejected with 400 — this is exactly the reported production bug ("same password accepted as changed"), and it's covered by the test `"rejects submitting the SAME password as the current one (the reported bug)"`. A genuinely new password (never current, never in last 4 history entries) correctly falls through both checks and is accepted — covered by the 5-sequential-change test and the "allows a brand-new one" assertion.

### 6. DRY refactor (`matchesHash`/`matchesEnvPassword`) — confirmed behavior-preserving for the live login path
Diffed the removed lines against the new helpers line-for-line:
- Old `verifyAdminPassword` row branch: `hashPassword` → `timingSafeStringEqual(derived, row.password_hash)`. New: identical logic moved verbatim into `matchesHash`.
- Old env branch: `timingSafeStringEqual(password, envPassword)` guarded by `if (!envPassword) return false`. New: identical logic verbatim in `matchesEnvPassword`.
- `src/app/api/auth/route.ts` (the live login endpoint) calls `verifyAdminPassword`, whose exported signature and behavior are unchanged — it now just delegates to the two new private helpers instead of inlining the logic. No behavior change to the shipped login path.

### Test suite quality — Medium, non-blocking
`admin-password.test.ts` mocks `@/lib/db` entirely, including `addPasswordHistoryEntry`/`getPasswordHistory`, with a **hand-written JS reimplementation** of the trim-to-4 behavior (`storedHistory = [{...}, ...storedHistory].slice(0, 4)`) rather than exercising the real SQL. This means:
- The 91/91 passing suite proves `admin-password.ts`'s logic is correct **against the mock's assumed behavior**, not against the actual SQLite trim query in `db.ts`.
- There is no `db.test.ts` coverage (checked — no match for `password_history` in the existing `db.test.ts`) exercising the real `addPasswordHistoryEntry`/`getPasswordHistory` against a real/in-memory `better-sqlite3` instance.
- I independently verified the real SQL by reading it directly (finding #1) and it is correct, so this is a test-coverage gap, not a known defect. Recommend adding a `db.test.ts` case that calls the real `addPasswordHistoryEntry` 6+ times against a throwaway DB and asserts `getPasswordHistory()` returns exactly the last 4, to stop relying on the mock staying in sync with the real implementation by convention.

### Low: synchronous scrypt amplification
`isPasswordReused` can now trigger up to 5 synchronous `scryptSync` calls per request (1 current-password check in the route + up to 1 current + 4 history in the reuse check = up to 6 total per `change-password` call), each blocking Node's single event loop. This is bounded by the existing 5-requests/60s rate limit per IP and is an amplification of an already-existing synchronous-scrypt pattern, not a new class of risk, given this is a single-admin blog panel. No action required, noting for awareness only.

## Go/No-Go

**GO — ship as-is.** No critical or high-severity defects found. The two non-blocking items (txn-wrapping `changeAdminPassword`, adding real-SQL test coverage for the history trim) are safe to defer to a fast follow; neither affects current correctness, data integrity, or the live login path.

## Severity Summary
- Critical: none
- High: none
- Medium: (1) `changeAdminPassword` not wrapped in a single transaction across archive+write (benign failure mode, recommend fixing); (2) history trim logic has zero direct-SQL test coverage, only a parallel JS-mock reimplementation
- Low: pre-existing length-leak in `timingSafeStringEqual` (not introduced by this diff); scrypt call amplification under the new reuse check (rate-limit bounded)

## Unresolved Questions
None — all six review focus areas were independently verified against source, and claims (91/91 tests, clean tsc, clean lint) were reproduced directly rather than taken on faith.
