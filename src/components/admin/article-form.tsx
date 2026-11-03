"use client";

import { useState, useEffect, lazy, Suspense, type ChangeEvent } from "react";
import { useAdminAuth } from "./admin-auth-provider";
import { CoverImageField } from "./cover-image-field";
import { useToast } from "@/components/ui/toast";
import type { AdminPost } from "@/lib/admin-posts";

const MarkdownEditor = lazy(() =>
  import("./markdown-editor").then((m) => ({ default: m.MarkdownEditor }))
);

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

interface ArticleFormProps {
  /** Existing post to edit: a CMS post (has `id`) or an MDX file (no `id`; saving creates a CMS copy). */
  post?: AdminPost;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ArticleForm({ post, onSuccess, onCancel }: ArticleFormProps) {
  const { token } = useAdminAuth();
  // An MDX file has no database id: saving creates a CMS copy that overrides it, which only works
  // while the slug stays the same.
  const isMdxCopy = !!post && post.id === undefined;
  const slugLocked = !!post?.hasMdxOriginal;
  const { showToast } = useToast();

  const [fields, setFields] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    tags: post ? post.tags.join(", ") : "",
    read_time: String(post?.read_time ?? "1"),
    excerpt: post?.excerpt ?? "",
    cover_image: post?.cover_image ?? "",
    content: post?.content ?? "",
    draft: post ? post.draft : true,
  });
  const [saving, setSaving] = useState(false);
  const [tagSuggestions, setTagSuggestions] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/tags", { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.ok ? r.json() : [])
      .then((tags: { name: string }[]) => setTagSuggestions(tags.map((t) => t.name)))
      .catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function set(key: keyof typeof fields, value: string | boolean) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setFields((f) => ({ ...f, title, slug: slugLocked ? f.slug : toSlug(title) }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!fields.title || !fields.slug || !fields.content) {
      showToast("Tiêu đề, slug và nội dung là bắt buộc", "error");
      return;
    }
    setSaving(true);
    try {
      const body = {
        title: fields.title,
        slug: fields.slug,
        excerpt: fields.excerpt,
        tags: fields.tags.split(",").map((t: string) => t.trim()).filter(Boolean),
        content: fields.content,
        cover_image: fields.cover_image || undefined,
        draft: fields.draft,
        read_time: parseInt(fields.read_time, 10) || 1,
      };
      const updating = post?.id !== undefined;
      const url = updating ? `/api/posts/${post.id}` : "/api/posts";
      const res = await fetch(url, {
        method: updating ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Lưu thất bại");
      showToast(
        isMdxCopy ? "Đã lưu bản CMS thay cho bài MDX" : updating ? "Đã cập nhật bài viết" : "Đã tạo bài viết",
        "success",
      );
      onSuccess();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi lưu", "error");
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "w-full px-4 py-2.5 rounded-xl border border-border bg-background text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors text-sm";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {isMdxCopy && (
        <p className="rounded-xl border border-accent-border bg-accent-light px-4 py-3 text-sm text-primary">
          Bài này là file MDX. Khi lưu, một bản CMS sẽ được tạo và thay thế bài trên trang web; file gốc không bị sửa.
          Muốn quay lại bản gốc, vào danh sách và bấm &ldquo;Khôi phục bản MDX&rdquo;.
        </p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">Tiêu đề *</label>
          <input className={inputCls} value={fields.title} onChange={handleTitleChange} placeholder="Tiêu đề bài viết" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Slug *</label>
          <input className={inputCls} value={fields.slug} readOnly={slugLocked} title={slugLocked ? "Slug phải trùng với file MDX để thay thế nó" : undefined} onChange={(e) => set("slug", e.target.value)} placeholder="url-bai-viet" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Thời gian đọc (phút)</label>
          <input className={inputCls} type="number" min="1" value={fields.read_time} onChange={(e) => set("read_time", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">Tags (cach nhau bang dau phay)</label>
          <input className={inputCls} value={fields.tags} onChange={(e) => set("tags", e.target.value)} placeholder="tech, ai, blog" list="tag-suggestions" />
          <datalist id="tag-suggestions">
            {tagSuggestions.map((t) => <option key={t} value={t} />)}
          </datalist>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">Tóm tắt</label>
          <textarea className={inputCls} rows={2} value={fields.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Mô tả ngắn về bài viết" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">Ảnh bìa</label>
          <CoverImageField value={fields.cover_image} onChange={(v) => set("cover_image", v)} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">Noi dung *</label>
          <Suspense fallback={<textarea className={`${inputCls} font-mono`} rows={10} value={fields.content} onChange={(e) => set("content", e.target.value)} placeholder="Dang tai editor..." />}>
            <MarkdownEditor value={fields.content} onChange={(v) => set("content", v)} />
          </Suspense>
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input id="draft-check" type="checkbox" checked={fields.draft} onChange={(e) => set("draft", e.target.checked)} className="accent-accent w-4 h-4" />
          <label htmlFor="draft-check" className="text-sm text-muted">Lưu dưới dạng nháp</label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-50 transition-colors text-sm">
          {saving ? "Đang lưu..." : isMdxCopy ? "Lưu bản CMS" : post ? "Cập nhật" : "Tạo bài viết"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-primary transition-colors">
          Hủy
        </button>
      </div>
    </form>
  );
}
