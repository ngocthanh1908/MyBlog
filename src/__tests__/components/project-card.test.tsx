import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, within, cleanup } from "@testing-library/react";
import { ProjectCard } from "@/components/projects/project-card";
import type { Project } from "@/data/projects-data";

// framer-motion uses LazyMotion provider which is unavailable in jsdom.
// Mock `m` as a transparent passthrough so ProjectCard renders its children.
vi.mock("framer-motion", () => ({
  m: new Proxy(
    {},
    {
      get: (_target, tag: string) =>
        ({ children, ...props }: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) =>
          React.createElement(tag, props, children),
    }
  ),
  LazyMotion: ({ children }: { children: React.ReactNode }) => children,
  domAnimation: {},
}));

// Unmount after each test to prevent DOM bleed-through between renders
afterEach(cleanup);

const sampleProject: Project = {
  title: "Test Project",
  description: "A project used in unit tests.",
  techStack: ["TypeScript", "Vue"],
  links: { github: "https://github.com/test/repo" },
  featured: false,
};

const featuredProject: Project = {
  ...sampleProject,
  title: "Featured Project",
  featured: true,
};

describe("ProjectCard", () => {
  it("renders the project title", () => {
    const { container } = render(<ProjectCard project={sampleProject} />);
    expect(within(container).getByText("Test Project")).toBeDefined();
  });

  it("renders the project description", () => {
    const { container } = render(<ProjectCard project={sampleProject} />);
    expect(within(container).getByText("A project used in unit tests.")).toBeDefined();
  });

  it("renders each tech stack pill", () => {
    const { container } = render(<ProjectCard project={sampleProject} />);
    expect(within(container).getByText("TypeScript")).toBeDefined();
    expect(within(container).getByText("Vue")).toBeDefined();
  });

  it("shows Featured badge for featured projects", () => {
    const { container } = render(<ProjectCard project={featuredProject} />);
    expect(within(container).getByText("Featured")).toBeDefined();
  });

  it("does not show Featured badge for non-featured projects", () => {
    const { container } = render(<ProjectCard project={sampleProject} />);
    expect(within(container).queryByText("Featured")).toBeNull();
  });
});
