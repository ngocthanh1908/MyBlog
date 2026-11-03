import type { AdminPost } from "@/lib/admin-posts";

export type AdminPostFilters = {
  query: string;
  /** Exact tag name, or "" for any. */
  tag: string;
  status: "all" | "published" | "draft";
  source: "all" | "mdx" | "cms";
};

export const EMPTY_FILTERS: AdminPostFilters = { query: "", tag: "", status: "all", source: "all" };

/** Lower-case and strip Vietnamese diacritics so "chay cham" finds "Chạy chậm". */
function fold(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .toLowerCase();
}

/**
 * Filter the admin list. Every word of the query must appear in the title, slug or excerpt
 * (any order); tag, status and source must all match. Pure so it can run in the browser.
 */
export function filterAdminPosts(posts: AdminPost[], filters: AdminPostFilters): AdminPost[] {
  const words = fold(filters.query).split(/\s+/).filter(Boolean);

  return posts.filter((post) => {
    if (filters.tag && !post.tags.includes(filters.tag)) return false;
    if (filters.status === "draft" && !post.draft) return false;
    if (filters.status === "published" && post.draft) return false;
    if (filters.source !== "all" && post.source !== filters.source) return false;
    if (words.length === 0) return true;
    const haystack = fold(`${post.title} ${post.slug} ${post.excerpt}`);
    return words.every((word) => haystack.includes(word));
  });
}

/** Distinct tags across the posts, sorted. */
export function collectTags(posts: AdminPost[]): string[] {
  return [...new Set(posts.flatMap((post) => post.tags))].sort((a, b) => a.localeCompare(b));
}
