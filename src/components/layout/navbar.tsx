"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { GitHubIcon, LinkedInIcon } from "@/components/ui/social-icons";
import { siteConfig } from "@/lib/site-config";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ExternalLink } from "@/components/ui/external-link";
import { NavLink } from "./nav-link";
import { MobileMenu } from "./mobile-menu";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border backdrop-blur-md bg-background/80">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="text-lg font-bold tracking-tight">
          {siteConfig.name}
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 lg:flex">
          {siteConfig.navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Right: socials + theme + hamburger */}
        <div className="flex items-center gap-2">
          <ExternalLink
            href={siteConfig.socialLinks.github}
            className="hidden text-muted transition-colors hover:text-primary sm:block"
            aria-label="GitHub"
          >
            <GitHubIcon size={18} />
          </ExternalLink>
          <ExternalLink
            href={siteConfig.socialLinks.linkedin}
            className="hidden text-muted transition-colors hover:text-primary sm:block"
            aria-label="LinkedIn"
          >
            <LinkedInIcon size={18} />
          </ExternalLink>
          <ThemeToggle />

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border transition-colors hover:bg-surface lg:hidden"
            aria-label="Open menu"
            aria-expanded={mobileOpen}
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      <MobileMenu isOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}
