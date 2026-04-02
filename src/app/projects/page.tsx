import type { Metadata } from "next";
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

/** Projects page — server component, no client JS required */
export default function ProjectsPage() {
  // Featured projects first, then alphabetical
  const sorted = [...projects].sort((a, b) => {
    if (a.featured === b.featured) return a.title.localeCompare(b.title);
    return a.featured ? -1 : 1;
  });

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      {/* Heading */}
      <h1 className="text-3xl font-bold">Projects</h1>
      <p className="mt-3 max-w-2xl text-muted">
        Things I have built, shipped, or explored — from enterprise SAP
        integrations to AI-powered tools and this very blog.
      </p>

      {/* Grid */}
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
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
