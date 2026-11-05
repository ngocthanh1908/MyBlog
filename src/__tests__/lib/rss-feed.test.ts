import { describe, it, expect } from "vitest";
import { buildRssFeed, escapeXml } from "@/lib/rss-feed";
import type { BlogPost } from "@/lib/mdx-utils";

const meta = { title: "Blog", description: "Mô tả", siteUrl: "https://example.com/" };

const makePost = (over: Partial<BlogPost> = {}): BlogPost => ({
  slug: "bai-1",
  title: "Bài 1",
  date: "2026-01-02T00:00:00.000Z",
  tags: ["SAP"],
  excerpt: "Tóm tắt",
  draft: false,
  ...over,
});

describe("escapeXml", () => {
  it("escapes the five XML special characters", () => {
    expect(escapeXml(`<a href="x">&'</a>`)).toBe("&lt;a href=&quot;x&quot;&gt;&amp;&apos;&lt;/a&gt;");
  });
});

describe("buildRssFeed", () => {
  it("builds a channel with one item per post and absolute links", () => {
    const xml = buildRssFeed([makePost(), makePost({ slug: "bai-2", title: "Bài 2" })], meta);
    expect(xml).toContain("<title>Blog</title>");
    expect(xml).toContain("<link>https://example.com</link>");
    expect(xml).toContain("<link>https://example.com/blog/bai-1</link>");
    expect(xml).toContain("<link>https://example.com/blog/bai-2</link>");
    expect(xml.match(/<item>/g)).toHaveLength(2);
    expect(xml).toContain("<category>SAP</category>");
    expect(xml).toContain("<pubDate>Fri, 02 Jan 2026 00:00:00 GMT</pubDate>");
  });

  it("escapes user text in titles and excerpts", () => {
    const xml = buildRssFeed([makePost({ title: "A & B <x>", excerpt: "1 < 2" })], meta);
    expect(xml).toContain("<title>A &amp; B &lt;x&gt;</title>");
    expect(xml).toContain("<description>1 &lt; 2</description>");
  });

  it("omits pubDate when the date is invalid", () => {
    const xml = buildRssFeed([makePost({ date: "not-a-date" })], meta);
    expect(xml).not.toContain("pubDate");
  });

  it("returns a valid empty channel without posts", () => {
    const xml = buildRssFeed([], meta);
    expect(xml).toContain("<channel>");
    expect(xml).not.toContain("<item>");
  });
});
