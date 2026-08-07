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
    <div className="bg-accent text-white text-[0.82rem] font-semibold px-4 py-1.5 flex items-center justify-between z-50">
      <span>Admin</span>
      <div className="flex items-center gap-4">
        <Link href="/admin" className="text-white hover:underline no-underline">
          Quan ly
        </Link>
        <button onClick={handleLogout} className="text-white/80 hover:text-white cursor-pointer">
          Dang xuat
        </button>
      </div>
    </div>
  );
}
