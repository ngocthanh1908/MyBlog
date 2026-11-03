import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

let authorised = true;
vi.mock("@/lib/auth-utils", () => ({
  requireAuth: () => {
    if (!authorised) throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  },
}));
vi.mock("@/lib/admin-posts", () => ({
  getAdminPosts: () => [{ slug: "a", title: "A", source: "mdx", hasMdxOriginal: true }],
}));

import { GET } from "@/app/api/admin/posts/route";

beforeEach(() => {
  authorised = true;
});

describe("GET /api/admin/posts", () => {
  it("rejects requests without a valid admin token", async () => {
    authorised = false;
    const res = await GET(new NextRequest("http://localhost/api/admin/posts"));
    expect(res.status).toBe(401);
  });

  it("returns the merged MDX + CMS list for an admin", async () => {
    const res = await GET(new NextRequest("http://localhost/api/admin/posts"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([{ slug: "a", title: "A", source: "mdx", hasMdxOriginal: true }]);
  });
});
