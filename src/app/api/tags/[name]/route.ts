import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { renameDbTag, deleteDbTag } from "@/lib/db";

type RouteContext = { params: Promise<{ name: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  try {
    requireAuth(request);
  } catch (res) {
    if (res instanceof Response) return res;
    throw res;
  }

  const { name } = await context.params;
  const oldName = decodeURIComponent(name);

  const body = await request.json().catch(() => null);
  if (!body?.newName?.trim()) {
    return NextResponse.json({ error: "newName is required" }, { status: 400 });
  }

  const changed = renameDbTag(oldName, body.newName.trim());
  return NextResponse.json({ changed });
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  try {
    requireAuth(request);
  } catch (res) {
    if (res instanceof Response) return res;
    throw res;
  }

  const { name } = await context.params;
  const tagName = decodeURIComponent(name);
  const changed = deleteDbTag(tagName);
  return NextResponse.json({ changed });
}
