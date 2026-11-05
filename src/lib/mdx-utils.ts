import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";
import { getAllDbPosts, getDbPostBySlug } from "@/lib/db";
import { isFamilyPost } from "@/lib/family-posts";

const CONTENT_DIR = path.join(process.cwd(), "src/content/blog");

/** Zod schema for blog post frontmatter [RT#14] */
const frontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  tags: z.array(z.string()),
  excerpt: z.string(),
  coverImage: z.string().optional(),
  draft: z.boolean().optional().default(false),
});

export type BlogPost = {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  coverImage?: string;
  draft: boolean;
  content?: string;
  readTime?: number;
  source?: "mdx" | "db";
  id?: number;
};

/** Validate slug to prevent path traversal [RT#3] */
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && !slug.includes("..");
}

/** Map a DbPost row to BlogPost shape */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dbPostToBlogPost(dbPost: any): BlogPost & { content: string } {
  let tags: string[] = [];
  try { tags = JSON.parse(dbPost.tags); } catch { tags = []; }
  return {
    slug: dbPost.slug,
    title: dbPost.title,
    date: dbPost.created_at,
    tags,
    excerpt: dbPost.excerpt,
    coverImage: dbPost.cover_image ?? undefined,
    draft: dbPost.draft === 1,
    content: dbPost.content,
    readTime: dbPost.read_time,
    source: "db",
    id: dbPost.id,
  };
}

/** Every CMS (database) row, drafts included. Empty when SQLite is unavailable. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function readDbPosts(): any[] {
  try {
    // ponytail: the DB opens lazily, so a missing SQLite file (e.g. at build time) throws here, not at import
    return getAllDbPosts(true);
  } catch {
    return [];
  }
}

/** Every valid MDX file (drafts included) with its body. Invalid frontmatter is skipped with a warning. */
export function readMdxPosts(): (BlogPost & { content: string })[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const posts: (BlogPost & { content: string })[] = [];
  for (const file of fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"))) {
    try {
      const slug = file.replace(/\.mdx$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8"));

      const parsed = frontmatterSchema.safeParse(data);
      if (!parsed.success) {
        console.warn(`Invalid frontmatter in ${file}:`, parsed.error.message);
        continue;
      }
      posts.push({ slug, ...parsed.data, content, source: "mdx" });
    } catch (err) {
      console.warn(`Error reading ${file}:`, err);
    }
  }
  return posts;
}

/**
 * Get all published posts, sorted by date descending.
 * A CMS (database) post replaces the MDX post with the same slug — even when the CMS copy is a
 * draft, so a draft override hides the original instead of exposing it. Deleting the CMS copy
 * brings the MDX post back.
 */
export function getAllPosts(): BlogPost[] {
  const dev = process.env.NODE_ENV === "development";
  const dbRows = readDbPosts();
  const overridden = new Set(dbRows.map((row) => row.slug as string));

  const posts: BlogPost[] = [];
  for (const { content: _content, ...post } of readMdxPosts()) {
    void _content;
    if (overridden.has(post.slug)) continue;
    // Filter drafts in production [V#5]
    if (post.draft && !dev) continue;
    posts.push(post);
  }
  for (const row of dbRows) {
    if (row.draft === 1 && !dev) continue;
    posts.push(dbPostToBlogPost(row));
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Posts for the public listings (home, /blog, RSS, sitemap, tags). Family posts are left out:
 * they live only under Sở thích (/nguoi-than) and stay reachable by their own URL.
 */
export function getPublicPosts(): BlogPost[] {
  return getAllPosts().filter((post) => !isFamilyPost(post));
}

/** Get a single post by slug with raw MDX content. A CMS copy wins over the MDX file. */
export function getPostBySlug(slug: string): BlogPost & { content: string } {
  if (!isValidSlug(slug)) {
    throw new Error(`Invalid slug: ${slug}`);
  }

  // CMS copy first (it overrides an MDX post with the same slug)
  try {
    const dbPost = getDbPostBySlug(slug);
    if (dbPost) return dbPostToBlogPost(dbPost);
  } catch {
    // DB unavailable — fall through to the MDX file
  }

  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  // Verify resolved path stays within content directory [RT#3]
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(CONTENT_DIR))) {
    throw new Error(`Path traversal detected: ${slug}`);
  }

  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const parsed = frontmatterSchema.parse(data);
    return { slug, ...parsed, content, source: "mdx" };
  } catch (err: unknown) {
    const isEnoent = err instanceof Error && (err as NodeJS.ErrnoException).code === "ENOENT";
    if (!isEnoent) throw err;
  }

  throw new Error(`Post not found: ${slug}`);
}

/**
 * Get posts related to `currentSlug`, ranked by shared-tag count (descending)
 * with ties broken by most recent date first. Excludes the current post.
 * Returns `[]` when there are no other posts.
 */
export function getRelatedPosts(currentSlug: string, limit = 3): BlogPost[] {
  const allPosts = getAllPosts();
  const currentPost = allPosts.find((p) => p.slug === currentSlug);
  const currentTags = new Set(currentPost?.tags ?? []);
  // Family posts only relate to each other; everything else never surfaces them
  const currentIsFamily = currentPost ? isFamilyPost(currentPost) : false;

  const others = allPosts.filter((p) => p.slug !== currentSlug && isFamilyPost(p) === currentIsFamily);
  if (others.length === 0) return [];

  const sharedTagCount = (post: BlogPost) =>
    post.tags.filter((tag) => currentTags.has(tag)).length;

  return others
    .slice()
    .sort((a, b) => {
      const scoreDiff = sharedTagCount(b) - sharedTagCount(a);
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    })
    .slice(0, limit);
}

/** Get all unique tags from public posts (family posts and their tags are excluded) */
export function getAllTags(): string[] {
  const posts = getPublicPosts();
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
