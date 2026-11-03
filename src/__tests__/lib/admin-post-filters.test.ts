import { describe, it, expect } from "vitest";
import { filterAdminPosts, collectTags, EMPTY_FILTERS } from "@/lib/admin-post-filters";
import type { AdminPost } from "@/lib/admin-posts";

const post = (over: Partial<AdminPost>): AdminPost => ({
  slug: "s", title: "T", date: "2026-10-01", tags: [], excerpt: "", content: "", draft: false,
  read_time: 1, source: "mdx", hasMdxOriginal: true, ...over,
});

const posts: AdminPost[] = [
  post({ slug: "rag-la-gi", title: "RAG là gì", tags: ["AI"], excerpt: "Cho AI đọc tài liệu" }),
  post({ slug: "sap-basis", title: "SAP Basis làm gì?", tags: ["SAP"], draft: true, source: "cms", id: 1, hasMdxOriginal: false }),
  post({ slug: "chay-cham", title: "Chạy chậm để chạy xa", tags: ["Running", "Mindfulness"] }),
];

describe("filterAdminPosts", () => {
  it("returns everything for empty filters", () => {
    expect(filterAdminPosts(posts, EMPTY_FILTERS)).toHaveLength(3);
  });

  it("searches title, slug and excerpt, ignoring case and Vietnamese diacritics", () => {
    expect(filterAdminPosts(posts, { ...EMPTY_FILTERS, query: "chay cham" }).map((p) => p.slug)).toEqual(["chay-cham"]);
    expect(filterAdminPosts(posts, { ...EMPTY_FILTERS, query: "SAP-BASIS" }).map((p) => p.slug)).toEqual(["sap-basis"]);
    expect(filterAdminPosts(posts, { ...EMPTY_FILTERS, query: "tai lieu" }).map((p) => p.slug)).toEqual(["rag-la-gi"]);
  });

  it("matches every word of the query (any order)", () => {
    expect(filterAdminPosts(posts, { ...EMPTY_FILTERS, query: "xa chay" }).map((p) => p.slug)).toEqual(["chay-cham"]);
    expect(filterAdminPosts(posts, { ...EMPTY_FILTERS, query: "xa rag" })).toHaveLength(0);
  });

  it("ignores surrounding whitespace in the query", () => {
    expect(filterAdminPosts(posts, { ...EMPTY_FILTERS, query: "   rag  " })).toHaveLength(1);
  });

  it("filters by tag (a post matches any of its tags)", () => {
    expect(filterAdminPosts(posts, { ...EMPTY_FILTERS, tag: "Mindfulness" }).map((p) => p.slug)).toEqual(["chay-cham"]);
    expect(filterAdminPosts(posts, { ...EMPTY_FILTERS, tag: "Running" }).map((p) => p.slug)).toEqual(["chay-cham"]);
  });

  it("filters by status", () => {
    expect(filterAdminPosts(posts, { ...EMPTY_FILTERS, status: "draft" }).map((p) => p.slug)).toEqual(["sap-basis"]);
    expect(filterAdminPosts(posts, { ...EMPTY_FILTERS, status: "published" })).toHaveLength(2);
  });

  it("filters by source", () => {
    expect(filterAdminPosts(posts, { ...EMPTY_FILTERS, source: "cms" }).map((p) => p.slug)).toEqual(["sap-basis"]);
    expect(filterAdminPosts(posts, { ...EMPTY_FILTERS, source: "mdx" })).toHaveLength(2);
  });

  it("combines all filters with AND", () => {
    expect(filterAdminPosts(posts, { query: "chay", tag: "Running", status: "published", source: "mdx" })).toHaveLength(1);
    expect(filterAdminPosts(posts, { query: "chay", tag: "AI", status: "all", source: "all" })).toHaveLength(0);
  });
});

describe("collectTags", () => {
  it("returns the distinct tags, sorted", () => {
    expect(collectTags(posts)).toEqual(["AI", "Mindfulness", "Running", "SAP"]);
  });
});
