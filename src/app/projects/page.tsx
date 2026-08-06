import type { Metadata } from "next";
import { projects } from "@/data/projects-data";
import { ProjectCard } from "@/components/projects/project-card";

export const metadata: Metadata = {
  title: "Dự án",
  description:
    "Các dự án cá nhân về SAP, AI và phát triển web.",
  openGraph: {
    images: [
      {
        url: "/og?title=Dự+án&description=Các+dự+án+cá+nhân",
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
    <div className="max-w-[820px] mx-auto px-6 animate-slide-up">
      <section className="mb-11 bg-surface p-9 rounded-[20px] border border-border shadow-[var(--card-shadow)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1.5 h-full bg-accent" />
        <h2 className="font-serif text-[2.2rem] font-medium mb-4">Dự án</h2>
        <p className="text-muted text-[1.05rem]">
          Các dự án cá nhân về SAP, AI và phát triển web.
        </p>
      </section>

      <div className="grid gap-8 sm:grid-cols-2 mb-12">
        {sorted.map((project, index) => (
          <ProjectCard key={project.title} project={project} delay={index * 0.08} />
        ))}
      </div>
    </div>
  );
}
