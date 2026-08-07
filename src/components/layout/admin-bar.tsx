"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export function AdminBar() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(!!localStorage.getItem("admin_token"));
  }, []);

  function handleLogout() {
    localStorage.removeItem("admin_token");
    setIsAdmin(false);
    window.location.reload();
  }

  if (!isAdmin) return null;

  return (
    <div className="max-w-[820px] mx-auto px-6 mt-4 mb-5">
      <div className="bg-accent text-white py-2.5 px-6 rounded-xl flex items-center justify-between shadow-[var(--card-shadow)]">
        <div className="flex items-center gap-2.5 text-[0.88rem] font-semibold">
          <span className="bg-white/25 px-2 py-0.5 rounded text-[0.75rem] uppercase tracking-wider">
            Admin
          </span>
          <span>Che do Quan tri CMS</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="bg-white text-accent border-none px-3 py-1.5 rounded-md font-bold text-[0.82rem] no-underline hover:bg-accent-light transition-colors"
          >
            Quan ly
          </Link>
          <button
            onClick={handleLogout}
            className="bg-transparent text-white border border-white/40 px-3 py-1.5 rounded-md font-bold text-[0.82rem] cursor-pointer hover:bg-white/15 transition-colors"
          >
            Dang xuat
          </button>
        </div>
      </div>
    </div>
  );
}
