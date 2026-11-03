import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import type { BlogPost } from "@/lib/mdx-utils";

let tag: string | null = null;
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: () => {} }),
  useSearchParams: () => ({ get: (k: string) => (k === "tag" ? tag : null) }),
}));

import { BlogIndex } from "@/components/blog/blog-index";

afterEach(() => {
  cleanup();
  tag = null;
});

const post = (slug: string, tags: string[]): BlogPost => ({
  slug, title: `Title ${slug}`, date: "2026-01-01", tags, excerpt: "e", draft: false,
});
const posts = [post("a", ["AI"]), post("b", ["SAP"])];

describe("BlogIndex", () => {
  it("shows the topic blocks (including 'Tất cả') when no tag is selected", () => {
    render(<BlogIndex posts={posts} tags={["AI", "SAP"]} />);
    expect(screen.getByRole("link", { name: "Tất cả" })).toBeDefined();
    expect(screen.getByRole("link", { name: "#AI" })).toBeDefined();
    expect(screen.getByRole("link", { name: "#SAP" })).toBeDefined();
  });

  it("shows the filtered list for a selected tag instead of the blocks", () => {
    tag = "AI";
    render(<BlogIndex posts={posts} tags={["AI", "SAP"]} />);
    expect(screen.getByText("Title a")).toBeDefined();
    expect(screen.queryByText("Title b")).toBeNull();
    expect(screen.queryByRole("link", { name: "#SAP" })).toBeNull();
  });
});
