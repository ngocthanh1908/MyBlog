"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { NavLink } from "./nav-link";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="max-w-[820px] mx-auto px-6">
      <div className="flex justify-between items-center py-10 pb-7 border-b border-border mb-11">
        {/* Site identity — avatar + name */}
        <Link href="/" className="flex items-center gap-4 group no-underline">
          <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-accent to-[#1b7a55] flex items-center justify-center text-white font-serif text-2xl font-semibold shadow-[0_4px_14px_rgba(12,82,56,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:-rotate-3">
            Th
          </div>
          <div>
            <h1 className="text-[1.15rem] font-extrabold tracking-tight text-primary leading-tight">
              {siteConfig.name}
            </h1>
            <p className="text-[0.83rem] text-muted">{siteConfig.subtitle}</p>
          </div>
        </Link>

        {/* Desktop nav + theme toggle */}
        <div className="hidden md:flex items-center gap-5">
          <nav className="flex gap-6" aria-label="Main navigation">
            {siteConfig.navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </nav>
          <ThemeToggle />
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="p-2 rounded-full text-primary hover:bg-accent-light transition-colors"
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </header>
  );
}
