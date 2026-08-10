import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { getAllDbTags } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
  } catch (res) {
    if (res instanceof Response) return res;
    throw res;
  }

  return NextResponse.json(getAllDbTags());
}
