"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { BlogCard } from "./blog-card";
import { SearchBox } from "./search-box";
import type { BlogPost } from "@/lib/mdx-utils";

interface TagFilterProps {
  posts: BlogPost[];
  tags: string[];
}

export function TagFilter({ posts, tags }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get("tag");
  const [isAdmin, setIsAdmin] = useState(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem("admin_token"));
  }, []);

  const visiblePosts = posts.filter((p) => !p.id || !deletedIds.includes(p.id));
  const filtered = activeTag
    ? visiblePosts.filter((p) => p.tags.includes(activeTag))
    : visiblePosts;

  function handleTagClick(tag: string | null) {
    if (tag) {
      router.push(`/blog?tag=${encodeURIComponent(tag)}`, { scroll: false });
    } else {
      router.push("/blog", { scroll: false });
    }
  }

  return (
    <>
      {/* Search + Filter controls row */}
      <div className="flex flex-wrap gap-4 items-center justify-between mb-7">
        <SearchBox />
        <div className="flex gap-2 overflow-x-auto pb-1 hide-scrollbar" role="tablist">
          <button
            onClick={() => handleTagClick(null)}
            className={`px-4 py-2 rounded-[30px] text-[0.85rem] font-semibold whitespace-nowrap transition-all duration-300 ${
              !activeTag
                ? "bg-accent text-white border border-accent shadow-[0_4px_12px_rgba(12,82,56,0.2)]"
                : "bg-surface border border-border text-muted hover:bg-accent hover:text-white hover:border-accent"
            }`}
          >
            Tat ca
          </button>
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => handleTagClick(tag === activeTag ? null : tag)}
              className={`px-4 py-2 rounded-[30px] text-[0.85rem] font-semibold whitespace-nowrap transition-all duration-300 ${
                activeTag === tag
                  ? "bg-accent text-white border border-accent shadow-[0_4px_12px_rgba(12,82,56,0.2)]"
                  : "bg-surface border border-border text-muted hover:bg-accent hover:text-white hover:border-accent"
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Single-column article list */}
      <div className="flex flex-col gap-6 mb-15">
        {filtered.map((post) => (
          <BlogCard
            key={post.slug}
            post={post}
            isAdmin={isAdmin}
            onDelete={(id) => setDeletedIds((prev) => [...prev, id])}
          />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-muted py-12">Khong tim thay bai viet.</p>
      )}
    </>
  );
}
