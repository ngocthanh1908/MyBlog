"use client";

import { useEffect, useMemo, useState } from "react";
import { useAdminAuth } from "./admin-auth-provider";
import { useToast } from "@/components/ui/toast";
import type { AdminPost } from "@/lib/admin-posts";
import { collectTags, EMPTY_FILTERS, filterAdminPosts, type AdminPostFilters } from "@/lib/admin-post-filters";

interface ArticleListProps {
  onEdit: (post: AdminPost) => void;
  onCreate: () => void;
}

/** Where a post lives: an MDX file, the CMS database, or a CMS copy replacing an MDX file. */
const selectCls =
  "px-3 py-2 rounded-xl border border-border bg-background text-primary text-sm focus:outline-none focus:border-accent";

/** Small 16:9 cover thumbnail, or a neutral placeholder when the post has none / it cannot load. */
function Thumb({ src }: { src?: string }) {
  const [failed, setFailed] = useState(false);
  const usable = !!src && src.startsWith("/") && !src.startsWith("//") && !failed;
  return (
    <div className="aspect-video w-24 shrink-0 overflow-hidden rounded-lg border border-border bg-accent-light">
      {usable ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt="" loading="lazy" className="h-full w-full object-cover" onError={() => setFailed(true)} />
      ) : (
        <div data-testid="no-cover" className="flex h-full items-center justify-center text-[0.65rem] text-muted">
          Chưa có ảnh
        </div>
      )}
    </div>
  );
}

function sourceLabel(post: AdminPost): string {
  if (post.source === "mdx") return "MDX";
  return post.hasMdxOriginal ? "CMS · thay bài MDX" : "CMS";
}

export function ArticleList({ onEdit, onCreate }: ArticleListProps) {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<AdminPostFilters>(EMPTY_FILTERS);

  async function fetchPosts() {
    try {
      const res = await fetch("/api/admin/posts", {
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

  /** CMS posts only. For an override this removes the copy, which brings the MDX original back. */
  async function handleDelete(post: AdminPost) {
    const restoring = post.hasMdxOriginal;
    const question = restoring
      ? `Khôi phục bản MDX gốc của "${post.title}"? Bản CMS sẽ bị xóa.`
      : `Xóa bài viết "${post.title}"?`;
    if (!confirm(question)) return;
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(restoring ? "Khôi phục thất bại" : "Xóa thất bại");
      showToast(restoring ? "Đã khôi phục bản MDX" : "Đã xóa bài viết", "success");
      await fetchPosts();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi xóa", "error");
    }
  }

  const tags = useMemo(() => collectTags(posts), [posts]);
  const visible = useMemo(() => filterAdminPosts(posts, filters), [posts, filters]);
  const filtering = JSON.stringify(filters) !== JSON.stringify(EMPTY_FILTERS);
  const setFilter = <K extends keyof AdminPostFilters>(key: K, value: AdminPostFilters[K]) =>
    setFilters((f) => ({ ...f, [key]: value }));

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
      {posts.length > 0 && (
        <div className="mb-5 flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={filters.query}
            onChange={(e) => setFilter("query", e.target.value)}
            placeholder="Tìm bài viết..."
            className="min-w-[200px] flex-1 px-4 py-2 rounded-xl border border-border bg-background text-primary placeholder:text-muted focus:outline-none focus:border-accent text-sm"
          />
          <select aria-label="Lọc theo tag" value={filters.tag} onChange={(e) => setFilter("tag", e.target.value)} className={selectCls}>
            <option value="">Tất cả tag</option>
            {tags.map((tag) => <option key={tag} value={tag}>{tag}</option>)}
          </select>
          <select aria-label="Lọc theo trạng thái" value={filters.status} onChange={(e) => setFilter("status", e.target.value as AdminPostFilters["status"])} className={selectCls}>
            <option value="all">Mọi trạng thái</option>
            <option value="published">Đã xuất bản</option>
            <option value="draft">Nháp</option>
          </select>
          <select aria-label="Lọc theo nguồn" value={filters.source} onChange={(e) => setFilter("source", e.target.value as AdminPostFilters["source"])} className={selectCls}>
            <option value="all">Mọi nguồn</option>
            <option value="mdx">MDX</option>
            <option value="cms">CMS</option>
          </select>
          {filtering && (
            <button onClick={() => setFilters(EMPTY_FILTERS)} className="text-sm font-medium text-accent hover:underline">
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}
      {posts.length === 0 ? (
        <p className="text-muted text-sm">Chưa có bài viết nào.</p>
      ) : (
        <>
          <p className="mb-3 text-xs text-muted">{filtering ? `${visible.length}/${posts.length} bài` : `${posts.length} bài`}</p>
          {visible.length === 0 ? (
            <p className="text-muted text-sm">Không có bài nào khớp bộ lọc.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {visible.map((post) => (
                <div
                  key={post.slug}
                  className="flex items-center justify-between bg-surface border border-border rounded-2xl px-4 py-3 shadow-[var(--card-shadow)]"
                >
                  <Thumb src={post.cover_image} />
                  <div className="flex-1 min-w-0 mx-4">
                    <p className="font-semibold text-primary truncate">{post.title}</p>
                    <p className="text-muted text-xs mt-0.5 flex items-center gap-2">
                      <span className="rounded bg-accent-light px-1.5 py-0.5 font-bold text-accent">{sourceLabel(post)}</span>
                      <span>
                        {post.draft ? "Nháp" : "Đã xuất bản"} &middot; {new Date(post.date.replace(" ", "T")).toLocaleDateString("vi-VN")}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => onEdit(post)}
                      className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-primary hover:border-accent hover:text-accent transition-colors"
                    >
                      Sửa
                    </button>
                    {post.source === "cms" && (
                      <button
                        onClick={() => handleDelete(post)}
                        className="px-3 py-1.5 rounded-lg border border-red-300 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                      >
                        {post.hasMdxOriginal ? "Khôi phục bản MDX" : "Xóa"}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
