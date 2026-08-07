"use client";

import { useState, useRef, type ChangeEvent } from "react";
import { useAdminAuth } from "./admin-auth-provider";
import { useToast } from "@/components/ui/toast";
import type { DbPost } from "@/lib/db";

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9\s-]/g, "").trim().replace(/\s+/g, "-");
}

interface ArticleFormProps {
  post?: DbPost;
  onSuccess: () => void;
  onCancel: () => void;
}

export function ArticleForm({ post, onSuccess, onCancel }: ArticleFormProps) {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);

  const [fields, setFields] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    tags: post ? JSON.parse(post.tags).join(", ") : "",
    read_time: String(post?.read_time ?? "1"),
    excerpt: post?.excerpt ?? "",
    cover_image: post?.cover_image ?? "",
    content: post?.content ?? "",
    draft: post ? post.draft === 1 : true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  function set(key: keyof typeof fields, value: string | boolean) {
    setFields((f) => ({ ...f, [key]: value }));
  }

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    const title = e.target.value;
    setFields((f) => ({ ...f, title, slug: toSlug(title) }));
  }

  async function handleUpload(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload thất bại");
      const { url } = await res.json();
      set("cover_image", url);
      showToast("Ảnh đã tải lên", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi upload", "error");
    } finally {
      setUploading(false);
    }
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
      const url = post ? `/api/posts/${post.id}` : "/api/posts";
      const res = await fetch(url, {
        method: post ? "PUT" : "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("Lưu thất bại");
      showToast(post ? "Đã cập nhật bài viết" : "Đã tạo bài viết", "success");
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
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">Tiêu đề *</label>
          <input className={inputCls} value={fields.title} onChange={handleTitleChange} placeholder="Tiêu đề bài viết" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Slug *</label>
          <input className={inputCls} value={fields.slug} onChange={(e) => set("slug", e.target.value)} placeholder="url-bai-viet" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted mb-1">Thời gian đọc (phút)</label>
          <input className={inputCls} type="number" min="1" value={fields.read_time} onChange={(e) => set("read_time", e.target.value)} />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">Tags (cách nhau bằng dấu phẩy)</label>
          <input className={inputCls} value={fields.tags} onChange={(e) => set("tags", e.target.value)} placeholder="tech, ai, blog" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">Tóm tắt</label>
          <textarea className={inputCls} rows={2} value={fields.excerpt} onChange={(e) => set("excerpt", e.target.value)} placeholder="Mô tả ngắn về bài viết" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">Ảnh bìa (URL)</label>
          <div className="flex gap-2">
            <input className={inputCls} value={fields.cover_image} onChange={(e) => set("cover_image", e.target.value)} placeholder="https://..." />
            <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
              className="shrink-0 px-4 py-2 rounded-xl border border-border text-sm font-medium text-primary hover:border-accent hover:text-accent transition-colors disabled:opacity-50">
              {uploading ? "..." : "Tải lên"}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
          </div>
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-semibold text-muted mb-1">Nội dung *</label>
          <textarea className={`${inputCls} font-mono`} rows={10} value={fields.content} onChange={(e) => set("content", e.target.value)} placeholder="Nội dung bài viết (Markdown)..." />
        </div>
        <div className="col-span-2 flex items-center gap-2">
          <input id="draft-check" type="checkbox" checked={fields.draft} onChange={(e) => set("draft", e.target.checked)} className="accent-accent w-4 h-4" />
          <label htmlFor="draft-check" className="text-sm text-muted">Lưu dưới dạng nháp</label>
        </div>
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={saving}
          className="flex-1 py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-50 transition-colors text-sm">
          {saving ? "Đang lưu..." : post ? "Cập nhật" : "Tạo bài viết"}
        </button>
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-muted hover:text-primary transition-colors">
          Hủy
        </button>
      </div>
    </form>
  );
}
