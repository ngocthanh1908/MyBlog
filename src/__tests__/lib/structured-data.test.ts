import { describe, it, expect } from "vitest";
import { personJsonLd, blogPostJsonLd } from "@/lib/structured-data";

describe("personJsonLd()", () => {
  it("returns an object with @context and @type Person", () => {
    const ld = personJsonLd();
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("Person");
  });

  it("has a non-empty name and url", () => {
    const ld = personJsonLd();
    expect(typeof ld.name).toBe("string");
    expect(ld.name.length).toBeGreaterThan(0);
    expect(typeof ld.url).toBe("string");
    expect(ld.url.length).toBeGreaterThan(0);
  });
});

describe("blogPostJsonLd()", () => {
  const samplePost = {
    title: "Test Post",
    date: "2026-01-01",
    excerpt: "A short excerpt.",
    slug: "test-post",
  };

  it("returns an object with @type BlogPosting", () => {
    const ld = blogPostJsonLd(samplePost);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("BlogPosting");
  });

  it("headline matches the post title", () => {
    const ld = blogPostJsonLd(samplePost);
    expect(ld.headline).toBe(samplePost.title);
  });

  it("datePublished matches the post date", () => {
    const ld = blogPostJsonLd(samplePost);
    expect(ld.datePublished).toBe(samplePost.date);
  });

  it("url contains the slug", () => {
    const ld = blogPostJsonLd(samplePost);
    expect(ld.url).toContain(samplePost.slug);
  });
});
