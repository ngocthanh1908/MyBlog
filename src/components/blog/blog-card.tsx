import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/mdx-utils";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="bg-surface rounded-3xl shadow-sm border border-border overflow-hidden hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full group">
      {/* Card thumbnail placeholder */}
      <Link
        href={`/blog/${post.slug}`}
        className="block aspect-[16/10] bg-gradient-to-br from-accent/5 to-blue-400/10 overflow-hidden relative"
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl font-extrabold text-accent/10">
            {post.title.charAt(0)}
          </span>
        </div>
        {post.tags[0] && (
          <div className="absolute top-4 right-4 bg-surface/90 backdrop-blur-sm px-3 py-1 rounded-md text-xs font-bold text-primary shadow-sm">
            {post.tags[0]}
          </div>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <span className="text-xs font-medium text-muted mb-3 block">
          {new Date(post.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </span>
        <Link href={`/blog/${post.slug}`} className="block flex-grow">
          <h3 className="text-xl font-bold text-primary mb-3 group-hover:text-accent transition-colors line-clamp-2 leading-snug">
            {post.title}
          </h3>
          <p className="text-muted text-sm line-clamp-3 mb-4 leading-relaxed">
            {post.excerpt}
          </p>
        </Link>
        <div className="mt-4 pt-4 border-t border-border/50 flex items-center text-sm text-accent font-semibold">
          Read more
          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </article>
  );
}
