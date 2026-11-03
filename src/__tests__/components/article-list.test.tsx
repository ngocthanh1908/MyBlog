import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor, within } from "@testing-library/react";
import type { AdminPost } from "@/lib/admin-posts";

vi.mock("@/components/admin/admin-auth-provider", () => ({ useAdminAuth: () => ({ token: "t" }) }));
const showToast = vi.fn();
vi.mock("@/components/ui/toast", () => ({ useToast: () => ({ showToast }) }));

import { ArticleList } from "@/components/admin/article-list";

const post = (over: Partial<AdminPost>): AdminPost => ({
  slug: "a", title: "Post A", date: "2026-10-01", tags: ["AI"], excerpt: "e", content: "body",
  draft: false, read_time: 1, source: "mdx", hasMdxOriginal: true, ...over,
});

const posts: AdminPost[] = [
  post({ slug: "mdx-only", title: "MDX only post" }),
  post({ slug: "cms-only", title: "CMS only post", source: "cms", id: 1, hasMdxOriginal: false, draft: true }),
  post({ slug: "override", title: "Overridden post", source: "cms", id: 2, hasMdxOriginal: true }),
];

const fetchMock = vi.fn();
let deletedIds: number[] = [];
beforeEach(() => {
  deletedIds = [];
  fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
    if (init?.method === "DELETE") {
      deletedIds.push(Number(url.split("/").pop()));
      return { ok: true, json: async () => ({}) };
    }
    // The list is re-read after a delete, so the server no longer returns deleted rows
    return { ok: true, json: async () => posts.filter((p) => p.id === undefined || !deletedIds.includes(p.id)) };
  });
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("confirm", vi.fn(() => true));
});
afterEach(() => {
  cleanup();
  fetchMock.mockReset();
  showToast.mockClear();
  vi.unstubAllGlobals();
});

const row = (title: string) => screen.getByText(title).closest("div[class*='rounded-2xl']") as HTMLElement;

describe("ArticleList", () => {
  it("loads the merged list from the admin endpoint with the admin token", async () => {
    render(<ArticleList onEdit={() => {}} onCreate={() => {}} />);
    await screen.findByText("MDX only post");
    expect(fetchMock).toHaveBeenCalledWith("/api/admin/posts", { headers: { Authorization: "Bearer t" } });
  });

  it("labels each post by where it lives", async () => {
    render(<ArticleList onEdit={() => {}} onCreate={() => {}} />);
    await screen.findByText("MDX only post");
    expect(within(row("MDX only post")).getByText("MDX")).toBeDefined();
    expect(within(row("CMS only post")).getByText("CMS")).toBeDefined();
    expect(within(row("Overridden post")).getByText("CMS · thay bài MDX")).toBeDefined();
  });

  it("offers Sửa on every post, passing the post to onEdit", async () => {
    const onEdit = vi.fn();
    render(<ArticleList onEdit={onEdit} onCreate={() => {}} />);
    await screen.findByText("MDX only post");
    fireEvent.click(within(row("MDX only post")).getByRole("button", { name: "Sửa" }));
    expect(onEdit).toHaveBeenCalledWith(posts[0]);
  });

  it("does not offer deleting an MDX-only post (it is a file)", async () => {
    render(<ArticleList onEdit={() => {}} onCreate={() => {}} />);
    await screen.findByText("MDX only post");
    expect(within(row("MDX only post")).queryByRole("button", { name: /Xóa|Khôi phục/ })).toBeNull();
  });

  it("deletes a CMS-only post", async () => {
    render(<ArticleList onEdit={() => {}} onCreate={() => {}} />);
    await screen.findByText("CMS only post");
    fireEvent.click(within(row("CMS only post")).getByRole("button", { name: "Xóa" }));
    await waitFor(() => expect(screen.queryByText("CMS only post")).toBeNull());
    expect(fetchMock).toHaveBeenCalledWith("/api/posts/1", { method: "DELETE", headers: { Authorization: "Bearer t" } });
  });

  it("restores the MDX original by deleting the CMS override", async () => {
    render(<ArticleList onEdit={() => {}} onCreate={() => {}} />);
    await screen.findByText("Overridden post");
    expect(within(row("Overridden post")).queryByRole("button", { name: "Xóa" })).toBeNull();
    fireEvent.click(within(row("Overridden post")).getByRole("button", { name: "Khôi phục bản MDX" }));
    await waitFor(() =>
      expect(fetchMock).toHaveBeenCalledWith("/api/posts/2", { method: "DELETE", headers: { Authorization: "Bearer t" } }),
    );
  });
});
