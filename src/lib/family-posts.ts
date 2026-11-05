import type { Metadata } from "next";
import type { BlogPost } from "@/lib/mdx-utils";

/** Posts tagged with this appear on /nguoi-than ("Viết về những người thân yêu của tôi"). */
export const FAMILY_TAG = "Người thân";

const norm = (tag: string) => tag.trim().toLocaleLowerCase("vi");

/** True when the post carries the family tag (case/whitespace-insensitive). */
export function isFamilyPost(post: BlogPost): boolean {
  const wanted = norm(FAMILY_TAG);
  return post.tags.some((tag) => norm(tag) === wanted);
}

/** Posts carrying the family tag. Keeps the incoming order. */
export function getFamilyPosts(posts: BlogPost[]): BlogPost[] {
  return posts.filter(isFamilyPost);
}

/** Robots meta for a page: family posts must not be indexed or followed by search engines. */
export const NOINDEX_ROBOTS: NonNullable<Metadata["robots"]> = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};

/** `noindex` for family posts, nothing (site default) for the rest. */
export function getPostRobots(post: BlogPost): Metadata["robots"] | undefined {
  return isFamilyPost(post) ? NOINDEX_ROBOTS : undefined;
}
