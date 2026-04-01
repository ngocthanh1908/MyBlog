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
};

/** Validate slug to prevent path traversal [RT#3] */
function isValidSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug) && !slug.includes("..");
}

/** Get all blog posts, sorted by date descending */
export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
  const posts: BlogPost[] = [];

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

      posts.push({ slug, ...parsed.data });
    } catch (err) {
      console.warn(`Error reading ${file}:`, err);
    }
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

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  const parsed = frontmatterSchema.parse(data);

  return { slug, ...parsed, content };
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
