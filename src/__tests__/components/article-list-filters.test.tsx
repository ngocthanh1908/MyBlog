import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import type { AdminPost } from "@/lib/admin-posts";

vi.mock("@/components/admin/admin-auth-provider", () => ({ useAdminAuth: () => ({ token: "t" }) }));
vi.mock("@/components/ui/toast", () => ({ useToast: () => ({ showToast: () => {} }) }));

import { ArticleList } from "@/components/admin/article-list";

const post = (over: Partial<AdminPost>): AdminPost => ({
  slug: "a", title: "Post A", date: "2026-10-01", tags: [], excerpt: "", content: "", draft: false,
  read_time: 1, source: "mdx", hasMdxOriginal: true, ...over,
});

const posts: AdminPost[] = [
  post({ slug: "rag", title: "RAG là gì", tags: ["AI"], excerpt: "Cho AI đọc tài liệu", cover_image: "/images/covers/rag.webp" }),
  post({ slug: "basis", title: "SAP Basis làm gì", tags: ["SAP"], draft: true, source: "cms", id: 1, hasMdxOriginal: false }),
  post({ slug: "slow", title: "Chạy chậm để chạy xa", tags: ["Running", "Mindfulness"] }),
];

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async () => ({ ok: true, json: async () => posts })));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

const setup = async () => {
  render(<ArticleList onEdit={() => {}} onCreate={() => {}} />);
  await screen.findByText("RAG là gì");
};
const titles = () => screen.queryAllByText(/RAG là gì|SAP Basis làm gì|Chạy chậm để chạy xa/).map((e) => e.textContent);

describe("ArticleList filters", () => {
  it("shows every post and the total before any filter is applied", async () => {
    await setup();
    expect(titles()).toHaveLength(3);
    expect(screen.getByText("3 bài")).toBeDefined();
    expect(screen.queryByRole("button", { name: "Xóa bộ lọc" })).toBeNull();
  });

  it("searches without caring about diacritics", async () => {
    await setup();
    fireEvent.change(screen.getByPlaceholderText("Tìm bài viết..."), { target: { value: "chay xa" } });
    expect(titles()).toEqual(["Chạy chậm để chạy xa"]);
    expect(screen.getByText("1/3 bài")).toBeDefined();
  });

  it("filters by tag, offering only tags that exist", async () => {
    await setup();
    const tagSelect = screen.getByLabelText("Lọc theo tag") as HTMLSelectElement;
    expect([...tagSelect.options].map((o) => o.value)).toEqual(["", "AI", "Mindfulness", "Running", "SAP"]);
    fireEvent.change(tagSelect, { target: { value: "Mindfulness" } });
    expect(titles()).toEqual(["Chạy chậm để chạy xa"]);
  });

  it("filters by status", async () => {
    await setup();
    fireEvent.change(screen.getByLabelText("Lọc theo trạng thái"), { target: { value: "draft" } });
    expect(titles()).toEqual(["SAP Basis làm gì"]);
    fireEvent.change(screen.getByLabelText("Lọc theo trạng thái"), { target: { value: "published" } });
    expect(titles()).toHaveLength(2);
  });

  it("filters by source", async () => {
    await setup();
    fireEvent.change(screen.getByLabelText("Lọc theo nguồn"), { target: { value: "cms" } });
    expect(titles()).toEqual(["SAP Basis làm gì"]);
  });

  it("combines filters and explains an empty result", async () => {
    await setup();
    fireEvent.change(screen.getByLabelText("Lọc theo tag"), { target: { value: "AI" } });
    fireEvent.change(screen.getByLabelText("Lọc theo trạng thái"), { target: { value: "draft" } });
    expect(titles()).toHaveLength(0);
    expect(screen.getByText(/Không có bài nào khớp/)).toBeDefined();
  });

  it("clears all filters at once", async () => {
    await setup();
    fireEvent.change(screen.getByPlaceholderText("Tìm bài viết..."), { target: { value: "zzz" } });
    fireEvent.change(screen.getByLabelText("Lọc theo tag"), { target: { value: "AI" } });
    fireEvent.click(screen.getByRole("button", { name: "Xóa bộ lọc" }));
    expect(titles()).toHaveLength(3);
    expect((screen.getByPlaceholderText("Tìm bài viết...") as HTMLInputElement).value).toBe("");
    expect((screen.getByLabelText("Lọc theo tag") as HTMLSelectElement).value).toBe("");
  });
});

describe("ArticleList thumbnails", () => {
  it("shows the cover of posts that have one, and a placeholder for the rest", async () => {
    await setup();
    const thumbs = document.querySelectorAll("img");
    expect([...thumbs].map((i) => i.getAttribute("src"))).toEqual(["/images/covers/rag.webp"]);
    expect(screen.getAllByTestId("no-cover")).toHaveLength(2);
  });
});
