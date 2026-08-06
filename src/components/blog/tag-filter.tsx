"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { BlogCard } from "./blog-card";
import type { BlogPost } from "@/lib/mdx-utils";

interface TagFilterProps {
  posts: BlogPost[];
  tags: string[];
}

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
      {/* Pill-style category filter */}
      <div className="flex gap-2.5 overflow-x-auto pb-1 mb-7 hide-scrollbar" role="tablist">
        <button
          onClick={() => handleTagClick(null)}
          className={`px-[18px] py-2 rounded-[30px] text-[0.88rem] font-semibold whitespace-nowrap transition-all duration-300 ${
            !activeTag
              ? "bg-accent text-white border border-accent shadow-[0_4px_12px_rgba(12,82,56,0.2)]"
              : "bg-surface border border-border text-muted hover:bg-accent hover:text-white hover:border-accent hover:shadow-[0_4px_12px_rgba(12,82,56,0.2)]"
          }`}
        >
          Tất cả bài viết
        </button>
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => handleTagClick(tag === activeTag ? null : tag)}
            className={`px-[18px] py-2 rounded-[30px] text-[0.88rem] font-semibold whitespace-nowrap transition-all duration-300 ${
              activeTag === tag
                ? "bg-accent text-white border border-accent shadow-[0_4px_12px_rgba(12,82,56,0.2)]"
                : "bg-surface border border-border text-muted hover:bg-accent hover:text-white hover:border-accent hover:shadow-[0_4px_12px_rgba(12,82,56,0.2)]"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Single-column article list */}
      <div className="flex flex-col gap-6 mb-15">
        {filtered.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted py-12">Không tìm thấy bài viết.</p>
      )}
    </>
  );
}
