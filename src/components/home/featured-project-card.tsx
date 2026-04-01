import Link from "next/link";
import { ExternalLink as LinkIcon } from "lucide-react";
import { BentoCard } from "./bento-card";

export function FeaturedProjectCard() {
  return (
    <BentoCard className="flex h-full flex-col justify-between" delay={0.1}>
      {/* Placeholder image area */}
      <div className="mb-4 aspect-video rounded-xl bg-background" />

      <div>
        <h3 className="text-lg font-bold">Featured Web App</h3>
        <p className="mt-2 text-sm text-muted">
          A full-stack application showcasing modern web development with
          Next.js, TypeScript, and cloud infrastructure.
        </p>

        <div className="mt-3 flex flex-wrap gap-2">
          {["Next.js", "TypeScript", "Tailwind"].map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-background px-2 py-1 text-xs text-muted"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <Link
        href="/projects"
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
      >
        View Project <LinkIcon size={14} />
      </Link>
    </BentoCard>
  );
}
