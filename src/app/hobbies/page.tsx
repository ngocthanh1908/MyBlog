import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Footprints, Users, type LucideIcon } from "lucide-react";
import { navLinks } from "@/lib/nav-links";

/** Card icon per hobby page; unknown targets fall back to the running icon. */
const HOBBY_ICONS: Record<string, LucideIcon> = { "/nguoi-than": Users };

export const metadata: Metadata = {
  title: "Sở thích",
  description: "Những sở thích ngoài công việc của Phạm Ngọc Thanh.",
};

export default function HobbiesPage() {
  const hobbies = navLinks.find((link) => link.href === "/hobbies")?.children ?? [];

  return (
    <div className="site-container animate-slide-up">
      <section className="mb-8">
        <h1 className="font-serif text-[2.2rem] font-medium mb-2">Sở thích</h1>
        <p className="text-muted text-[1.05rem]">Những điều tôi làm ngoài công việc.</p>
      </section>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {hobbies.map((hobby) => {
          const Icon = HOBBY_ICONS[hobby.href] ?? Footprints;
          return (
          <Link
            key={hobby.href}
            href={hobby.href}
            className="group block rounded-[5px] border-2 border-card-border bg-surface p-6 no-underline shadow-[var(--card-shadow)] transition-all duration-300 hover:-translate-y-[3px] hover:border-accent-border hover:shadow-[var(--card-hover-shadow)]"
          >
            <Icon size={28} className="mb-4 text-accent" aria-hidden="true" />
            <h2 className="text-[1.3rem] font-semibold text-primary">{hobby.label}</h2>
            {hobby.description && <p className="mt-2 text-[0.98rem] leading-[1.6] text-muted">{hobby.description}</p>}
            <span className="mt-4 inline-flex items-center gap-2 text-[0.9rem] font-semibold text-accent transition-transform duration-300 group-hover:translate-x-1">
              Xem thêm <ArrowRight size={16} aria-hidden="true" />
            </span>
          </Link>
          );
        })}
      </div>
    </div>
  );
}
