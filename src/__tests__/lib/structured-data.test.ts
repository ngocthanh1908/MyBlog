import { describe, it, expect } from "vitest";
import {
  personJsonLd,
  blogPostJsonLd,
  websiteJsonLd,
  breadcrumbJsonLd,
} from "@/lib/structured-data";

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

describe("websiteJsonLd()", () => {
  it("returns an object with @context and @type WebSite", () => {
    const ld = websiteJsonLd();
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("WebSite");
  });

  it("has a non-empty name and url and Vietnamese inLanguage", () => {
    const ld = websiteJsonLd();
    expect(typeof ld.name).toBe("string");
    expect(ld.name.length).toBeGreaterThan(0);
    expect(typeof ld.url).toBe("string");
    expect(ld.url.length).toBeGreaterThan(0);
    expect(ld.inLanguage).toBe("vi-VN");
  });

  it("does not include a potentialAction/SearchAction", () => {
    const ld = websiteJsonLd();
    expect(ld).not.toHaveProperty("potentialAction");
  });
});

describe("breadcrumbJsonLd()", () => {
  const samplePost = { title: "Test Post", slug: "test-post" };

  it("returns an object with @type BreadcrumbList with 3 items", () => {
    const ld = breadcrumbJsonLd(samplePost);
    expect(ld["@context"]).toBe("https://schema.org");
    expect(ld["@type"]).toBe("BreadcrumbList");
    expect(ld.itemListElement).toHaveLength(3);
  });

  it("orders items Home -> Blog -> post", () => {
    const ld = breadcrumbJsonLd(samplePost);
    expect(ld.itemListElement[0].name).toBe("Home");
    expect(ld.itemListElement[1].name).toBe("Blog");
    expect(ld.itemListElement[1].item).toContain("/blog");
    expect(ld.itemListElement[2].name).toBe(samplePost.title);
    expect(ld.itemListElement[2].item).toContain(samplePost.slug);
  });
});

describe("blogPostJsonLd()", () => {
  const samplePost = {
    title: "Test Post",
    date: "2026-01-01",
    excerpt: "A short excerpt.",
    slug: "test-post",
    tags: ["ai", "sap"],
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

  it("dateModified falls back to the post date", () => {
    const ld = blogPostJsonLd(samplePost);
    expect(ld.dateModified).toBe(samplePost.date);
  });

  it("url contains the slug", () => {
    const ld = blogPostJsonLd(samplePost);
    expect(ld.url).toContain(samplePost.slug);
  });

  it("image uses the real /og route with title and description", () => {
    const ld = blogPostJsonLd(samplePost);
    expect(ld.image).toContain("/og?title=");
    expect(ld.image).toContain(encodeURIComponent(samplePost.title));
    expect(ld.image).toContain(encodeURIComponent(samplePost.excerpt));
  });

  it("keywords joins all tags and articleSection uses the first tag", () => {
    const ld = blogPostJsonLd(samplePost);
    expect(ld.keywords).toBe("ai, sap");
    expect(ld.articleSection).toBe("ai");
  });

  it("inLanguage is Vietnamese and mainEntityOfPage references the post url", () => {
    const ld = blogPostJsonLd(samplePost);
    expect(ld.inLanguage).toBe("vi-VN");
    expect(ld.mainEntityOfPage["@type"]).toBe("WebPage");
    expect(ld.mainEntityOfPage["@id"]).toBe(ld.url);
  });

  it("publisher is a Person with a non-empty name", () => {
    const ld = blogPostJsonLd(samplePost);
    expect(ld.publisher["@type"]).toBe("Person");
    expect(ld.publisher.name.length).toBeGreaterThan(0);
  });
});
