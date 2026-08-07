import { NextRequest, NextResponse } from "next/server";
import { signToken } from "@/lib/auth-utils";

/** Simple in-memory rate limit: IP -> { count, resetAt } */
const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

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

  if (body.password !== adminPassword) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  // Clear rate limit on success
  attempts.delete(ip);

  const token = signToken();
  return NextResponse.json({ token });
}
