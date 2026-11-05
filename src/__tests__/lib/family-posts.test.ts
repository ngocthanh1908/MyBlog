import { describe, it, expect } from "vitest";
import { FAMILY_TAG, getFamilyPosts, getPostRobots, isFamilyPost } from "@/lib/family-posts";
import type { BlogPost } from "@/lib/mdx-utils";

const post = (slug: string, tags: string[]): BlogPost => ({
  slug, title: slug, date: "2026-01-01", tags, excerpt: "e", draft: false,
});

describe("getFamilyPosts", () => {
  it("keeps only posts tagged with the family tag, in the given order", () => {
    const posts = [post("a", ["AI"]), post("b", [FAMILY_TAG]), post("c", ["SAP", FAMILY_TAG])];
    expect(getFamilyPosts(posts).map((p) => p.slug)).toEqual(["b", "c"]);
  });

  it("ignores case and surrounding spaces in the tag", () => {
    expect(getFamilyPosts([post("a", ["  người thân "])]).map((p) => p.slug)).toEqual(["a"]);
  });

  it("returns an empty list when nothing matches", () => {
    expect(getFamilyPosts([post("a", ["AI"]), post("b", [])])).toEqual([]);
  });
});

describe("isFamilyPost", () => {
  it("is true only for posts with the family tag", () => {
    expect(isFamilyPost(post("a", [FAMILY_TAG, "Mẹ"]))).toBe(true);
    expect(isFamilyPost(post("b", ["Mẹ"]))).toBe(false);
  });
});

describe("getPostRobots", () => {
  it("returns noindex/nofollow for family posts", () => {
    expect(getPostRobots(post("a", [FAMILY_TAG]))).toMatchObject({ index: false, follow: false });
  });

  it("returns nothing for other posts so the site default applies", () => {
    expect(getPostRobots(post("b", ["AI"]))).toBeUndefined();
  });
});
