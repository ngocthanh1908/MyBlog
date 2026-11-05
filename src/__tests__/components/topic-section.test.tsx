import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { TopicSection } from "@/components/home/topic-section";
import { siteConfig } from "@/lib/site-config";
import type { BlogPost } from "@/lib/mdx-utils";

afterEach(cleanup);

function makePost(overrides: Partial<BlogPost>): BlogPost {
  return {
    slug: "p",
    title: "P",
    date: "2026-01-01",
    tags: ["AI"],
    excerpt: "An excerpt.",
    draft: false,
    ...overrides,
  };
}

const related = [makePost({ slug: "r1", title: "Related One" }), makePost({ slug: "r2", title: "Related Two" })];

describe("TopicSection", () => {
  it("renders the topic tab linking to the filtered blog index", () => {
    render(<TopicSection topic="AI" featured={makePost({})} related={[]} />);
    expect(screen.getByRole("link", { name: "#AI" }).getAttribute("href")).toBe("/blog?tag=AI");
  });

  it("does not link the untagged topic to a tag filter that would be empty", () => {
    render(<TopicSection topic="Khác" featured={makePost({ tags: [] })} related={[]} />);
    expect(screen.queryByRole("link", { name: "#Khác" })).toBeNull();
    expect(screen.getByText("#Khác")).toBeDefined();
  });

  it("gives multi-word topics a valid labelled section", () => {
    render(<TopicSection topic="SAP ABAP" featured={makePost({})} related={[]} />);
    expect(screen.getByRole("region", { name: "#SAP ABAP" })).toBeDefined();
  });

  it("shows the featured title, full excerpt, author handle and d/m/yyyy date", () => {
    render(<TopicSection topic="AI" featured={makePost({ slug: "feat", title: "Featured", date: "2024-04-21" })} related={[]} />);
    expect(screen.getByRole("link", { name: "Featured" }).getAttribute("href")).toBe("/blog/feat");
    expect(screen.getByText("An excerpt.")).toBeDefined();
    expect(screen.getByText(siteConfig.authorHandle)).toBeDefined();
    expect(screen.getByText("21/4/2024")).toBeDefined();
  });

  it("keeps the cover image when the post has one", () => {
    render(<TopicSection topic="AI" featured={makePost({ title: "Featured", coverImage: "/images/covers/x.webp" })} related={[]} />);
    expect(screen.getByAltText("Featured").getAttribute("src")).toBe("/images/covers/x.webp");
  });

  it("falls back to the topic label cover when the post has no image", () => {
    render(<TopicSection topic="AI" featured={makePost({})} related={[]} />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("AI", { selector: "span" })).toBeDefined();
  });

  it("always lists the related posts, with no expand button", () => {
    render(<TopicSection topic="AI" featured={makePost({})} related={related} />);
    expect(screen.getByText("Bài cùng chủ đề")).toBeDefined();
    expect(screen.getByRole("link", { name: "Related One" }).getAttribute("href")).toBe("/blog/r1");
    expect(screen.getByRole("link", { name: "Related Two" })).toBeDefined();
    expect(screen.queryByRole("button")).toBeNull();
  });

  it("omits the related block when there are no related posts", () => {
    render(<TopicSection topic="AI" featured={makePost({})} related={[]} />);
    expect(screen.queryByText("Bài cùng chủ đề")).toBeNull();
  });
});
