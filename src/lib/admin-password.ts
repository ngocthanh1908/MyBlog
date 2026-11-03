import crypto from "crypto";
import {
  getAdminCredentials,
  setAdminCredentials,
  addPasswordHistoryEntry,
  getPasswordHistory,
} from "@/lib/db";

const SCRYPT_KEY_LENGTH = 64;
const SALT_BYTES = 16;

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, SCRYPT_KEY_LENGTH).toString("hex");
}

/** Timing-safe comparison of two equal-purpose strings (hashes or plaintext). */
function timingSafeStringEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return crypto.timingSafeEqual(aBuf, bBuf);
}

/** True if `candidatePassword` matches a given hash+salt pair. */
function matchesHash(candidatePassword: string, passwordHash: string, salt: string): boolean {
  const derived = hashPassword(candidatePassword, salt);
  return timingSafeStringEqual(derived, passwordHash);
}

/**
 * True if `candidatePassword` matches the `ADMIN_PASSWORD` env var (original,
 * backward-compatible fallback used whenever no DB row exists yet).
 */
function matchesEnvPassword(candidatePassword: string): boolean {
  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword) return false;
  return timingSafeStringEqual(candidatePassword, envPassword);
}

/**
 * True once an admin password is available to check against, either because
 * it was changed (DB row exists) or the env var fallback is configured.
 */
export function hasConfiguredAdminPassword(): boolean {
  return !!getAdminCredentials() || !!process.env.ADMIN_PASSWORD;
}

/**
 * Current token-invalidation epoch. Defaults to 1 when the password has never
 * been changed (no DB row — env-only mode), so env-issued tokens are never
 * spuriously invalidated. changeAdminPassword bumps this every time it runs;
 * verifyToken rejects any token whose embedded version doesn't match.
 */
export function getCurrentTokenVersion(): number {
  return getAdminCredentials()?.token_version ?? 1;
}

/**
 * Verify a candidate password against whichever source is currently active:
 * the `admin_credentials` DB row if the password was ever changed, otherwise
 * the `ADMIN_PASSWORD` env var (original, backward-compatible behavior).
 */
export function verifyAdminPassword(password: string): boolean {
  const row = getAdminCredentials();
  if (row) {
    return matchesHash(password, row.password_hash, row.salt);
  }
  return matchesEnvPassword(password);
}

/**
 * True if `candidatePassword` matches the current password or any of the up
 * to 4 previous passwords archived in history (last-5 reuse policy). In
 * env-only mode (password never changed) there is no history yet, so this
 * only checks against the current `ADMIN_PASSWORD` env value.
 */
export function isPasswordReused(candidatePassword: string): boolean {
  const row = getAdminCredentials();
  if (!row) {
    return matchesEnvPassword(candidatePassword);
  }

  if (matchesHash(candidatePassword, row.password_hash, row.salt)) {
    return true;
  }

  return getPasswordHistory().some((entry) =>
    matchesHash(candidatePassword, entry.password_hash, entry.salt),
  );
}

/**
 * Hash and persist a new admin password. Archives the outgoing password into
 * history first (if one exists) so the last-5 reuse policy can see it, then
 * replaces the single DB row as before.
 */
export function changeAdminPassword(newPassword: string): void {
  const currentRow = getAdminCredentials();
  if (currentRow) {
    addPasswordHistoryEntry(currentRow.password_hash, currentRow.salt);
  }

  const salt = crypto.randomBytes(SALT_BYTES).toString("hex");
  const passwordHash = hashPassword(newPassword, salt);
  setAdminCredentials(passwordHash, salt);
}
