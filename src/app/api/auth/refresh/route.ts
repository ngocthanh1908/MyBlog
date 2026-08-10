import { NextRequest, NextResponse } from "next/server";
import { verifyToken, signAccessToken, signRefreshToken } from "@/lib/auth-utils";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("refresh_token")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const payload = verifyToken(refreshToken, "refresh");
    if (!payload.admin) throw new Error("Invalid token");
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  // Rotate: new access + new refresh token
  const accessToken = signAccessToken();
  const newRefreshToken = signRefreshToken();

  const response = NextResponse.json({ token: accessToken });
  response.cookies.set("refresh_token", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/api/auth/refresh",
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
}
