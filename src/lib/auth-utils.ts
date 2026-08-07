import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

function getSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET environment variable is required");
  return secret;
}

export function signToken(): string {
  return jwt.sign({ admin: true }, getSecret(), { expiresIn: "7d" });
}

export function verifyToken(token: string): { admin: boolean } {
  return jwt.verify(token, getSecret()) as { admin: boolean };
}

/** Extract Bearer token from request, verify it. Returns null if invalid. */
export function getAuthFromRequest(request: NextRequest): { admin: boolean } | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;

  try {
    return verifyToken(header.slice(7));
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
