import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth-utils";
import { getAdminPosts } from "@/lib/admin-posts";

/**
 * Admin post list: MDX files and CMS (database) posts merged, drafts included, with bodies so the
 * editor can be prefilled. A CMS post replaces the MDX entry with the same slug.
 */
export async function GET(request: NextRequest) {
  try {
    requireAuth(request);
  } catch (res) {
    if (res instanceof Response) return res;
    throw res;
  }
  return NextResponse.json(getAdminPosts());
}
