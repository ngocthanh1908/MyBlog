import { NextRequest, NextResponse } from "next/server";
import { signAccessToken, signRefreshToken } from "@/lib/auth-utils";
import { checkRateLimit } from "@/lib/db";
import { hasConfiguredAdminPassword, verifyAdminPassword } from "@/lib/admin-password";

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

  if (!hasConfiguredAdminPassword()) {
    return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
  }

  // Checks the admin_credentials DB row if the password was ever changed,
  // otherwise falls back to the ADMIN_PASSWORD env var (timing-safe either way).
  if (!verifyAdminPassword(body.password)) {
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
