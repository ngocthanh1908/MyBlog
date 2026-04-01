"use client";

import { useSearchParams, useRouter } from "next/navigation";
import type { BlogPost } from "@/lib/mdx-utils";
import { BlogCard } from "./blog-card";

interface TagFilterProps {
  posts: BlogPost[];
  tags: string[];
}

/** Client-side tag filtering — all posts passed from server component [RT#9] */
export function TagFilter({ posts, tags }: TagFilterProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeTag = searchParams.get("tag");

  const filtered = activeTag
    ? posts.filter((p) => p.tags.includes(activeTag))
    : posts;

  function handleTag(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set("tag", tag);
    } else {
      params.delete("tag");
    }
    router.push(`/blog?${params.toString()}`);
  }

  return (
    <>
      {/* Tag chips */}
      <div className="mb-8 flex flex-wrap gap-2">
        <button
          onClick={() => handleTag(null)}
          className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
            !activeTag
              ? "bg-accent text-white"
              : "bg-surface text-muted hover:text-primary"
          }`}
        >
          All
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTag(tag)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              activeTag === tag
                ? "bg-accent text-white"
                : "bg-surface text-muted hover:text-primary"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Post list */}
      <div className="flex flex-col gap-4">
        {filtered.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
        {filtered.length === 0 && (
          <p className="text-sm text-muted">No posts found.</p>
        )}
      </div>
    </>
  );
}
