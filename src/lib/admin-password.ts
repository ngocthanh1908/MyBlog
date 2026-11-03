import crypto from "crypto";
import { getAdminCredentials, setAdminCredentials } from "@/lib/db";

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
    const derived = hashPassword(password, row.salt);
    return timingSafeStringEqual(derived, row.password_hash);
  }

  const envPassword = process.env.ADMIN_PASSWORD;
  if (!envPassword) return false;
  return timingSafeStringEqual(password, envPassword);
}

/** Hash and persist a new admin password, replacing the single DB row. */
export function changeAdminPassword(newPassword: string): void {
  const salt = crypto.randomBytes(SALT_BYTES).toString("hex");
  const passwordHash = hashPassword(newPassword, salt);
  setAdminCredentials(passwordHash, salt);
}
