import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { getCurrentTokenVersion } from "@/lib/admin-password";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is required");
  return secret;
}

export function signAccessToken(): string {
  return jwt.sign({ admin: true, type: "access", v: getCurrentTokenVersion() }, getSecret(), { expiresIn: "15m" });
}

export function signRefreshToken(): string {
  return jwt.sign({ admin: true, type: "refresh", v: getCurrentTokenVersion() }, getSecret(), { expiresIn: "7d" });
}

/** @deprecated Use signAccessToken instead */
export function signToken(): string {
  return signAccessToken();
}

export function verifyToken(
  token: string,
  expectedType?: "access" | "refresh",
): { admin: boolean; type: string; v: number } {
  const payload = jwt.verify(token, getSecret()) as { admin: boolean; type: string; v: number };
  if (expectedType && payload.type !== expectedType) {
    throw new Error(`Expected ${expectedType} token, got ${payload.type}`);
  }
  // Reject tokens issued before the most recent password change: changeAdminPassword
  // bumps the token version, so a stale version claim means this session is revoked.
  if (payload.v !== getCurrentTokenVersion()) {
    throw new Error("Token invalidated by password change");
  }
  return payload;
}

/** Extract Bearer token from request, verify it. Returns null if invalid. */
export function getAuthFromRequest(request: NextRequest): { admin: boolean } | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;

  try {
    return verifyToken(header.slice(7), "access");
  } catch {
    return null;
  }
}

/** Guard: throws Response if not authenticated */
export function requireAuth(request: NextRequest): void {
  const auth = getAuthFromRequest(request);
  if (!auth) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
}
