"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { NavLink } from "./nav-link";
import { MobileMenu } from "./mobile-menu";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { GitHubIcon } from "@/components/ui/social-icons";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-surface/70 dark:bg-surface/80 border-b border-border/80 transition-all duration-300">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-gradient-to-br from-accent to-blue-400 dark:to-blue-300 text-white rounded-xl flex items-center justify-center font-extrabold text-lg shadow-md group-hover:rotate-6 transition-transform">
              P
            </div>
            <span className="text-xl font-bold text-primary tracking-tight">
              {siteConfig.name.split(" ").slice(-2).join(" ")}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-1">
            {siteConfig.navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Desktop Right */}
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <a
              href={siteConfig.socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 text-muted hover:text-accent rounded-full hover:bg-accent/10 transition-colors"
              aria-label="GitHub"
            >
              <GitHubIcon size={18} />
            </a>
            <Link
              href="/about"
              className="bg-primary dark:bg-accent hover:bg-accent dark:hover:bg-accent/80 text-white dark:text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md hover:shadow-lg"
            >
              Contact
            </Link>
          </div>

          {/* Mobile Right */}
          <div className="flex md:hidden items-center gap-2">
            <ThemeToggle />
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-full text-primary hover:bg-surface transition-colors"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </nav>
  );
}
