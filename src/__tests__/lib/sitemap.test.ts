import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import { getAllPosts, getAllTags } from "@/lib/mdx-utils";
import { siteConfig } from "@/lib/site-config";

describe("sitemap()", () => {
  it("returns a non-empty array", () => {
    const entries = sitemap();
    expect(Array.isArray(entries)).toBe(true);
    expect(entries.length).toBeGreaterThan(0);
  });

  it("includes the static pages", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    expect(urls).toContain(siteConfig.siteUrl);
    expect(urls).toContain(`${siteConfig.siteUrl}/blog`);
    expect(urls).toContain(`${siteConfig.siteUrl}/projects`);
    expect(urls).toContain(`${siteConfig.siteUrl}/about`);
  });

  it("includes one entry per blog post", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    for (const post of getAllPosts()) {
      expect(urls).toContain(`${siteConfig.siteUrl}/blog/${post.slug}`);
    }
  });

  it("includes one entry per tag returned by getAllTags()", () => {
    const entries = sitemap();
    const urls = entries.map((e) => e.url);
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
    for (const tag of tags) {
      expect(urls).toContain(`${siteConfig.siteUrl}/blog?tag=${encodeURIComponent(tag)}`);
    }
  });

  it("tag entries use weekly changeFrequency and priority 0.5", () => {
    const entries = sitemap();
    const tags = getAllTags();
    for (const tag of tags) {
      const entry = entries.find(
        (e) => e.url === `${siteConfig.siteUrl}/blog?tag=${encodeURIComponent(tag)}`
      );
      expect(entry).toBeDefined();
      expect(entry?.changeFrequency).toBe("weekly");
      expect(entry?.priority).toBe(0.5);
    }
  });
});
