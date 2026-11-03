import { describe, it, expect, vi, beforeEach } from "vitest";

type Row = {
  id: number; title: string; slug: string; excerpt: string; tags: string; content: string;
  cover_image: string | null; draft: number; read_time: number; created_at: string; updated_at: string;
};
let rows: Row[] = [];
vi.mock("@/lib/db", () => ({
  getAllDbPosts: (includeDrafts = false) => rows.filter((r) => includeDrafts || r.draft === 0),
  getDbPostBySlug: (slug: string) => rows.find((r) => r.slug === slug),
}));

import { getAdminPosts } from "@/lib/admin-posts";

const row = (over: Partial<Row>): Row => ({
  id: 7, title: "CMS title", slug: "hello-world", excerpt: "cms excerpt", tags: JSON.stringify(["CMS", "AI"]),
  content: "cms body", cover_image: "/uploads/a.webp", draft: 1, read_time: 4,
  created_at: "2026-11-01 10:00:00", updated_at: "2026-11-01 10:00:00", ...over,
});

beforeEach(() => {
  rows = [];
});

describe("getAdminPosts", () => {
  it("lists MDX posts with their content so the editor can be prefilled", () => {
    const post = getAdminPosts().find((p) => p.slug === "hello-world")!;
    expect(post.source).toBe("mdx");
    expect(post.id).toBeUndefined();
    expect(post.hasMdxOriginal).toBe(true);
    expect(post.content.length).toBeGreaterThan(0);
    expect(post.tags).toEqual(["AI"]);
    expect(post.read_time).toBeGreaterThanOrEqual(1);
  });

  it("marks a CMS copy of an MDX slug as an override of the original", () => {
    rows = [row({})];
    const matches = getAdminPosts().filter((p) => p.slug === "hello-world");
    expect(matches).toHaveLength(1);
    expect(matches[0]).toMatchObject({ source: "cms", id: 7, hasMdxOriginal: true, draft: true, title: "CMS title" });
    expect(matches[0].tags).toEqual(["CMS", "AI"]);
  });

  it("lists CMS-only posts (drafts included) without an MDX original", () => {
    rows = [row({ id: 9, slug: "only-in-cms" })];
    const post = getAdminPosts().find((p) => p.slug === "only-in-cms")!;
    expect(post).toMatchObject({ source: "cms", id: 9, hasMdxOriginal: false });
  });

  it("includes every MDX file, drafts too, newest first", () => {
    const posts = getAdminPosts();
    expect(posts.filter((p) => p.source === "mdx").length).toBeGreaterThanOrEqual(22);
    for (let i = 1; i < posts.length; i++) {
      expect(new Date(posts[i - 1].date).getTime()).toBeGreaterThanOrEqual(new Date(posts[i].date).getTime());
    }
  });
});
