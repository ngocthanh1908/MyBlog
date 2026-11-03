import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { TopicSection } from "@/components/home/topic-section";
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

describe("TopicSection", () => {
  it("renders topic heading linking to the filtered blog index", () => {
    render(<TopicSection topic="AI" featured={makePost({ title: "Featured" })} related={[]} total={1} />);
    const link = screen.getByRole("link", { name: "#AI" });
    expect(link.getAttribute("href")).toBe("/blog?tag=AI");
  });

  it("does not link the untagged topic to a tag filter that would be empty", () => {
    render(<TopicSection topic="Khác" featured={makePost({ tags: [] })} related={[]} total={1} />);
    expect(screen.queryByRole("link", { name: "#Khác" })).toBeNull();
    expect(screen.getByText("#Khác")).toBeDefined();
  });

  it("labels the all-posts block without a hashtag and links to the unfiltered index", () => {
    render(<TopicSection topic="Tất cả" featured={makePost({})} related={[makePost({ slug: "r", title: "R" })]} total={2} />);
    expect(screen.getByRole("link", { name: "Tất cả" }).getAttribute("href")).toBe("/blog");
    expect(screen.getByText("Các bài khác")).toBeDefined();
  });

  it("gives multi-word topics a valid labelled section", () => {
    render(<TopicSection topic="SAP ABAP" featured={makePost({})} related={[]} total={1} />);
    expect(screen.getByRole("region", { name: "#SAP ABAP" })).toBeDefined();
  });

  it("renders the featured title, excerpt and link", () => {
    render(<TopicSection topic="AI" featured={makePost({ slug: "feat", title: "Featured" })} related={[]} total={1} />);
    const link = screen.getByRole("link", { name: /Featured/ });
    expect(link.getAttribute("href")).toBe("/blog/feat");
    expect(screen.getByText("An excerpt.")).toBeDefined();
  });

  it("renders fallback cover (topic label) when no coverImage", () => {
    render(<TopicSection topic="Running" featured={makePost({ tags: ["Running"] })} related={[]} total={1} />);
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("renders the related list with links when present", () => {
    render(
      <TopicSection
        topic="AI"
        featured={makePost({ title: "F" })}
        related={[makePost({ slug: "r1", title: "Related One" }), makePost({ slug: "r2", title: "Related Two" })]}
        total={3}
      />
    );
    expect(screen.getByText("Bài cùng chủ đề")).toBeDefined();
    expect(screen.getByRole("link", { name: "Related One" }).getAttribute("href")).toBe("/blog/r1");
    expect(screen.getByRole("link", { name: "Related Two" })).toBeDefined();
  });

  it("omits the related list when there are no related posts", () => {
    render(<TopicSection topic="AI" featured={makePost({})} related={[]} total={1} />);
    expect(screen.queryByText("Bài cùng chủ đề")).toBeNull();
  });
});
