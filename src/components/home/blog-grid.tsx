"use client";

import { useState } from "react";
import Link from "next/link";
import { FadeUp } from "@/components/motion/fade-up";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/lib/mdx-utils";

interface BlogGridProps {
  posts: BlogPost[];
  tags: string[];
}

export function BlogGrid({ posts, tags }: BlogGridProps) {
  const [activeTag, setActiveTag] = useState<string | null>(null);

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  return (
    <>
      {/* Section header + category filter pills */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-primary tracking-tight">
            Recently Published
          </h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-4 hide-scrollbar">
          <button
            onClick={() => setActiveTag(null)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors ${
              activeTag === null
                ? "bg-primary text-white dark:bg-accent"
                : "bg-surface border border-border text-muted hover:text-accent hover:border-accent/50"
            }`}
          >
            All Posts
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag(tag === activeTag ? null : tag)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTag === tag
                  ? "bg-primary text-white dark:bg-accent"
                  : "bg-surface border border-border text-muted hover:text-accent hover:border-accent/50"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </section>

      {/* 3-column blog cards grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((post, i) => (
            <FadeUp key={post.slug} delay={i * 0.1}>
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
            </FadeUp>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="text-center text-muted py-12">No posts found with this tag.</p>
        )}

        {/* View all posts link */}
        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-flex items-center justify-center px-8 py-3 border-2 border-border text-primary font-bold rounded-full hover:border-accent hover:text-accent transition-colors"
          >
            View all posts
          </Link>
        </div>
      </section>
    </>
  );
}
