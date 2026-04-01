import Link from "next/link";
import type { BlogPost } from "@/lib/mdx-utils";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <article className="rounded-2xl border border-border bg-surface p-6 transition-colors duration-300 group-hover:border-accent">
        <h2 className="text-lg font-bold">{post.title}</h2>
        <p className="mt-1 text-xs text-muted">
          {post.date} &middot; {post.tags.join(", ")}
        </p>
        <p className="mt-3 text-sm text-muted">{post.excerpt}</p>
      </article>
    </Link>
  );
}
