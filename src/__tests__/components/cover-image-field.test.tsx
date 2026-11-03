import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor } from "@testing-library/react";

vi.mock("@/components/admin/admin-auth-provider", () => ({ useAdminAuth: () => ({ token: "t" }) }));
const showToast = vi.fn();
vi.mock("@/components/ui/toast", () => ({ useToast: () => ({ showToast }) }));
vi.mock("@/components/admin/media-library", () => ({
  MediaLibrary: ({ onInsert }: { onInsert?: (url: string) => void }) => (
    <button onClick={() => onInsert?.("/uploads/from-library.webp")}>pick-from-library</button>
  ),
}));

import { CoverImageField } from "@/components/admin/cover-image-field";

const fetchMock = vi.fn();
beforeEach(() => {
  fetchMock.mockResolvedValue({ ok: true, json: async () => ({ url: "/uploads/new-upload.webp" }) });
  vi.stubGlobal("fetch", fetchMock);
});
afterEach(() => {
  cleanup();
  fetchMock.mockReset();
  showToast.mockClear();
  vi.unstubAllGlobals();
});

describe("CoverImageField", () => {
  it("previews a local image", () => {
    render(<CoverImageField value="/images/covers/x.webp" onChange={() => {}} />);
    expect(screen.getByAltText("Xem trước ảnh bìa").getAttribute("src")).toBe("/images/covers/x.webp");
  });

  it("shows an empty state and no remove button when there is no image", () => {
    render(<CoverImageField value="" onChange={() => {}} />);
    expect(screen.queryByAltText("Xem trước ảnh bìa")).toBeNull();
    expect(screen.getByText(/Chưa có ảnh bìa/)).toBeDefined();
    expect(screen.queryByRole("button", { name: "Bỏ ảnh" })).toBeNull();
  });

  it("warns that an external URL will not be displayed and does not preview it", () => {
    render(<CoverImageField value="https://example.com/a.jpg" onChange={() => {}} />);
    expect(screen.getByRole("alert").textContent).toMatch(/ngoài/i);
    expect(screen.queryByAltText("Xem trước ảnh bìa")).toBeNull();
  });

  it("does not warn for a local path", () => {
    render(<CoverImageField value="/uploads/a.webp" onChange={() => {}} />);
    expect(screen.queryByRole("alert")).toBeNull();
  });

  it("lets the author type a path", () => {
    const onChange = vi.fn();
    render(<CoverImageField value="" onChange={onChange} />);
    fireEvent.change(screen.getByPlaceholderText(/\/uploads\//), { target: { value: "/uploads/typed.webp" } });
    expect(onChange).toHaveBeenCalledWith("/uploads/typed.webp");
  });

  it("clears the image with 'Bỏ ảnh'", () => {
    const onChange = vi.fn();
    render(<CoverImageField value="/uploads/a.webp" onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Bỏ ảnh" }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("picks an image from the library and closes the picker", () => {
    const onChange = vi.fn();
    render(<CoverImageField value="" onChange={onChange} />);
    expect(screen.queryByText("pick-from-library")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Chọn từ thư viện" }));
    fireEvent.click(screen.getByText("pick-from-library"));
    expect(onChange).toHaveBeenCalledWith("/uploads/from-library.webp");
    expect(screen.queryByText("pick-from-library")).toBeNull();
  });

  it("uploads a file and uses the returned URL", async () => {
    const onChange = vi.fn();
    const { container } = render(<CoverImageField value="" onChange={onChange} />);
    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [new File(["x"], "pic.webp", { type: "image/webp" })] } });
    await waitFor(() => expect(onChange).toHaveBeenCalledWith("/uploads/new-upload.webp"));
    expect(fetchMock).toHaveBeenCalledWith("/api/upload", expect.objectContaining({ method: "POST" }));
  });

  it("reports a failed upload without changing the image", async () => {
    fetchMock.mockResolvedValue({ ok: false, json: async () => ({ error: "File too large. Max 5MB" }) });
    const onChange = vi.fn();
    const { container } = render(<CoverImageField value="/uploads/keep.webp" onChange={onChange} />);
    fireEvent.change(container.querySelector('input[type="file"]')!, { target: { files: [new File(["x"], "big.png", { type: "image/png" })] } });
    await waitFor(() => expect(showToast).toHaveBeenCalledWith(expect.any(String), "error"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
