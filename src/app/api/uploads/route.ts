import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import path from "path";
import fs from "fs";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
  } catch (res) {
    if (res instanceof Response) return res;
    throw res;
  }

  if (!fs.existsSync(UPLOAD_DIR)) {
    return NextResponse.json([]);
  }

  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 50));

  const allFiles = fs.readdirSync(UPLOAD_DIR).filter((f) => !f.startsWith("."));
  const total = allFiles.length;

  const files = allFiles
    .map((name) => {
      const stat = fs.statSync(path.join(UPLOAD_DIR, name));
      return {
        name,
        url: `/uploads/${name}`,
        size: stat.size,
        createdAt: stat.birthtime.toISOString(),
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice((page - 1) * limit, page * limit);

  return NextResponse.json({ files, total, page, limit });
}
