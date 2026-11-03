import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import path from "path";
import fs from "fs";

/** Folders the library may list. `uploads` is writable; `covers` holds the built-in illustrations (read-only). */
const FOLDERS = {
  uploads: { dir: path.join(process.cwd(), "public", "uploads"), urlBase: "/uploads" },
  covers: { dir: path.join(process.cwd(), "public", "images", "covers"), urlBase: "/images/covers" },
} as const;

export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
  } catch (res) {
    if (res instanceof Response) return res;
    throw res;
  }

  // Whitelist: any other value falls back to uploads, so the query can never point at another directory
  const requested = request.nextUrl.searchParams.get("folder");
  const { dir, urlBase } = requested === "covers" ? FOLDERS.covers : FOLDERS.uploads;

  if (!fs.existsSync(dir)) {
    return NextResponse.json([]);
  }

  const page = Math.max(1, Number(request.nextUrl.searchParams.get("page")) || 1);
  const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 50));

  const allFiles = fs.readdirSync(dir).filter((f) => !f.startsWith("."));
  const total = allFiles.length;

  const files = allFiles
    .map((name) => {
      const stat = fs.statSync(path.join(dir, name));
      return {
        name,
        url: `${urlBase}/${name}`,
        size: stat.size,
        createdAt: stat.birthtime.toISOString(),
      };
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice((page - 1) * limit, page * limit);

  return NextResponse.json({ files, total, page, limit });
}
