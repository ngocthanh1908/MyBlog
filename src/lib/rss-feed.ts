import type { BlogPost } from "@/lib/mdx-utils";

/** Escape the five XML special characters so titles/excerpts cannot break the feed. */
export function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

interface FeedMeta {
  title: string;
  description: string;
  siteUrl: string;
}

/** Build an RSS 2.0 document for the given posts (already sorted newest first). */
export function buildRssFeed(posts: BlogPost[], meta: FeedMeta): string {
  const base = meta.siteUrl.replace(/\/$/, "");

  const items = posts
    .map((post) => {
      const link = `${base}/blog/${post.slug}`;
      const time = new Date(post.date).getTime();
      // An unparseable date would make toUTCString() return "Invalid Date": omit pubDate instead
      const pubDate = Number.isNaN(time) ? "" : `\n      <pubDate>${new Date(time).toUTCString()}</pubDate>`;
      const categories = post.tags.map((tag) => `\n      <category>${escapeXml(tag)}</category>`).join("");
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(link)}</link>
      <guid isPermaLink="true">${escapeXml(link)}</guid>${pubDate}
      <description>${escapeXml(post.excerpt)}</description>${categories}
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(meta.title)}</title>
    <link>${escapeXml(base)}</link>
    <description>${escapeXml(meta.description)}</description>
    <language>vi</language>
    <atom:link href="${escapeXml(base)}/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;
}
