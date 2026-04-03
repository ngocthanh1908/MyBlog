import Link from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { Clock, ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/lib/mdx-utils";

interface FeaturedArticleProps {
  post: BlogPost;
}

export function FeaturedArticle({ post }: FeaturedArticleProps) {
  // Estimate read time: ~1000 chars per minute, minimum 1 min
  const readTime = Math.max(1, Math.ceil((post.content?.length || 500) / 1000));

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20" id="featured">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted mb-6">
        Featured Post
      </h2>
      <FadeUp>
        <Link href={`/blog/${post.slug}`} className="group block">
          <div className="relative bg-surface rounded-3xl shadow-sm hover:shadow-2xl border border-border overflow-hidden transition-all duration-500 flex flex-col md:flex-row">
            {/* Image placeholder — replaced with real image when available */}
            <div className="md:w-1/2 h-72 md:h-auto relative overflow-hidden bg-gradient-to-br from-accent/10 to-blue-400/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-extrabold text-accent/10">
                  {post.title.charAt(0)}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="md:w-1/2 p-8 lg:p-12 flex flex-col justify-center bg-surface relative z-10">
              <div className="flex items-center gap-3 mb-5">
                {post.tags[0] && (
                  <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-accent/10 text-accent uppercase tracking-wide">
                    {post.tags[0]}
                  </span>
                )}
                <span className="text-sm text-muted font-medium flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {readTime} min read
                </span>
              </div>

              <h2 className="text-2xl lg:text-4xl font-extrabold text-primary mb-4 leading-tight group-hover:text-accent transition-colors">
                {post.title}
              </h2>
              <p className="text-muted mb-8 line-clamp-3 leading-relaxed text-lg">
                {post.excerpt}
              </p>

              <div className="flex items-center justify-between mt-auto">
                <div>
                  <p className="text-sm font-bold text-primary">Pham Ngoc Thanh</p>
                  <p className="text-xs text-muted">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div className="h-10 w-10 bg-surface group-hover:bg-accent text-muted group-hover:text-white rounded-full flex items-center justify-center transition-colors border border-border group-hover:border-accent">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>
            </div>
          </div>
        </Link>
      </FadeUp>
    </section>
  );
}
