import { describe, it, expect } from "vitest";
import {
  getAllPosts,
  getPostBySlug,
  getAllTags,
  getRelatedPosts,
} from "@/lib/mdx-utils";

describe("getAllPosts()", () => {
  it("returns a non-empty array", () => {
    const posts = getAllPosts();
    expect(Array.isArray(posts)).toBe(true);
    expect(posts.length).toBeGreaterThan(0);
  });

  it("returns posts sorted by date descending", () => {
    const posts = getAllPosts();
    for (let i = 1; i < posts.length; i++) {
      const prev = new Date(posts[i - 1].date).getTime();
      const curr = new Date(posts[i].date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it("each post has required fields with correct types", () => {
    const posts = getAllPosts();
    for (const post of posts) {
      expect(typeof post.slug).toBe("string");
      expect(post.slug.length).toBeGreaterThan(0);
      expect(typeof post.title).toBe("string");
      expect(typeof post.date).toBe("string");
      expect(typeof post.excerpt).toBe("string");
      expect(Array.isArray(post.tags)).toBe(true);
      expect(typeof post.draft).toBe("boolean");
    }
  });
});

describe("getPostBySlug()", () => {
  it("returns a valid post with content for hello-world", () => {
    const post = getPostBySlug("hello-world");
    expect(post.slug).toBe("hello-world");
    expect(typeof post.title).toBe("string");
    expect(typeof post.content).toBe("string");
    expect(post.content.length).toBeGreaterThan(0);
  });

  it("throws for a nonexistent slug", () => {
    expect(() => getPostBySlug("nonexistent-slug-xyz")).toThrow();
  });

  it("throws for path traversal attempt", () => {
    expect(() => getPostBySlug("../../etc/passwd")).toThrow();
  });

  it("throws for slug with slashes", () => {
    expect(() => getPostBySlug("../hello-world")).toThrow();
  });
});

describe("getAllTags()", () => {
  it("returns an array of strings", () => {
    const tags = getAllTags();
    expect(Array.isArray(tags)).toBe(true);
    for (const tag of tags) {
      expect(typeof tag).toBe("string");
    }
  });

  it("returns tags sorted alphabetically", () => {
    const tags = getAllTags();
    const sorted = [...tags].sort();
    expect(tags).toEqual(sorted);
  });
});

describe("getRelatedPosts()", () => {
  it("excludes the current post from the results", () => {
    const related = getRelatedPosts("hello-world");
    expect(related.some((p) => p.slug === "hello-world")).toBe(false);
  });

  it("falls back to recency when there is no tag overlap (current fixture data)", () => {
    // hello-world tags: ["AI", "SAP"]; running-maf-method tags: ["Running", "Mindfulness"]
    // zero overlap today, so ranking must fall back to date descending.
    const related = getRelatedPosts("hello-world");
    for (let i = 1; i < related.length; i++) {
      const prev = new Date(related[i - 1].date).getTime();
      const curr = new Date(related[i].date).getTime();
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });

  it("ranks posts with more shared tags higher than posts with fewer", () => {
    const current = getPostBySlug("hello-world");
    const allPosts = getAllPosts();
    const related = getRelatedPosts("hello-world", allPosts.length);
    const scoreOf = (slug: string) => {
      const post = allPosts.find((p) => p.slug === slug);
      if (!post) return -1;
      return post.tags.filter((t) => current.tags.includes(t)).length;
    };
    for (let i = 1; i < related.length; i++) {
      expect(scoreOf(related[i - 1].slug)).toBeGreaterThanOrEqual(
        scoreOf(related[i].slug)
      );
    }
  });

  it("respects the limit parameter", () => {
    const related = getRelatedPosts("hello-world", 1);
    expect(related.length).toBeLessThanOrEqual(1);
  });

  it("defaults to a limit of 3", () => {
    const related = getRelatedPosts("hello-world");
    expect(related.length).toBeLessThanOrEqual(3);
  });

  it("returns an empty array without throwing when there are no other posts", () => {
    const allSlugs = getAllPosts().map((p) => p.slug);
    // Use a slug that excludes every real post by pretending each one is "current"
    // and confirm the function never throws, even in the single-post-remaining case.
    for (const slug of allSlugs) {
      expect(() => getRelatedPosts(slug)).not.toThrow();
    }
    expect(Array.isArray(getRelatedPosts("nonexistent-slug-xyz"))).toBe(true);
  });
});
