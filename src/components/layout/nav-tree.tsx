"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, ChevronDown, Footprints, Heart, Home, Rss, User, Users, type LucideIcon } from "lucide-react";
import { navLinks, isNavLinkActive, type NavLink } from "@/lib/nav-links";

/** Icon per nav target; unknown targets fall back to the book icon. */
const ICONS: Record<string, LucideIcon> = {
  "/": Home,
  "/blog": BookOpen,
  "/about": User,
  "/rss.xml": Rss,
  "/hobbies": Heart,
  "/habits": Footprints,
  "/nguoi-than": Users,
};

const HOME: NavLink = { label: "Trang chủ", href: "/" };

const rowClass = (active: boolean) =>
  `flex items-center gap-3 rounded-md px-2 py-1.5 text-[0.95rem] no-underline transition-colors hover:underline ${
    active ? "font-semibold text-primary" : "text-muted hover:text-primary"
  }`;

function NavItem({ link, pathname, onNavigate }: { link: NavLink; pathname: string; onNavigate?: () => void }) {
  const Icon = ICONS[link.href] ?? BookOpen;
  const active = link.href === "/" ? pathname === "/" : isNavLinkActive(link, pathname);
  const hasChildren = !!link.children?.length;
  // Children stay hidden until the group is opened, except while one of them is the current page.
  const [open, setOpen] = useState(active && hasChildren);
  useEffect(() => {
    if (active && hasChildren) setOpen(true);
  }, [active, hasChildren]);

  return (
    <li>
      <div className="flex items-center">
        <Link
          href={link.href}
          aria-current={active ? "page" : undefined}
          onClick={() => {
            if (hasChildren && pathname === link.href) {
              // Already on this page: only toggle the group (and keep a mobile drawer open so the change is visible).
              setOpen((v) => !v);
              return;
            }
            // First choice navigates here and opens the group.
            if (hasChildren) setOpen(true);
            onNavigate?.();
          }}
          className={`${rowClass(active)} flex-1`}
        >
          <Icon size={18} aria-hidden="true" />
          {link.label}
        </Link>
        {hasChildren && (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={`nav-children-${link.href}`}
            aria-label={`${open ? "Thu gọn" : "Mở rộng"} ${link.label}`}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md p-1.5 text-muted transition-colors hover:text-primary"
          >
            <ChevronDown size={16} aria-hidden="true" className={`transition-transform ${open ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>
      {hasChildren && open && (
        <ul id={`nav-children-${link.href}`} className="ml-5 mt-1 flex flex-col gap-1 border-l border-border pl-2">
          {link.children!.map((child) => (
            <NavItem key={child.href} link={child} pathname={pathname} onNavigate={onNavigate} />
          ))}
        </ul>
      )}
    </li>
  );
}

/** Site navigation as a list: Trang chủ, then the configured links; groups expand on demand. */
export function NavTree({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <ul className="flex flex-col gap-1">
      {[HOME, ...navLinks].map((link) => (
        <NavItem key={link.href} link={link} pathname={pathname} onNavigate={onNavigate} />
      ))}
    </ul>
  );
}
