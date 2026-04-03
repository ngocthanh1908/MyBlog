import type { Metadata } from "next";
import { FadeUp } from "@/components/motion/fade-up";
import { projects } from "@/data/projects-data";
import { ProjectCard } from "@/components/projects/project-card";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A selection of projects I have built — spanning SAP integrations, AI tooling, and open-source web work.",
  openGraph: {
    images: [
      {
        url: "/og?title=Projects&description=SAP+integrations%2C+AI+tooling%2C+and+open-source+web+work",
        width: 1200,
        height: 630,
      },
    ],
  },
};

export default function ProjectsPage() {
  const sorted = [...projects].sort((a, b) => {
    if (a.featured === b.featured) return a.title.localeCompare(b.title);
    return a.featured ? -1 : 1;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      {/* Header */}
      <FadeUp>
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border shadow-sm mb-6">
            <span className="flex h-2 w-2 rounded-full bg-accent" />
            <span className="text-xs font-medium text-muted">Portfolio</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-primary tracking-tight leading-[1.1] mb-4">
            Projects
          </h1>
          <p className="text-lg text-muted leading-relaxed">
            Things I have built, shipped, or explored — from enterprise SAP
            integrations to AI-powered tools and this very blog.
          </p>
        </div>
      </FadeUp>

      {/* Grid */}
      <div className="grid gap-8 sm:grid-cols-2">
        {sorted.map((project, index) => (
          <ProjectCard
            key={project.title}
            project={project}
            delay={index * 0.08}
          />
        ))}
      </div>
    </div>
  );
}
