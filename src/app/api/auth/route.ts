import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { signToken } from "@/lib/auth-utils";

/** Simple in-memory rate limit with max 1000 entries to prevent OOM */
const attempts = new Map<string, { count: number; resetAt: number }>();
const MAX_RATE_ENTRIES = 1000;

function cleanupExpired() {
  const now = Date.now();
  for (const [ip, record] of attempts) {
    if (now >= record.resetAt) attempts.delete(ip);
  }
}

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  // Cleanup expired entries if map grows too large
  if (attempts.size > MAX_RATE_ENTRIES) cleanupExpired();

  // Rate limit: 5 attempts per minute
  const now = Date.now();
  const record = attempts.get(ip);
  if (record && now < record.resetAt) {
    if (record.count >= 5) {
      return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
    }
    record.count++;
  } else {
    attempts.set(ip, { count: 1, resetAt: now + 60_000 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // Timing-safe comparison to prevent timing attacks
  const inputBuf = Buffer.from(body.password);
  const expectedBuf = Buffer.from(adminPassword);
  if (inputBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(inputBuf, expectedBuf)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Clear rate limit on success
  attempts.delete(ip);

  const token = signToken();
  return NextResponse.json({ token });
}
