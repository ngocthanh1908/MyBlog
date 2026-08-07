import { describe, it, expect, beforeAll } from "vitest";
import { signToken, verifyToken } from "@/lib/auth-utils";

beforeAll(() => {
  process.env.JWT_SECRET = "test-secret-key-for-vitest-min-32-chars";
});

describe("auth-utils", () => {
  it("signs and verifies a valid token", () => {
    const token = signToken();
    const payload = verifyToken(token);
    expect(payload.admin).toBe(true);
  });

  it("throws on invalid token", () => {
    expect(() => verifyToken("invalid.token.here")).toThrow();
  });

  it("throws on tampered token", () => {
    const token = signToken();
    const tampered = token.slice(0, -5) + "xxxxx";
    expect(() => verifyToken(tampered)).toThrow();
  });
});
