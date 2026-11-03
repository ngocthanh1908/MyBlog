import { describe, it, expect, afterEach, beforeEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent, waitFor, within } from "@testing-library/react";

vi.mock("@/components/admin/admin-auth-provider", () => ({ useAdminAuth: () => ({ token: "t" }) }));
vi.mock("@/components/ui/toast", () => ({ useToast: () => ({ showToast: () => {} }) }));

import { MediaLibrary } from "@/components/admin/media-library";
import { Modal } from "@/components/ui/modal";

// The media picker and Modal are rendered inside the article <form>, so any button without
// type="button" would submit (save) the article.

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn(async (url: string) => {
    if (url.startsWith("/api/uploads")) {
      return { ok: true, json: async () => ({ files: [{ name: "a.webp", url: "/uploads/a.webp", size: 10, createdAt: "2026-10-01T00:00:00Z" }], total: 1 }) };
    }
    return { ok: true, json: async () => [] };
  }));
  vi.stubGlobal("confirm", vi.fn(() => false));
});
afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe("buttons inside a <form> never submit it", () => {
  it("MediaLibrary: tabs, upload, choose and delete buttons are type=button", async () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    render(
      <form onSubmit={onSubmit}>
        <MediaLibrary onInsert={() => {}} />
      </form>,
    );
    await screen.findByAltText("a.webp");
    const buttons = screen.getAllByRole("button").concat(screen.getAllByRole("tab"));
    expect(buttons.length).toBeGreaterThan(4);
    for (const button of buttons) expect(button.getAttribute("type")).toBe("button");

    fireEvent.click(screen.getByRole("tab", { name: "Ảnh minh họa có sẵn" }));
    fireEvent.click(screen.getByRole("button", { name: "+ Tải ảnh lên" }));
    await waitFor(() => expect(screen.getByAltText("a.webp")).toBeDefined());
    fireEvent.click(within(screen.getByAltText("a.webp").closest("div[class*='rounded-xl']") as HTMLElement).getByRole("button", { name: "Chọn" }));
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("Modal: the close (x) button is type=button", () => {
    const onSubmit = vi.fn((e: React.FormEvent) => e.preventDefault());
    const onClose = vi.fn();
    render(
      <form onSubmit={onSubmit}>
        <Modal onClose={onClose} title="Test">
          <p>body</p>
        </Modal>
      </form>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Đóng" }));
    expect(onClose).toHaveBeenCalled();
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
