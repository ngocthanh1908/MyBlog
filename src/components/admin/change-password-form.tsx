"use client";

import { useState, type FormEvent } from "react";
import { useAdminAuth } from "./admin-auth-provider";
import { useToast } from "@/components/ui/toast";

const MIN_NEW_PASSWORD_LENGTH = 8;

export function ChangePasswordForm() {
  const { token } = useAdminAuth();
  const { showToast } = useToast();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  function resetFields() {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (newPassword.length < MIN_NEW_PASSWORD_LENGTH) {
      showToast(`Mat khau moi phai co it nhat ${MIN_NEW_PASSWORD_LENGTH} ky tu`, "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("Mat khau moi khong khop", "error");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Doi mat khau that bai");

      showToast("Da doi mat khau", "success");
      resetFields();
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Loi", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h1 className="font-serif text-2xl font-semibold text-primary mb-6">Doi mat khau</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-surface border border-border rounded-2xl p-6 shadow-[var(--card-shadow)] flex flex-col gap-4 max-w-md"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-primary">Mat khau hien tai</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background text-primary text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-primary">Mat khau moi</span>
          <input
            type="password"
            required
            minLength={MIN_NEW_PASSWORD_LENGTH}
            autoComplete="new-password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background text-primary text-sm outline-none focus:border-accent"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-primary">Xac nhan mat khau moi</span>
          <input
            type="password"
            required
            minLength={MIN_NEW_PASSWORD_LENGTH}
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="px-3 py-2 rounded-lg border border-border bg-background text-primary text-sm outline-none focus:border-accent"
          />
        </label>

        <button
          type="submit"
          disabled={saving}
          className="self-start px-4 py-2 rounded-lg bg-accent text-white text-sm font-medium hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {saving ? "Dang luu..." : "Doi mat khau"}
        </button>
      </form>
    </div>
  );
}
