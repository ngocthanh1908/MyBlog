import { describe, it, expect, beforeEach, vi } from "vitest";

// In-memory stand-in for the admin_credentials table, so these tests never
// touch the real data/blog.sqlite file on disk.
let storedRow: { password_hash: string; salt: string; token_version: number } | undefined;

vi.mock("@/lib/db", () => ({
  getAdminCredentials: () => storedRow,
  // Mirrors the real db.ts upsert: first change starts token_version at 2 (past
  // the no-row default of 1), later changes increment the existing value by 1.
  setAdminCredentials: (passwordHash: string, salt: string) => {
    storedRow = {
      password_hash: passwordHash,
      salt,
      token_version: storedRow ? storedRow.token_version + 1 : 2,
    };
  },
}));

const ORIGINAL_ENV_PASSWORD = "super-secret-env-password";

describe("admin-password", () => {
  beforeEach(() => {
    vi.resetModules();
    storedRow = undefined;
    process.env.ADMIN_PASSWORD = ORIGINAL_ENV_PASSWORD;
  });

  it("falls back to ADMIN_PASSWORD env var when no DB row exists (no regression)", async () => {
    const { verifyAdminPassword, hasConfiguredAdminPassword } = await import("@/lib/admin-password");

    expect(hasConfiguredAdminPassword()).toBe(true);
    expect(verifyAdminPassword(ORIGINAL_ENV_PASSWORD)).toBe(true);
    expect(verifyAdminPassword("wrong-password")).toBe(false);
  });

  it("reports unconfigured when neither a DB row nor env var exists", async () => {
    delete process.env.ADMIN_PASSWORD;
    const { hasConfiguredAdminPassword } = await import("@/lib/admin-password");

    expect(hasConfiguredAdminPassword()).toBe(false);
  });

  it("does not throw when the candidate password has a different length than the env var", async () => {
    const { verifyAdminPassword } = await import("@/lib/admin-password");

    expect(() => verifyAdminPassword("short")).not.toThrow();
    expect(verifyAdminPassword("short")).toBe(false);
  });

  it("persists a scrypt hash + salt (not plaintext) when changing the password", async () => {
    const { changeAdminPassword } = await import("@/lib/admin-password");

    changeAdminPassword("new-password-123");

    expect(storedRow).toBeDefined();
    expect(storedRow!.password_hash).not.toBe("new-password-123");
    expect(storedRow!.salt).toHaveLength(32); // 16 random bytes, hex-encoded
    expect(storedRow!.password_hash).toHaveLength(128); // 64-byte scrypt key, hex-encoded
  });

  it("verifies against the DB row once a password has been changed, ignoring the env var", async () => {
    const { verifyAdminPassword, changeAdminPassword } = await import("@/lib/admin-password");

    changeAdminPassword("new-password-123");

    expect(verifyAdminPassword("new-password-123")).toBe(true);
    expect(verifyAdminPassword(ORIGINAL_ENV_PASSWORD)).toBe(false);
  });

  it("end-to-end: after changing the password, the OLD password fails and the NEW one succeeds", async () => {
    const { verifyAdminPassword, changeAdminPassword } = await import("@/lib/admin-password");

    // Before any change: old (env) password works.
    expect(verifyAdminPassword(ORIGINAL_ENV_PASSWORD)).toBe(true);

    changeAdminPassword("brand-new-password-456");

    expect(verifyAdminPassword(ORIGINAL_ENV_PASSWORD)).toBe(false);
    expect(verifyAdminPassword("brand-new-password-456")).toBe(true);
  });

  it("getCurrentTokenVersion defaults to 1 in env-only mode (no DB row, password never changed)", async () => {
    const { getCurrentTokenVersion } = await import("@/lib/admin-password");

    expect(getCurrentTokenVersion()).toBe(1);
  });

  it("getCurrentTokenVersion advances past the default on the first password change, then increments on each subsequent change", async () => {
    const { changeAdminPassword, getCurrentTokenVersion } = await import("@/lib/admin-password");

    expect(getCurrentTokenVersion()).toBe(1);

    changeAdminPassword("first-change");
    expect(getCurrentTokenVersion()).toBe(2);

    changeAdminPassword("second-change");
    expect(getCurrentTokenVersion()).toBe(3);
  });
});
