import { describe, it, expect } from "vitest";
import { findImageUsage } from "@/lib/image-usage";
import type { AdminPost } from "@/lib/admin-posts";

const post = (over: Partial<AdminPost>): AdminPost => ({
  slug: "s", title: "T", date: "2026-10-01", tags: [], excerpt: "", content: "", draft: false,
  read_time: 1, source: "mdx", hasMdxOriginal: true, ...over,
});

describe("findImageUsage", () => {
  const posts = [
    post({ slug: "a", title: "A", cover_image: "/uploads/1-cat.webp" }),
    post({ slug: "b", title: "B", content: "Intro\n\n![cat](/uploads/1-cat.webp)\n" }),
    post({ slug: "c", title: "C", cover_image: "/uploads/2-dog.webp", content: "no images" }),
    post({ slug: "d", title: "D", cover_image: "/uploads/1-cat.webp", content: "![x](/uploads/1-cat.webp)" }),
  ];

  it("finds posts using the image as cover or inside the body", () => {
    expect(findImageUsage(posts, "/uploads/1-cat.webp").map((p) => p.slug)).toEqual(["a", "b", "d"]);
  });

  it("counts a post once even if it uses the image twice", () => {
    expect(findImageUsage(posts, "/uploads/1-cat.webp").filter((p) => p.slug === "d")).toHaveLength(1);
  });

  it("returns nothing for an unused image", () => {
    expect(findImageUsage(posts, "/uploads/unused.webp")).toEqual([]);
  });

  it("does not match a different file whose name merely starts with the same text", () => {
    expect(findImageUsage([post({ cover_image: "/uploads/1-cat.webp.bak" })], "/uploads/1-cat.webp")).toEqual([]);
    expect(findImageUsage([post({ content: "![](/uploads/1-cat.webp2)" })], "/uploads/1-cat.webp")).toEqual([]);
  });
});
