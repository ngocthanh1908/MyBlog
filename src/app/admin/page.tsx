"use client";

import { useState } from "react";
import { AdminAuthProvider, useAdminAuth } from "@/components/admin/admin-auth-provider";
import { AdminLoginModal } from "@/components/admin/admin-login-modal";
import { ArticleList } from "@/components/admin/article-list";
import { ArticleForm } from "@/components/admin/article-form";
import { MediaLibrary } from "@/components/admin/media-library";
import { TagManager } from "@/components/admin/tag-manager";
import { ToastProvider } from "@/components/ui/toast";
import type { DbPost } from "@/lib/db";

type View = "list" | "create" | "edit" | "media" | "tags";

function AdminContent() {
  const { isAuthed, logout } = useAdminAuth();
  const [view, setView] = useState<View>("list");
  const [editPost, setEditPost] = useState<DbPost | null>(null);

  if (!isAuthed) return <AdminLoginModal />;

  const tabs: { key: View; label: string }[] = [
    { key: "list", label: "Bai viet" },
    { key: "media", label: "Thu vien anh" },
    { key: "tags", label: "Tags" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <span className="font-serif text-lg font-semibold text-accent">CMS</span>
            <nav className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setView(tab.key)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                    view === tab.key || (tab.key === "list" && (view === "create" || view === "edit"))
                      ? "bg-accent text-white"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
          <button
            onClick={logout}
            className="text-sm text-muted hover:text-primary transition-colors"
          >
            Dang xuat
          </button>
        </div>

        {view === "list" && (
          <ArticleList
            onEdit={(post) => { setEditPost(post); setView("edit"); }}
            onCreate={() => { setEditPost(null); setView("create"); }}
          />
        )}

        {(view === "create" || view === "edit") && (
          <div>
            <h1 className="font-serif text-2xl font-semibold text-primary mb-6">
              {view === "create" ? "Tao bai viet moi" : "Chinh sua bai viet"}
            </h1>
            <div className="bg-surface border border-border rounded-2xl p-6 shadow-[var(--card-shadow)]">
              <ArticleForm
                post={editPost ?? undefined}
                onSuccess={() => setView("list")}
                onCancel={() => setView("list")}
              />
            </div>
          </div>
        )}

        {view === "media" && <MediaLibrary />}

        {view === "tags" && <TagManager />}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminAuthProvider>
      <ToastProvider>
        <AdminContent />
      </ToastProvider>
    </AdminAuthProvider>
  );
}
