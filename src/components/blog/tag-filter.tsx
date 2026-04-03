"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/mdx-utils";

interface TagFilterProps {
  posts: BlogPost[];
  tags: string[];
}

/** Client-side tag filtering via URL search params — posts passed from server [RT#9] */
export function TagFilter({ posts, tags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  function handleTagClick(tag: string | null) {
    if (tag) {
      router.push(`/blog?tag=${encodeURIComponent(tag)}`, { scroll: false });
    } else {
      router.push("/blog", { scroll: false });
    }
  }

  return (
    <>
      {/* Pill-style tag filter strip */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-8 hide-scrollbar">
        <button
          onClick={() => handleTagClick(null)}
          className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-colors ${
            !activeTag
              ? "bg-primary text-white dark:bg-accent"
              : "bg-surface border border-border text-muted hover:text-accent hover:border-accent/50"
          }`}
        >
          All Posts
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag === activeTag ? null : tag)}
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

      {/* 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted py-12">No posts found with this tag.</p>
      )}
    </>
  );
}
