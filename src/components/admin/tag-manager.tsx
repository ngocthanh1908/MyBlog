"use client";

import { useEffect, useState } from "react";
import { useAdminAuth } from "./admin-auth-provider";
import { useToast } from "@/components/ui/toast";

interface TagInfo {
  name: string;
  count: number;
}

export function TagManager() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [tags, setTags] = useState<TagInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<string | null>(null);
  const [newName, setNewName] = useState("");

  async function fetchTags() {
    try {
      const res = await fetch("/api/tags", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed");
      setTags(await res.json());
    } catch {
      showToast("Khong the tai tags", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchTags(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleRename(oldName: string) {
    if (!newName.trim() || newName.trim() === oldName) {
      setEditing(null);
      return;
    }
    try {
      const res = await fetch(`/api/tags/${encodeURIComponent(oldName)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ newName: newName.trim() }),
      });
      if (!res.ok) throw new Error("Rename failed");
      showToast("Da doi ten tag", "success");
      setEditing(null);
      fetchTags();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Loi", "error");
    }
  }

  async function handleDelete(name: string) {
    if (!confirm(`Xoa tag "${name}" khoi tat ca bai viet?`)) return;
    try {
      const res = await fetch(`/api/tags/${encodeURIComponent(name)}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Delete failed");
      setTags((t) => t.filter((x) => x.name !== name));
      showToast("Da xoa tag", "success");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Loi", "error");
    }
  }

  if (loading) return <p className="text-muted text-sm">Dang tai...</p>;

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-primary mb-6">Quan ly tags</h1>
      {tags.length === 0 ? (
        <p className="text-muted text-sm">Chua co tag nao.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {tags.map((tag) => (
            <div
              key={tag.name}
              className="flex items-center justify-between bg-surface border border-border rounded-xl px-5 py-3 shadow-[var(--card-shadow)]"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {editing === tag.name ? (
                  <input
                    autoFocus
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleRename(tag.name);
                      if (e.key === "Escape") setEditing(null);
                    }}
                    className="px-3 py-1 rounded-lg border border-accent bg-background text-primary text-sm outline-none w-48"
                  />
                ) : (
                  <span className="font-semibold text-primary truncate">{tag.name}</span>
                )}
                <span className="text-xs text-muted bg-background px-2 py-0.5 rounded-md shrink-0">
                  {tag.count} bai viet
                </span>
              </div>
              <div className="flex gap-2 shrink-0 ml-3">
                {editing === tag.name ? (
                  <button
                    onClick={() => handleRename(tag.name)}
                    className="px-3 py-1.5 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors"
                  >
                    Luu
                  </button>
                ) : (
                  <button
                    onClick={() => { setEditing(tag.name); setNewName(tag.name); }}
                    className="px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-primary hover:border-accent hover:text-accent transition-colors"
                  >
                    Doi ten
                  </button>
                )}
                <button
                  onClick={() => handleDelete(tag.name)}
                  className="px-3 py-1.5 rounded-lg border border-red-300 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
                >
                  Xoa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
