import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";
import type { AdminPost } from "@/lib/admin-posts";

vi.mock("@/components/admin/admin-auth-provider", () => ({ useAdminAuth: () => ({ token: "t" }) }));
const showToast = vi.fn();
vi.mock("@/components/ui/toast", () => ({ useToast: () => ({ showToast }) }));
vi.mock("@/components/admin/markdown-editor", () => ({
  MarkdownEditor: ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
    <textarea aria-label="content" value={value} onChange={(e) => onChange(e.target.value)} />
  ),
}));

import { ArticleForm } from "@/components/admin/article-form";

const mdxPost: AdminPost = {
  slug: "hello-world", title: "Hello World", date: "2026-04-01", tags: ["AI", "SAP"], excerpt: "An excerpt",
  cover_image: "/images/covers/x.webp", content: "MDX body", draft: false, read_time: 2,
  source: "mdx", hasMdxOriginal: true,
};
const cmsOnly: AdminPost = {
  slug: "cms-post", title: "CMS post", date: "2026-11-01 10:00:00", tags: ["Running"], excerpt: "x",
  content: "cms body", draft: true, read_time: 1, source: "cms", id: 5, hasMdxOriginal: false,
};

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockImplementation(async (url: string) =>
    url === "/api/tags" ? { ok: true, json: async () => [] } : { ok: true, json: async () => ({}) },
  );
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  cleanup();
  fetchMock.mockReset();
  showToast.mockClear();
  vi.unstubAllGlobals();
});

const saveCall = () => fetchMock.mock.calls.find(([url]) => url !== "/api/tags");

describe("ArticleForm editing an MDX post", () => {
  it("prefills every field from the MDX file", async () => {
    render(<ArticleForm post={mdxPost} onSuccess={() => {}} onCancel={() => {}} />);
    expect((await screen.findByDisplayValue("Hello World"))).toBeDefined();
    expect(screen.getByDisplayValue("AI, SAP")).toBeDefined();
    expect(screen.getByDisplayValue("An excerpt")).toBeDefined();
    expect(screen.getByDisplayValue("/images/covers/x.webp")).toBeDefined();
    expect((screen.getByLabelText("content") as HTMLTextAreaElement).value).toBe("MDX body");
    expect((screen.getByLabelText(/Lưu dưới dạng nháp/) as HTMLInputElement).checked).toBe(false);
  });

  it("explains that saving creates a CMS copy and keeps the file", () => {
    render(<ArticleForm post={mdxPost} onSuccess={() => {}} onCancel={() => {}} />);
    expect(screen.getByText(/file MDX/)).toBeDefined();
  });

  it("locks the slug (it must match the file to override it), even when the title changes", () => {
    render(<ArticleForm post={mdxPost} onSuccess={() => {}} onCancel={() => {}} />);
    const slug = screen.getByDisplayValue("hello-world") as HTMLInputElement;
    expect(slug.readOnly).toBe(true);
    fireEvent.change(screen.getByDisplayValue("Hello World"), { target: { value: "Something else" } });
    expect(slug.value).toBe("hello-world");
  });

  it("creates a CMS copy with POST (not PUT) under the same slug", async () => {
    const onSuccess = vi.fn();
    render(<ArticleForm post={mdxPost} onSuccess={onSuccess} onCancel={() => {}} />);
    fireEvent.change(screen.getByDisplayValue("An excerpt"), { target: { value: "Edited excerpt" } });
    fireEvent.submit(screen.getByDisplayValue("Hello World").closest("form")!);
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    const [url, init] = saveCall()!;
    expect(url).toBe("/api/posts");
    expect(init.method).toBe("POST");
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({ slug: "hello-world", title: "Hello World", excerpt: "Edited excerpt", tags: ["AI", "SAP"], draft: false });
    expect(showToast).toHaveBeenCalledWith(expect.stringContaining("MDX"), "success");
  });
});

describe("ArticleForm editing a CMS post", () => {
  it("still updates with PUT by id", async () => {
    const onSuccess = vi.fn();
    render(<ArticleForm post={cmsOnly} onSuccess={onSuccess} onCancel={() => {}} />);
    fireEvent.submit(screen.getByDisplayValue("CMS post").closest("form")!);
    await waitFor(() => expect(onSuccess).toHaveBeenCalled());
    const [url, init] = saveCall()!;
    expect(url).toBe("/api/posts/5");
    expect(init.method).toBe("PUT");
  });

  it("does not show the MDX notice and keeps the slug editable", () => {
    render(<ArticleForm post={cmsOnly} onSuccess={() => {}} onCancel={() => {}} />);
    expect(screen.queryByText(/file MDX/)).toBeNull();
    expect((screen.getByDisplayValue("cms-post") as HTMLInputElement).readOnly).toBe(false);
  });
});

describe("ArticleForm creating a new post", () => {
  it("starts as a draft with an editable slug and POSTs", async () => {
    render(<ArticleForm onSuccess={() => {}} onCancel={() => {}} />);
    expect((screen.getByLabelText(/Lưu dưới dạng nháp/) as HTMLInputElement).checked).toBe(true);
    expect((screen.getByPlaceholderText("url-bai-viet") as HTMLInputElement).readOnly).toBe(false);
  });
});
