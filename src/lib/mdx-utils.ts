import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { z } from "zod";

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

/** Get DB module synchronously — returns null if unavailable (build time) */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function tryGetDb(): any | null {
  try {
    // ponytail: require() keeps functions sync so no callers need to change
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("@/lib/db");
  } catch {
    return null;
  }
}

/** Get all blog posts, sorted by date descending */
export function getAllPosts(): BlogPost[] {
  const posts: BlogPost[] = [];

  if (fs.existsSync(CONTENT_DIR)) {
    const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));

    for (const file of files) {
      try {
        const slug = file.replace(/\.mdx$/, "");
        const filePath = path.join(CONTENT_DIR, file);
        const raw = fs.readFileSync(filePath, "utf-8");
        const { data } = matter(raw);

        const parsed = frontmatterSchema.safeParse(data);
        if (!parsed.success) {
          console.warn(`Invalid frontmatter in ${file}:`, parsed.error.message);
          continue;
        }

        // Filter drafts in production [V#5]
        if (parsed.data.draft && process.env.NODE_ENV !== "development") {
          continue;
        }

        posts.push({ slug, ...parsed.data, source: "mdx" });
      } catch (err) {
        console.warn(`Error reading ${file}:`, err);
      }
    }
  }

  // Merge DB posts — try-catch so build succeeds when SQLite unavailable
  // [ponytail: silent fail on DB error; if DB posts go missing in prod, add logging here]
  try {
    const dbModule = tryGetDb();
    if (dbModule) {
      const includeDrafts = process.env.NODE_ENV === "development";
      const dbPosts = dbModule.getAllDbPosts(includeDrafts);
      const mdxSlugs = new Set(posts.map((p) => p.slug));

      for (const dbPost of dbPosts) {
        if (mdxSlugs.has(dbPost.slug)) continue; // MDX takes priority
        posts.push(dbPostToBlogPost(dbPost));
      }
    }
  } catch {
    // DB unavailable at build time — MDX posts still render
  }

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/** Get a single post by slug with raw MDX content */
export function getPostBySlug(slug: string): BlogPost & { content: string } {
  if (!isValidSlug(slug)) {
    throw new Error(`Invalid slug: ${slug}`);
  }

  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  // Verify resolved path stays within content directory [RT#3]
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(CONTENT_DIR))) {
    throw new Error(`Path traversal detected: ${slug}`);
  }

  // Try MDX file first
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    const parsed = frontmatterSchema.parse(data);
    return { slug, ...parsed, content, source: "mdx" };
  } catch (err: unknown) {
    const isEnoent = err instanceof Error && (err as NodeJS.ErrnoException).code === "ENOENT";
    if (!isEnoent) throw err;
  }

  // MDX file not found — fall back to DB
  try {
    const dbModule = tryGetDb();
    if (dbModule) {
      const dbPost = dbModule.getDbPostBySlug(slug);
      if (dbPost) return dbPostToBlogPost(dbPost);
    }
  } catch {
    // DB unavailable
  }

  throw new Error(`Post not found: ${slug}`);
}

/** Get all unique tags from published posts */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set<string>();
  for (const post of posts) {
    for (const tag of post.tags) {
      tagSet.add(tag);
    }
  }
  return Array.from(tagSet).sort();
}
