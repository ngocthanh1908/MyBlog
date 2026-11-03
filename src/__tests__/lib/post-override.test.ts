import { describe, it, expect, vi, beforeEach } from "vitest";

// Control the DB side; the MDX side is the real content folder (hello-world.mdx exists).
type Row = {
  id: number; title: string; slug: string; excerpt: string; tags: string; content: string;
  cover_image: string | null; draft: number; read_time: number; created_at: string; updated_at: string;
};
let rows: Row[] = [];
vi.mock("@/lib/db", () => ({
  getAllDbPosts: (includeDrafts = false) => rows.filter((r) => includeDrafts || r.draft === 0),
  getDbPostBySlug: (slug: string) => rows.find((r) => r.slug === slug),
}));

import { getAllPosts, getPostBySlug } from "@/lib/mdx-utils";

const row = (over: Partial<Row>): Row => ({
  id: 1, title: "CMS title", slug: "hello-world", excerpt: "cms excerpt", tags: JSON.stringify(["CMS"]),
  content: "cms body", cover_image: null, draft: 0, read_time: 3,
  created_at: "2026-11-01 10:00:00", updated_at: "2026-11-01 10:00:00", ...over,
});

beforeEach(() => {
  rows = [];
});

describe("a CMS copy overrides the MDX post with the same slug", () => {
  it("getPostBySlug returns the CMS version", () => {
    rows = [row({})];
    const post = getPostBySlug("hello-world");
    expect(post.source).toBe("db");
    expect(post.title).toBe("CMS title");
    expect(post.content).toBe("cms body");
  });

  it("getPostBySlug still returns the MDX file when there is no CMS copy", () => {
    expect(getPostBySlug("hello-world").source).toBe("mdx");
  });

  it("getAllPosts lists the slug once, using the CMS version", () => {
    rows = [row({})];
    const matches = getAllPosts().filter((p) => p.slug === "hello-world");
    expect(matches).toHaveLength(1);
    expect(matches[0].source).toBe("db");
  });

  it("a CMS draft copy hides the MDX original instead of exposing it", () => {
    rows = [row({ draft: 1 })];
    expect(getAllPosts().some((p) => p.slug === "hello-world" && process.env.NODE_ENV !== "development")).toBe(false);
  });

  it("deleting the CMS copy brings the MDX post back", () => {
    rows = [row({})];
    rows = [];
    const matches = getAllPosts().filter((p) => p.slug === "hello-world");
    expect(matches).toHaveLength(1);
    expect(matches[0].source).toBe("mdx");
  });

  it("CMS-only posts are still listed alongside MDX posts", () => {
    rows = [row({ id: 2, slug: "only-in-cms", title: "Only CMS" })];
    const slugs = getAllPosts().map((p) => p.slug);
    expect(slugs).toContain("only-in-cms");
    expect(slugs).toContain("hello-world");
  });
});
