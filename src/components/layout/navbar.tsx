"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { MobileMenu } from "./mobile-menu";
import { NavTree } from "./nav-tree";
import { ThemeToggle } from "@/components/ui/theme-toggle";

/** The t{ logo opens the admin area (login form when signed out). */
function Wordmark() {
  return (
    <Link href="/admin" className="inline-flex no-underline" aria-label="Trang quản trị">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-md bg-primary font-mono text-[1.6rem] font-bold leading-none tracking-tight text-background">
        t{"{"}
      </span>
    </Link>
  );
}

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile / tablet: top bar */}
      <header className="site-container lg:hidden">
        <div className="mb-8 flex items-center justify-between border-b border-border py-4">
          <div className="flex items-center gap-3">
            <Wordmark />
            <Link href="/" className="text-[1rem] font-semibold text-primary no-underline">
              {siteConfig.name}
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-full p-2 text-primary transition-colors hover:bg-accent-light"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
        <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      </header>

      {/* Desktop: sticky sidebar */}
      <aside className="hidden self-start p-4 lg:sticky lg:top-0 lg:block">
        <Wordmark />
        <nav className="mt-8" aria-label="Main navigation">
          <NavTree />
        </nav>
        <div className="mt-6 px-1">
          <ThemeToggle />
        </div>
      </aside>
    </>
  );
}
