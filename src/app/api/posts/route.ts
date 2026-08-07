import { NextRequest, NextResponse } from "next/server";
import { getAuthFromRequest, requireAuth } from "@/lib/auth-utils";
import { getAllDbPosts, createDbPost, getDbPostBySlug } from "@/lib/db";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function GET(request: NextRequest) {
  const drafts = request.nextUrl.searchParams.get("drafts") === "true";

  if (drafts) {
    const auth = getAuthFromRequest(request);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  const posts = getAllDbPosts(drafts);
  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  try {
    requireAuth(request);
  } catch (res) {
    if (res instanceof Response) return res;
    throw res;
  }

  const body = await request.json().catch(() => null);
  if (!body?.title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const slug = body.slug ? slugify(body.slug) : slugify(body.title);
  if (!slug) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  // Check duplicate slug
  if (getDbPostBySlug(slug)) {
    return NextResponse.json({ error: "Slug already exists" }, { status: 409 });
  }

  const post = createDbPost({
    title: body.title,
    slug,
    excerpt: body.excerpt ?? "",
    tags: Array.isArray(body.tags) ? body.tags : [],
    content: body.content ?? "",
    cover_image: body.cover_image,
    draft: body.draft ?? false,
    read_time: body.read_time ?? 1,
  });

  return NextResponse.json(post, { status: 201 });
}
