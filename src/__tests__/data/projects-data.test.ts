import { describe, it, expect } from "vitest";
import { projects, ProjectSchema } from "@/data/projects-data";

describe("projects array", () => {
  it("is non-empty", () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it("each project validates against ProjectSchema", () => {
    for (const project of projects) {
      const result = ProjectSchema.safeParse(project);
      expect(result.success).toBe(true);
    }
  });

  it("each project has title and description as non-empty strings", () => {
    for (const project of projects) {
      expect(typeof project.title).toBe("string");
      expect(project.title.length).toBeGreaterThan(0);
      expect(typeof project.description).toBe("string");
      expect(project.description.length).toBeGreaterThan(0);
    }
  });

  it("each project has techStack as a non-empty array of strings", () => {
    for (const project of projects) {
      expect(Array.isArray(project.techStack)).toBe(true);
      expect(project.techStack.length).toBeGreaterThan(0);
      for (const tech of project.techStack) {
        expect(typeof tech).toBe("string");
      }
    }
  });

  it("each project has links as an object", () => {
    for (const project of projects) {
      expect(typeof project.links).toBe("object");
      expect(project.links).not.toBeNull();
    }
  });

  it("each project has featured as a boolean", () => {
    for (const project of projects) {
      expect(typeof project.featured).toBe("boolean");
    }
  });

  it("at least one project is featured", () => {
    const featured = projects.filter((p) => p.featured);
    expect(featured.length).toBeGreaterThan(0);
  });
});
