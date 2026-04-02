import { GitFork, ExternalLink } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import type { Project } from "@/data/projects-data";

interface ProjectCardProps {
  project: Project;
  delay?: number;
}

/** Server component — renders a single project card with tech pills and links */
export function ProjectCard({ project, delay = 0 }: ProjectCardProps) {
  const { title, description, techStack, links, featured } = project;

  return (
    <FadeUp delay={delay}>
      <article
        className={[
          "rounded-2xl border bg-surface p-6 transition-colors duration-300 hover:border-accent h-full flex flex-col",
          featured ? "border-accent/50" : "border-border",
        ].join(" ")}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <h2 className="text-lg font-bold leading-snug">{title}</h2>
          {featured && (
            <span className="shrink-0 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-medium text-accent">
              Featured
            </span>
          )}
        </div>

        {/* Description */}
        <p className="mt-3 text-sm text-muted flex-1">{description}</p>

        {/* Tech stack pills */}
        <div className="mt-4 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-accent/10 px-2 py-1 text-xs text-accent"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        {(links.github || links.demo || links.blog) && (
          <div className="mt-4 flex items-center gap-3">
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} GitHub repository`}
                className="text-muted transition-colors hover:text-accent"
              >
                <GitFork size={18} />
              </a>
            )}
            {links.demo && (
              <a
                href={links.demo}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} live demo`}
                className="text-muted transition-colors hover:text-accent"
              >
                <ExternalLink size={18} />
              </a>
            )}
            {links.blog && (
              <a
                href={links.blog}
                aria-label={`${title} blog post`}
                className="text-xs text-muted transition-colors hover:text-accent"
              >
                Read post →
              </a>
            )}
          </div>
        )}
      </article>
    </FadeUp>
  );
}
