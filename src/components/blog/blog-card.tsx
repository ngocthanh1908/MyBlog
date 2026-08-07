"use client";

import { useState } from "react";
import Link from "next/link";
import type { BlogPost } from "@/lib/mdx-utils";

interface BlogCardProps {
  post: BlogPost;
  isAdmin?: boolean;
  onDelete?: (id: number) => void;
}

export function BlogCard({ post, isAdmin, onDelete }: BlogCardProps) {
  const [deleting, setDeleting] = useState(false);
  const readTime = post.readTime ?? Math.max(1, Math.ceil((post.content?.length || 500) / 1000));
  const categoryTag = post.tags[0] || "Bai viet";
  const isDbPost = post.source === "db" && post.id;

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!post.id || !confirm("Xoa bai viet nay?")) return;
    setDeleting(true);
    try {
      const token = localStorage.getItem("admin_token");
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) onDelete?.(post.id);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <article className="bg-surface border border-border rounded-2xl p-7 transition-all duration-300 cursor-pointer shadow-[var(--card-shadow)] hover:-translate-y-[3px] hover:shadow-[var(--card-hover-shadow)] hover:border-accent-border group">
      <Link href={`/blog/${post.slug}`} className="block no-underline">
        {/* Meta */}
        <div className="flex items-center gap-3 mb-2.5 text-[0.83rem] text-muted font-medium">
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
        <h3 className="font-serif text-[1.65rem] font-semibold mb-2 leading-[1.3] text-primary">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="text-muted text-[0.98rem] leading-[1.65] mb-[18px] line-clamp-3">
          {post.excerpt}
        </p>

        {/* Footer */}
        <div className="flex justify-between items-center text-[0.88rem] border-t border-border pt-3.5 font-semibold">
          <span className="text-muted">Doc trong {readTime} phut</span>
          <span className="flex items-center gap-2">
            {isAdmin && isDbPost && (
              <>
                <Link
                  href={`/admin?edit=${post.id}`}
                  className="bg-accent-light text-accent border border-accent-border px-2.5 py-1 rounded-md text-[0.8rem] font-bold no-underline hover:opacity-80"
                  onClick={(e) => e.stopPropagation()}
                >
                  Sua
                </Link>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 border border-red-300/30 px-2.5 py-1 rounded-md text-[0.8rem] font-bold cursor-pointer hover:opacity-80 disabled:opacity-50"
                >
                  Xoa
                </button>
              </>
            )}
            <span className="text-accent inline-flex items-center gap-1.5 transition-transform duration-300 group-hover:translate-x-1">
              Doc bai viet &rarr;
            </span>
          </span>
        </div>
      </Link>
    </article>
  );
}
