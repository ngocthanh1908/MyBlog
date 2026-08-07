"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "./admin-auth-provider";
import { useToast } from "@/components/ui/toast";
import type { DbPost } from "@/lib/db";

interface ArticleListProps {
  onEdit: (post: DbPost) => void;
  onCreate: () => void;
}

export function ArticleList({ onEdit, onCreate }: ArticleListProps) {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<DbPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/posts?drafts=true", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Không thể tải bài viết");
      setPosts(await res.json());
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi tải dữ liệu", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchPosts(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleDelete(post: DbPost) {
    if (!confirm(`Xóa bài viết "${post.title}"?`)) return;
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xóa thất bại");
      showToast("Đã xóa bài viết", "success");
      setPosts((p) => p.filter((x) => x.id !== post.id));
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi xóa", "error");
    }
  }

  if (loading) return <p className="text-muted text-sm">Đang tải...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-semibold text-primary">Quản lý bài viết</h1>
        <button
          onClick={onCreate}
          className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors"
        >
          + Tạo bài viết mới
        </button>
      </div>
      {posts.length === 0 ? (
        <p className="text-muted text-sm">Chưa có bài viết nào.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="flex items-center justify-between bg-surface border border-border rounded-2xl px-5 py-4 shadow-[var(--card-shadow)]"
            >
              <div className="flex-1 min-w-0 mr-4">
                <p className="font-semibold text-primary truncate">{post.title}</p>
                <p className="text-muted text-xs mt-0.5">
                  {post.draft ? "Nháp" : "Đã xuất bản"} &middot;{" "}
                  {new Date(post.created_at).toLocaleDateString("vi-VN")}
                </p>
              </div>
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => onEdit(post)}
                  className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-primary hover:border-accent hover:text-accent transition-colors"
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDelete(post)}
                  className="px-3 py-1.5 rounded-lg border border-red-300 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
