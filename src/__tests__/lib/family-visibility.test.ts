import { describe, it, expect } from "vitest";
import { getAllPosts, getAllTags, getPublicPosts, getRelatedPosts } from "@/lib/mdx-utils";
import { FAMILY_TAG, isFamilyPost } from "@/lib/family-posts";

// Uses the real content: src/content/blog holds posts tagged with the family tag.
describe("family posts stay out of public listings", () => {
  const family = getAllPosts().filter(isFamilyPost);

  it("has family posts to test against", () => {
    expect(family.length).toBeGreaterThan(0);
  });

  it("getPublicPosts leaves them out but getAllPosts keeps them", () => {
    const publicSlugs = new Set(getPublicPosts().map((p) => p.slug));
    for (const post of family) expect(publicSlugs.has(post.slug)).toBe(false);
    expect(getPublicPosts().length).toBe(getAllPosts().length - family.length);
  });

  it("getAllTags does not expose the family tag or its person tags", () => {
    const tags = getAllTags();
    expect(tags).not.toContain(FAMILY_TAG);
    expect(tags).not.toContain("Mẹ");
  });

  it("a public post's related list never contains a family post", () => {
    const publicPost = getPublicPosts()[0];
    for (const related of getRelatedPosts(publicPost.slug, 50)) {
      expect(isFamilyPost(related)).toBe(false);
    }
  });

  it("a family post's related list contains only family posts", () => {
    const related = getRelatedPosts(family[0].slug, 50);
    expect(related.length).toBeGreaterThan(0);
    for (const post of related) expect(isFamilyPost(post)).toBe(true);
  });
});
