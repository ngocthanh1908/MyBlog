"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useAdminAuth } from "./admin-auth-provider";
import { useToast } from "@/components/ui/toast";
import { findImageUsage } from "@/lib/image-usage";
import type { AdminPost } from "@/lib/admin-posts";

interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

interface MediaLibraryProps {
  /** If set, choosing an image calls this instead of copying Markdown */
  onInsert?: (url: string) => void;
}

type Folder = "uploads" | "covers";
const TABS: { folder: Folder; label: string }[] = [
  { folder: "uploads", label: "Ảnh đã tải lên" },
  { folder: "covers", label: "Ảnh minh họa có sẵn" },
];

const PAGE_LIMIT = 100;

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ onInsert }: MediaLibraryProps) {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [folder, setFolder] = useState<Folder>("uploads");
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [total, setTotal] = useState(0);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const auth = { headers: { Authorization: `Bearer ${token}` } };

  async function fetchFiles(target: Folder = folder) {
    setLoading(true);
    try {
      const res = await fetch(`/api/uploads?folder=${target}&limit=${PAGE_LIMIT}`, auth);
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      const list: MediaFile[] = Array.isArray(data) ? data : data.files;
      setFiles(list);
      setTotal(Array.isArray(data) ? list.length : data.total ?? list.length);
    } catch {
      showToast("Không thể tải danh sách ảnh", "error");
    } finally {
      setLoading(false);
    }
  }

  // Posts are only used to show where an image is used; the library still works without them.
  async function fetchPosts() {
    try {
      const res = await fetch("/api/admin/posts", auth);
      if (res.ok) setPosts(await res.json());
    } catch {
      /* usage badges are optional */
    }
  }

  useEffect(() => { fetchFiles(folder); }, [folder]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { fetchPosts(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? files.filter((f) => f.name.toLowerCase().includes(q)) : files;
  }, [files, query]);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = Array.from(e.target.files ?? []);
    if (picked.length === 0) return;
    setUploading(true);
    let done = 0;
    const failures: string[] = [];
    for (const file of picked) {
      try {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", headers: auth.headers, body: fd });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error || "Tải lên thất bại");
        }
        done++;
      } catch (err) {
        failures.push(`${file.name}: ${err instanceof Error ? err.message : "lỗi"}`);
      }
    }
    if (done > 0) showToast(`Đã tải lên ${done} ảnh`, "success");
    if (failures.length > 0) showToast(failures.join("; "), "error");
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
    if (folder !== "uploads") setFolder("uploads");
    else await fetchFiles("uploads");
  }

  async function handleDelete(file: MediaFile) {
    const users = findImageUsage(posts, file.url);
    const warning = users.length
      ? `\n\nẢnh đang được dùng ở ${users.length} bài (${users.map((p) => p.title).join(", ")}). Xóa sẽ làm ảnh ở các bài này bị lỗi.`
      : "";
    if (!confirm(`Xóa file "${file.name}"?${warning}`)) return;
    try {
      const res = await fetch(`/api/uploads/${encodeURIComponent(file.name)}`, { method: "DELETE", ...auth });
      if (!res.ok) throw new Error("Xóa thất bại");
      setFiles((f) => f.filter((x) => x.name !== file.name));
      setTotal((t) => Math.max(0, t - 1));
      showToast("Đã xóa", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Lỗi xóa", "error");
    }
  }

  function handleSelect(url: string) {
    if (onInsert) {
      onInsert(url);
    } else {
      navigator.clipboard.writeText(`![](${url})`);
      showToast("Đã copy Markdown", "success");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="font-serif text-2xl font-semibold text-primary">Thư viện ảnh</h1>
        <button type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {uploading ? "Đang tải..." : "+ Tải ảnh lên"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-5">
        <div role="tablist" className="flex gap-1">
          {TABS.map((tab) => (
            <button type="button"
              key={tab.folder}
              role="tab"
              aria-selected={folder === tab.folder}
              onClick={() => { setFolder(tab.folder); setQuery(""); }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                folder === tab.folder ? "bg-accent text-white" : "text-muted hover:text-primary"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tìm theo tên ảnh..."
          className="flex-1 min-w-[180px] px-4 py-2 rounded-xl border border-border bg-background text-primary placeholder:text-muted focus:outline-none focus:border-accent text-sm"
        />
      </div>

      {loading ? (
        <p className="text-muted text-sm">Đang tải...</p>
      ) : files.length === 0 ? (
        <p className="text-muted text-sm">Chưa có ảnh nào.</p>
      ) : visible.length === 0 ? (
        <p className="text-muted text-sm">Không có ảnh nào khớp &ldquo;{query}&rdquo;.</p>
      ) : (
        <>
          <p className="text-xs text-muted mb-3">
            {visible.length === files.length ? `${files.length} ảnh` : `${visible.length}/${files.length} ảnh`}
            {total > files.length && ` (hiển thị ${files.length} ảnh mới nhất trong ${total})`}
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {visible.map((file) => {
              const users = findImageUsage(posts, file.url);
              return (
                <div key={file.url} className="bg-surface border border-border rounded-xl overflow-hidden shadow-[var(--card-shadow)] group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={file.url}
                    alt={file.name}
                    loading="lazy"
                    className="w-full aspect-video object-cover cursor-pointer"
                    onClick={() => handleSelect(file.url)}
                  />
                  <div className="p-3">
                    <p className="text-xs text-primary font-medium truncate" title={file.name}>{file.name}</p>
                    <p className="text-xs text-muted mt-0.5">
                      {formatSize(file.size)} &middot; {new Date(file.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                    <p className="mt-1">
                      <span
                        title={users.map((p) => p.title).join(", ") || undefined}
                        className={`inline-block rounded px-1.5 py-0.5 text-[0.7rem] font-semibold ${
                          users.length ? "bg-accent-light text-accent" : "bg-border text-muted"
                        }`}
                      >
                        {users.length ? `Dùng ở ${users.length} bài` : "Chưa dùng"}
                      </span>
                    </p>
                    <div className="flex gap-2 mt-2">
                      <button type="button"
                        onClick={() => handleSelect(file.url)}
                        className="flex-1 text-xs py-1 rounded-md bg-accent-light text-accent font-semibold hover:opacity-80 transition-opacity"
                      >
                        {onInsert ? "Chọn" : "Copy MD"}
                      </button>
                      {folder === "uploads" && (
                        <button type="button"
                          onClick={() => handleDelete(file)}
                          className="text-xs py-1 px-2 rounded-md bg-red-50 dark:bg-red-950 text-red-500 font-semibold hover:opacity-80 transition-opacity"
                        >
                          Xóa
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
