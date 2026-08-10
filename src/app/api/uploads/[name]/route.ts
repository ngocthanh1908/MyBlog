import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

type RouteContext = { params: Promise<{ name: string }> };

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    requireAuth(request);
  } catch (res) {
    if (res instanceof Response) return res;
    throw res;
  }

  const { name } = await context.params;
  if (!name || name.includes("..") || name.includes("/") || name.includes("\\")) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  const filepath = path.join(UPLOAD_DIR, name);
  const resolved = path.resolve(filepath);
  if (!resolved.startsWith(path.resolve(UPLOAD_DIR))) {
    return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
  }

  if (!fs.existsSync(resolved)) {
    return NextResponse.json({ error: "File not found" }, { status: 404 });
  }

  fs.unlinkSync(resolved);
  return NextResponse.json({ ok: true });
}
