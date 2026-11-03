import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { checkRateLimit } from "@/lib/db";
import { verifyAdminPassword, changeAdminPassword, isPasswordReused } from "@/lib/admin-password";

const MIN_NEW_PASSWORD_LENGTH = 8;

export async function POST(request: NextRequest) {
  try {
    requireAuth(request);
  } catch (res) {
    if (res instanceof Response) return res;
    throw res;
  }

  const ip = request.headers.get("x-forwarded-for") ?? "unknown";

  // SQLite-backed rate limit: 5 attempts per 60 seconds
  if (!checkRateLimit(ip, "change-password", 5, 60)) {
    return NextResponse.json({ error: "Too many attempts" }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  if (typeof body?.currentPassword !== "string" || typeof body?.newPassword !== "string") {
    return NextResponse.json(
      { error: "currentPassword and newPassword are required" },
      { status: 400 },
    );
  }

  // Mismatch between new/confirm password is only checked client-side: the
  // server only ever receives a single newPassword value, and re-deriving a
  // confirmation server-side would add no real protection.
  if (!verifyAdminPassword(body.currentPassword)) {
    return NextResponse.json({ error: "Current password is incorrect" }, { status: 401 });
  }

  if (body.newPassword.length < MIN_NEW_PASSWORD_LENGTH) {
    return NextResponse.json(
      { error: `New password must be at least ${MIN_NEW_PASSWORD_LENGTH} characters` },
      { status: 400 },
    );
  }

  if (isPasswordReused(body.newPassword)) {
    return NextResponse.json(
      { error: "New password must not match any of your last 5 passwords" },
      { status: 400 },
    );
  }

  changeAdminPassword(body.newPassword);

  return NextResponse.json({ success: true });
}
