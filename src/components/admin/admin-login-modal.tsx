"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { useAdminAuth } from "./admin-auth-provider";

export function AdminLoginModal() {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(password);
    } catch {
      setError("Mật khẩu không đúng");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen onClose={() => {}} title="Đăng nhập quản trị">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-primary placeholder:text-muted focus:outline-none focus:border-accent transition-colors"
          autoFocus
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading || !password}
          className="w-full py-2.5 rounded-xl bg-accent text-white font-semibold hover:bg-accent-hover disabled:opacity-50 transition-colors"
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
    </Modal>
  );
}
