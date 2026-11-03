import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor, within } from "@testing-library/react";
import type { AdminPost } from "@/lib/admin-posts";

vi.mock("@/components/admin/admin-auth-provider", () => ({ useAdminAuth: () => ({ token: "t" }) }));
const showToast = vi.fn();
vi.mock("@/components/ui/toast", () => ({ useToast: () => ({ showToast }) }));

import { MediaLibrary } from "@/components/admin/media-library";

const file = (name: string, folder = "uploads") => ({
  name, url: `${folder === "covers" ? "/images/covers" : "/uploads"}/${name}`, size: 2048, createdAt: "2026-10-01T00:00:00Z",
});
let uploads = [file("1-cat.webp"), file("2-dog.webp"), file("3-bird.webp")];
const covers = [file("rag-la-gi.webp", "covers"), file("sap-basis.webp", "covers")];

const posts: AdminPost[] = [
  { slug: "a", title: "Bài A", date: "2026-10-01", tags: [], excerpt: "", content: "", draft: false, read_time: 1, source: "mdx", hasMdxOriginal: true, cover_image: "/uploads/1-cat.webp" },
  { slug: "b", title: "Bài B", date: "2026-10-02", tags: [], excerpt: "", content: "![](/uploads/1-cat.webp)", draft: false, read_time: 1, source: "mdx", hasMdxOriginal: true },
];

const fetchMock = vi.fn();
const confirmMock = vi.fn(() => true);
beforeEach(() => {
  uploads = [file("1-cat.webp"), file("2-dog.webp"), file("3-bird.webp")];
  fetchMock.mockImplementation(async (url: string, init?: RequestInit) => {
    if (url.startsWith("/api/uploads?folder=covers")) return { ok: true, json: async () => ({ files: covers, total: covers.length }) };
    if (url.startsWith("/api/uploads?folder=uploads")) return { ok: true, json: async () => ({ files: uploads, total: uploads.length }) };
    if (url === "/api/admin/posts") return { ok: true, json: async () => posts };
    if (url === "/api/upload") return { ok: true, json: async () => ({ url: "/uploads/new.webp" }) };
    if (init?.method === "DELETE") return { ok: true, json: async () => ({}) };
    return { ok: false, json: async () => ({}) };
  });
  vi.stubGlobal("fetch", fetchMock);
  vi.stubGlobal("confirm", confirmMock);
});
afterEach(() => {
  cleanup();
  fetchMock.mockReset();
  confirmMock.mockClear();
  showToast.mockClear();
  vi.unstubAllGlobals();
});

const card = (name: string) => screen.getByAltText(name).closest("div[class*='rounded-xl']") as HTMLElement;

describe("MediaLibrary", () => {
  it("lists the uploaded images by default, with Vietnamese labels", async () => {
    render(<MediaLibrary />);
    await screen.findByAltText("1-cat.webp");
    expect(screen.getByRole("heading", { name: "Thư viện ảnh" })).toBeDefined();
    expect(screen.getByRole("tab", { name: "Ảnh đã tải lên" }).getAttribute("aria-selected")).toBe("true");
  });

  it("filters by file name as you type", async () => {
    render(<MediaLibrary />);
    await screen.findByAltText("1-cat.webp");
    fireEvent.change(screen.getByPlaceholderText("Tìm theo tên ảnh..."), { target: { value: "DOG" } });
    expect(screen.queryByAltText("1-cat.webp")).toBeNull();
    expect(screen.getByAltText("2-dog.webp")).toBeDefined();
    fireEvent.change(screen.getByPlaceholderText("Tìm theo tên ảnh..."), { target: { value: "zzz" } });
    expect(screen.getByText(/Không có ảnh nào khớp/)).toBeDefined();
  });

  it("shows how many posts use each image", async () => {
    render(<MediaLibrary />);
    await screen.findByAltText("1-cat.webp");
    await waitFor(() => expect(within(card("1-cat.webp")).getByText("Dùng ở 2 bài")).toBeDefined());
    expect(within(card("2-dog.webp")).getByText("Chưa dùng")).toBeDefined();
  });

  it("warns with the post titles before deleting an image that is in use", async () => {
    render(<MediaLibrary />);
    await screen.findByAltText("1-cat.webp");
    await waitFor(() => within(card("1-cat.webp")).getByText("Dùng ở 2 bài"));
    fireEvent.click(within(card("1-cat.webp")).getByRole("button", { name: "Xóa" }));
    expect(confirmMock).toHaveBeenCalledTimes(1);
    const question = (confirmMock.mock.calls[0] as unknown as string[])[0];
    expect(question).toContain("Bài A");
    expect(question).toContain("Bài B");
  });

  it("deletes an unused image after confirmation", async () => {
    render(<MediaLibrary />);
    await screen.findByAltText("2-dog.webp");
    await waitFor(() => within(card("2-dog.webp")).getByText("Chưa dùng"));
    fireEvent.click(within(card("2-dog.webp")).getByRole("button", { name: "Xóa" }));
    await waitFor(() => expect(screen.queryByAltText("2-dog.webp")).toBeNull());
    expect(fetchMock).toHaveBeenCalledWith("/api/uploads/2-dog.webp", { method: "DELETE", headers: { Authorization: "Bearer t" } });
  });

  it("keeps the image when the delete confirmation is declined", async () => {
    confirmMock.mockReturnValueOnce(false);
    render(<MediaLibrary />);
    await screen.findByAltText("2-dog.webp");
    fireEvent.click(within(card("2-dog.webp")).getByRole("button", { name: "Xóa" }));
    expect(screen.getByAltText("2-dog.webp")).toBeDefined();
    expect(fetchMock).not.toHaveBeenCalledWith("/api/uploads/2-dog.webp", expect.anything());
  });

  it("offers the built-in illustrations on a second tab, read-only", async () => {
    render(<MediaLibrary />);
    await screen.findByAltText("1-cat.webp");
    fireEvent.click(screen.getByRole("tab", { name: "Ảnh minh họa có sẵn" }));
    await screen.findByAltText("rag-la-gi.webp");
    expect(screen.queryByAltText("1-cat.webp")).toBeNull();
    expect(within(card("rag-la-gi.webp")).queryByRole("button", { name: "Xóa" })).toBeNull();
  });

  it("calls onInsert with the image URL, from either tab", async () => {
    const onInsert = vi.fn();
    render(<MediaLibrary onInsert={onInsert} />);
    await screen.findByAltText("1-cat.webp");
    fireEvent.click(within(card("1-cat.webp")).getByRole("button", { name: "Chọn" }));
    expect(onInsert).toHaveBeenLastCalledWith("/uploads/1-cat.webp");
    fireEvent.click(screen.getByRole("tab", { name: "Ảnh minh họa có sẵn" }));
    await screen.findByAltText("sap-basis.webp");
    fireEvent.click(within(card("sap-basis.webp")).getByRole("button", { name: "Chọn" }));
    expect(onInsert).toHaveBeenLastCalledWith("/images/covers/sap-basis.webp");
  });

  it("uploads several files at once and refreshes the list", async () => {
    const { container } = render(<MediaLibrary />);
    await screen.findByAltText("1-cat.webp");
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input.multiple).toBe(true);
    fireEvent.change(input, { target: { files: [new File(["a"], "a.png", { type: "image/png" }), new File(["b"], "b.png", { type: "image/png" })] } });
    await waitFor(() => expect(fetchMock.mock.calls.filter(([u]) => u === "/api/upload")).toHaveLength(2));
    await waitFor(() => expect(showToast).toHaveBeenCalledWith(expect.stringContaining("2"), "success"));
  });
});
