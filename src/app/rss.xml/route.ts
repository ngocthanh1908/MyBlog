import { getPublicPosts } from "@/lib/mdx-utils";
import { buildRssFeed } from "@/lib/rss-feed";
import { siteConfig } from "@/lib/site-config";

// Posts can be added from the admin at runtime, so the feed must not be frozen at build time.
export const dynamic = "force-dynamic";

export function GET() {
  const xml = buildRssFeed(getPublicPosts(), {
    title: siteConfig.name,
    description: siteConfig.description,
    siteUrl: siteConfig.siteUrl,
  });
  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
