import Link from "next/link";
import type { BlogPost } from "@/lib/mdx-utils";

interface RelatedArticlesProps {
  posts: BlogPost[];
}

/** Read-only "related articles" card list; renders nothing when `posts` is empty. */
export function RelatedArticles({ posts }: RelatedArticlesProps) {
  if (posts.length === 0) return null;

  return (
    <section className="mb-12" aria-labelledby="related-articles-heading">
      <h2
        id="related-articles-heading"
        className="font-serif text-[1.5rem] font-semibold mb-5 text-primary"
      >
        Bài viết liên quan
      </h2>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="block no-underline bg-surface border border-border rounded-2xl p-5 transition-all duration-300 shadow-[var(--card-shadow)] hover:-translate-y-[2px] hover:shadow-[var(--card-hover-shadow)] hover:border-accent-border"
          >
            <span className="block text-[0.78rem] text-muted font-medium mb-1.5">
              {new Date(post.date).toLocaleDateString("vi-VN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <h3 className="font-serif text-[1.1rem] font-semibold mb-1.5 leading-[1.3] text-primary">
              {post.title}
            </h3>
            <p className="text-muted text-[0.88rem] leading-[1.5] line-clamp-2">
              {post.excerpt}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
