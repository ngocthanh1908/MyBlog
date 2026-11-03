import type { AdminPost } from "@/lib/admin-posts";

/** Escape a string for use inside a RegExp. */
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Posts that use an image URL as their cover or inside the body (Markdown/HTML).
 * The URL must end at a non-filename character so "/uploads/a.webp" does not match "/uploads/a.webp2".
 */
export function findImageUsage(posts: AdminPost[], url: string): AdminPost[] {
  const asWholeUrl = new RegExp(`${escapeRegExp(url)}(?![\\w.%-])`);
  return posts.filter((post) => post.cover_image === url || asWholeUrl.test(post.content));
}
