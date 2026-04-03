"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

export function NavLink({ href, children, onClick }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
        isActive
          ? "text-accent bg-accent/10 font-semibold"
          : "text-muted hover:text-primary hover:bg-surface"
      }`}
    >
      {children}
    </Link>
  );
}
