"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

interface AdminAuthContextValue {
  token: string | null;
  isAuthed: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const TOKEN_KEY = "admin_token";

function isTokenValid(token: string): boolean {
  try {
    // JWT payload is base64url-encoded middle segment
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored && isTokenValid(stored)) setToken(stored);
    else localStorage.removeItem(TOKEN_KEY);
  }, []);

  const login = useCallback(async (password: string) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!res.ok) throw new Error("Mật khẩu không đúng");
    const { token: t } = await res.json();
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  }, []);

  return (
    <AdminAuthContext.Provider value={{ token, isAuthed: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be inside AdminAuthProvider");
  return ctx;
}
