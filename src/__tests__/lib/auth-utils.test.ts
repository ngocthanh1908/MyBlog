import { describe, it, expect, beforeAll, beforeEach, vi } from "vitest";
import { NextRequest } from "next/server";

// In-memory stand-in for the admin_credentials table, so these tests never
// touch the real data/blog.sqlite file on disk. Mirrors db.ts's atomic upsert:
// first password change starts token_version at 2, later changes increment by 1.
let storedRow: { password_hash: string; salt: string; token_version: number } | undefined;

vi.mock("@/lib/db", () => ({
  getAdminCredentials: () => storedRow,
  setAdminCredentials: (passwordHash: string, salt: string) => {
    storedRow = {
      password_hash: passwordHash,
      salt,
      token_version: storedRow ? storedRow.token_version + 1 : 2,
    };
  },
}));

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-key-for-vitest-min-32-chars";
});

beforeEach(() => {
  vi.resetModules();
  storedRow = undefined;
  process.env.ADMIN_PASSWORD = "super-secret-env-password";
});

describe("auth-utils", () => {
  it("signs and verifies a valid token", async () => {
    const { signToken, verifyToken } = await import("@/lib/auth-utils");
    const token = signToken();
    const payload = verifyToken(token);
    expect(payload.admin).toBe(true);
  });

  it("throws on invalid token", async () => {
    const { verifyToken } = await import("@/lib/auth-utils");
    expect(() => verifyToken("invalid.token.here")).toThrow();
  });

  it("throws on tampered token", async () => {
    const { signToken, verifyToken } = await import("@/lib/auth-utils");
    const token = signToken();
    const tampered = token.slice(0, -5) + "xxxxx";
    expect(() => verifyToken(tampered)).toThrow();
  });

  it("env-only mode (no DB row, password never changed): tokens stay valid, no spurious invalidation", async () => {
    const { signAccessToken, signRefreshToken, verifyToken } = await import("@/lib/auth-utils");

    const access = signAccessToken();
    const refresh = signRefreshToken();

    expect(verifyToken(access, "access").admin).toBe(true);
    expect(verifyToken(refresh, "refresh").admin).toBe(true);
  });

  it("changing the password invalidates a previously-issued access token, but a freshly re-issued one works", async () => {
    const { signAccessToken, verifyToken } = await import("@/lib/auth-utils");
    const { changeAdminPassword } = await import("@/lib/admin-password");

    // Login -> valid access token.
    const oldAccessToken = signAccessToken();
    expect(verifyToken(oldAccessToken, "access").admin).toBe(true);

    // Change password -> old token must now be rejected.
    changeAdminPassword("brand-new-password-456");
    expect(() => verifyToken(oldAccessToken, "access")).toThrow();

    // Re-login (fresh token) must work.
    const newAccessToken = signAccessToken();
    expect(verifyToken(newAccessToken, "access").admin).toBe(true);
  });

  it("changing the password invalidates a previously-issued refresh token", async () => {
    const { signRefreshToken, verifyToken } = await import("@/lib/auth-utils");
    const { changeAdminPassword } = await import("@/lib/admin-password");

    const oldRefreshToken = signRefreshToken();
    expect(verifyToken(oldRefreshToken, "refresh").admin).toBe(true);

    changeAdminPassword("brand-new-password-456");
    expect(() => verifyToken(oldRefreshToken, "refresh")).toThrow();

    const newRefreshToken = signRefreshToken();
    expect(verifyToken(newRefreshToken, "refresh").admin).toBe(true);
  });

  it("requireAuth rejects a request bearing a pre-password-change access token", async () => {
    const { signAccessToken, requireAuth } = await import("@/lib/auth-utils");
    const { changeAdminPassword } = await import("@/lib/admin-password");

    const oldAccessToken = signAccessToken();
    const requestWithOldToken = new NextRequest("http://localhost/api/posts", {
      headers: { authorization: `Bearer ${oldAccessToken}` },
    });
    expect(() => requireAuth(requestWithOldToken)).not.toThrow(); // valid before change

    changeAdminPassword("brand-new-password-456");

    expect(() => requireAuth(requestWithOldToken)).toThrow();

    const newAccessToken = signAccessToken();
    const requestWithNewToken = new NextRequest("http://localhost/api/posts", {
      headers: { authorization: `Bearer ${newAccessToken}` },
    });
    expect(() => requireAuth(requestWithNewToken)).not.toThrow();
  });
});
