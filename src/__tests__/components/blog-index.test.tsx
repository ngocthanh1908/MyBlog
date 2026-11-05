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
  it("shows one card per topic and no 'Tất cả' card when no tag is selected", () => {
    render(<BlogIndex posts={posts} tags={["AI", "SAP"]} />);
    expect(screen.getByRole("link", { name: "#AI" })).toBeDefined();
    expect(screen.getByRole("link", { name: "#SAP" })).toBeDefined();
    expect(screen.queryByRole("link", { name: "Tất cả" })).toBeNull();
    expect(screen.queryByRole("button", { name: /Xem thêm/ })).toBeNull();
  });

  it("shows the search box by default and hides it with showSearch={false}", () => {
    const { rerender } = render(<BlogIndex posts={posts} tags={["AI", "SAP"]} />);
    expect(screen.getByPlaceholderText(/Tim kiem/)).toBeDefined();
    rerender(<BlogIndex posts={posts} tags={["AI", "SAP"]} showSearch={false} />);
    expect(screen.queryByPlaceholderText(/Tim kiem/)).toBeNull();
  });

  it("shows the filtered list for a selected tag instead of the cards", () => {
    tag = "AI";
    render(<BlogIndex posts={posts} tags={["AI", "SAP"]} />);
    expect(screen.getByText("Title a")).toBeDefined();
    expect(screen.queryByText("Title b")).toBeNull();
    expect(screen.queryByRole("link", { name: "#SAP" })).toBeNull();
  });
});
