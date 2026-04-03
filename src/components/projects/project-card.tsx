import { GitFork, ExternalLink, ArrowUpRight } from "lucide-react";
import { FadeUp } from "@/components/motion/fade-up";
import type { Project } from "@/data/projects-data";

interface ProjectCardProps {
  project: Project;
  delay?: number;
}

/** Project card with rounded-3xl design, hover lift, and tech pills */
export function ProjectCard({ project, delay = 0 }: ProjectCardProps) {
  const { title, description, techStack, links, featured } = project;

  return (
    <FadeUp delay={delay}>
      <article className="bg-surface rounded-3xl border border-border p-8 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col group">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <h2 className="text-xl font-bold leading-snug group-hover:text-accent transition-colors">
            {title}
          </h2>
          {featured && (
            <span className="shrink-0 rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent">
              Featured
            </span>
          )}
        </div>

        {/* Description */}
        <p className="text-muted leading-relaxed flex-1">{description}</p>

        {/* Tech stack pills */}
        <div className="mt-6 flex flex-wrap gap-2">
          {techStack.map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
            >
              {tech}
            </span>
          ))}
        </div>

        {/* Links */}
        {(links.github || links.demo || links.blog) && (
          <div className="mt-6 pt-6 border-t border-border/50 flex items-center gap-3">
            {links.github && (
              <a
                href={links.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`${title} GitHub repository`}
                className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
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
                className="p-2 text-muted hover:text-accent hover:bg-accent/10 rounded-full transition-colors"
              >
                <ExternalLink size={18} />
              </a>
            )}
            {links.blog && (
              <a
                href={links.blog}
                aria-label={`${title} blog post`}
                className="ml-auto flex items-center gap-1 text-sm text-accent font-semibold hover:gap-2 transition-all"
              >
                Read post
                <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        )}
      </article>
    </FadeUp>
  );
}
