import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { signAccessToken, signRefreshToken } from "@/lib/auth-utils";
import { checkRateLimit } from "@/lib/db";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  // SQLite-backed rate limit: 5 attempts per 60 seconds
  if (!checkRateLimit(ip, "auth", 5, 60)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (!body?.password) {
    return NextResponse.json({ error: "Password required" }, { status: 400 });
  }

  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // Timing-safe comparison
  const inputBuf = Buffer.from(body.password);
  const expectedBuf = Buffer.from(adminPassword);
  if (inputBuf.length !== expectedBuf.length || !crypto.timingSafeEqual(inputBuf, expectedBuf)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  const accessToken = signAccessToken();
  const refreshToken = signRefreshToken();

  const response = NextResponse.json({ token: accessToken });
  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}
