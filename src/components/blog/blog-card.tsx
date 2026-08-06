import Link from "next/link";
import type { BlogPost } from "@/lib/mdx-utils";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  const readTime = Math.max(1, Math.ceil((post.content?.length || 500) / 1000));
  const categoryTag = post.tags[0] || "Bài viết";

  return (
    <article className="bg-surface border border-border rounded-2xl p-[30px] transition-all duration-300 cursor-pointer shadow-[var(--card-shadow)] hover:-translate-y-1 hover:shadow-[var(--card-hover-shadow)] hover:border-accent-border group">
      <Link href={`/blog/${post.slug}`} className="block no-underline">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-3 text-[0.84rem] text-muted font-medium">
          <span className="bg-accent-light text-accent px-2.5 py-0.5 rounded-md font-bold text-[0.75rem] uppercase tracking-wider">
            {categoryTag}
          </span>
          <span>•</span>
          <span>
            {new Date(post.date).toLocaleDateString("vi-VN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-serif text-[1.7rem] font-semibold mb-2.5 leading-[1.3] tracking-tight text-primary">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-muted text-[0.98rem] leading-relaxed mb-5 line-clamp-3">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center text-[0.88rem] border-t border-border pt-4 font-semibold">
          <span className="text-muted">Đọc trong {readTime} phút</span>
          <span className="text-accent inline-flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-x-1">
            Đọc bài viết &rarr;
          </span>
        </div>
      </Link>
    </article>
  );
}
