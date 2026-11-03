import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { RelatedArticles } from "@/components/blog/related-articles";
import type { BlogPost } from "@/lib/mdx-utils";

afterEach(cleanup);

function makePost(overrides: Partial<BlogPost>): BlogPost {
  return {
    slug: "sample-post",
    title: "Sample Post",
    date: "2026-01-01",
    tags: ["AI"],
    excerpt: "A sample excerpt.",
    draft: false,
    ...overrides,
  };
}

describe("RelatedArticles", () => {
  it("renders a card for each post", () => {
    const posts = [
      makePost({ slug: "post-a", title: "Post A" }),
      makePost({ slug: "post-b", title: "Post B" }),
      makePost({ slug: "post-c", title: "Post C" }),
    ];
    render(<RelatedArticles posts={posts} />);
    expect(screen.getByText("Post A")).toBeDefined();
    expect(screen.getByText("Post B")).toBeDefined();
    expect(screen.getByText("Post C")).toBeDefined();
  });

  it("links each card to /blog/{slug}", () => {
    const posts = [makePost({ slug: "post-a", title: "Post A" })];
    render(<RelatedArticles posts={posts} />);
    const link = screen.getByText("Post A").closest("a");
    expect(link?.getAttribute("href")).toBe("/blog/post-a");
  });

  it("renders the heading when there is at least one post", () => {
    render(<RelatedArticles posts={[makePost({})]} />);
    expect(screen.getByText("Bài viết liên quan")).toBeDefined();
  });

  it("renders nothing, not even the heading, for an empty array", () => {
    const { container } = render(<RelatedArticles posts={[]} />);
    expect(container.innerHTML).toBe("");
  });
});
