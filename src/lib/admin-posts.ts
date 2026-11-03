import { readDbPosts, readMdxPosts } from "@/lib/mdx-utils";

/** One row of the admin post list: an MDX file, a CMS (database) post, or a CMS copy overriding an MDX file. */
export type AdminPost = {
  slug: string;
  title: string;
  /** YYYY-MM-DD (MDX frontmatter) or the creation timestamp (CMS). */
  date: string;
  tags: string[];
  excerpt: string;
  cover_image?: string;
  content: string;
  draft: boolean;
  read_time: number;
  source: "mdx" | "cms";
  /** Database id; present only for `source: "cms"`. */
  id?: number;
  /** True when an MDX file with this slug exists (a CMS copy then overrides it). */
  hasMdxOriginal: boolean;
};

const readTime = (content: string) => Math.max(1, Math.ceil((content.length || 500) / 1000));

function parseTags(raw: string): string[] {
  try {
    const tags = JSON.parse(raw);
    return Array.isArray(tags) ? tags : [];
  } catch {
    return [];
  }
}

/**
 * Merge MDX files and CMS rows for the admin list, newest first. A CMS row replaces the MDX entry
 * with the same slug and records that an original exists, so the UI can offer "restore original".
 */
export function getAdminPosts(): AdminPost[] {
  const mdx = readMdxPosts();
  const mdxSlugs = new Set(mdx.map((p) => p.slug));
  const dbRows = readDbPosts();
  const overridden = new Set(dbRows.map((row) => row.slug as string));

  const fromMdx: AdminPost[] = mdx
    .filter((p) => !overridden.has(p.slug))
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
      tags: p.tags,
      excerpt: p.excerpt,
      cover_image: p.coverImage,
      content: p.content,
      draft: p.draft,
      read_time: readTime(p.content),
      source: "mdx",
      hasMdxOriginal: true,
    }));

  const fromCms: AdminPost[] = dbRows.map((row) => ({
    slug: row.slug,
    title: row.title,
    date: row.created_at,
    tags: parseTags(row.tags),
    excerpt: row.excerpt,
    cover_image: row.cover_image ?? undefined,
    content: row.content,
    draft: row.draft === 1,
    read_time: row.read_time,
    source: "cms",
    id: row.id,
    hasMdxOriginal: mdxSlugs.has(row.slug),
  }));

  return [...fromMdx, ...fromCms].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
