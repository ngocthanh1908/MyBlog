"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef, type ReactNode } from "react";

interface AdminAuthContextValue {
  token: string | null;
  isAuthed: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

const TOKEN_KEY = "admin_token";

function getTokenExpiry(token: string): number {
  try {
    const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
    return payload.exp * 1000;
  } catch {
    return 0;
  }
}

function isTokenValid(token: string): boolean {
  return getTokenExpiry(token) > Date.now();
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const refreshTimer = useRef<ReturnType<typeof setTimeout>>(null);

  function scheduleRefresh(accessToken: string) {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    const expiry = getTokenExpiry(accessToken);
    // Refresh 60 seconds before expiry
    const delay = Math.max(0, expiry - Date.now() - 60_000);
    refreshTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
        if (!res.ok) throw new Error("Refresh failed");
        const { token: newToken } = await res.json();
        localStorage.setItem(TOKEN_KEY, newToken);
        setToken(newToken);
        scheduleRefresh(newToken);
      } catch {
        // Refresh failed — force logout
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      }
    }, delay);
  }

  useEffect(() => {
    const stored = localStorage.getItem(TOKEN_KEY);
    if (stored && isTokenValid(stored)) {
      setToken(stored);
      scheduleRefresh(stored);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }
    return () => { if (refreshTimer.current) clearTimeout(refreshTimer.current); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const login = useCallback(async (password: string) => {
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include",
    });
    if (!res.ok) throw new Error("Mat khau khong dung");
    const { token: t } = await res.json();
    localStorage.setItem(TOKEN_KEY, t);
    setToken(t);
    scheduleRefresh(t);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const logout = useCallback(() => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
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
