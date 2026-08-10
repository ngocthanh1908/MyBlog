"use client";

import { useEffect, useState, useRef } from "react";
import { useAdminAuth } from "./admin-auth-provider";
import { useToast } from "@/components/ui/toast";

interface MediaFile {
  name: string;
  url: string;
  size: number;
  createdAt: string;
}

interface MediaLibraryProps {
  /** If set, clicking an image calls this instead of copying markdown */
  onInsert?: (url: string) => void;
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function MediaLibrary({ onInsert }: MediaLibraryProps) {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const fileRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  async function fetchFiles() {
    try {
      const res = await fetch("/api/uploads", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load");
      const data = await res.json();
      setFiles(Array.isArray(data) ? data : data.files);
    } catch {
      showToast("Khong the tai danh sach file", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchFiles(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
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
      if (!res.ok) throw new Error("Upload that bai");
      showToast("Da tai len", "success");
      fetchFiles();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Loi upload", "error");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function handleDelete(name: string) {
    if (!confirm(`Xoa file "${name}"?`)) return;
    try {
      const res = await fetch(`/api/uploads/${encodeURIComponent(name)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Xoa that bai");
      setFiles((f) => f.filter((x) => x.name !== name));
      showToast("Da xoa", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Loi xoa", "error");
    }
  }

  function handleSelect(url: string) {
    if (onInsert) {
      onInsert(url);
    } else {
      navigator.clipboard.writeText(`![](${url})`);
      showToast("Da copy Markdown", "success");
    }
  }

  if (loading) return <p className="text-muted text-sm">Dang tai...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl font-semibold text-primary">Thu vien anh</h1>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="px-4 py-2 rounded-xl bg-accent text-white text-sm font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          {uploading ? "Dang tai..." : "+ Tai anh len"}
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
      </div>

      {files.length === 0 ? (
        <p className="text-muted text-sm">Chua co file nao.</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {files.map((file) => (
            <div
              key={file.name}
              className="bg-surface border border-border rounded-xl overflow-hidden shadow-[var(--card-shadow)] group"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={file.url}
                alt={file.name}
                loading="lazy"
                className="w-full h-32 object-cover cursor-pointer"
                onClick={() => handleSelect(file.url)}
              />
              <div className="p-3">
                <p className="text-xs text-primary font-medium truncate">{file.name}</p>
                <p className="text-xs text-muted mt-0.5">
                  {formatSize(file.size)} &middot; {new Date(file.createdAt).toLocaleDateString("vi-VN")}
                </p>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => handleSelect(file.url)}
                    className="flex-1 text-xs py-1 rounded-md bg-accent-light text-accent font-semibold hover:opacity-80 transition-opacity"
                  >
                    {onInsert ? "Chon" : "Copy MD"}
                  </button>
                  <button
                    onClick={() => handleDelete(file.name)}
                    className="text-xs py-1 px-2 rounded-md bg-red-50 dark:bg-red-950 text-red-500 font-semibold hover:opacity-80 transition-opacity"
                  >
                    Xoa
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
