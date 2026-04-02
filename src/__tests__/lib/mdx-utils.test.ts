import { describe, it, expect } from "vitest";
import { getAllPosts, getPostBySlug, getAllTags } from "@/lib/mdx-utils";

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
