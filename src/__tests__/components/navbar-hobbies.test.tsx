import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, within, fireEvent } from "@testing-library/react";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));
vi.mock("@/components/ui/theme-toggle", () => ({ ThemeToggle: () => null }));

import { Navbar } from "@/components/layout/navbar";

afterEach(() => {
  cleanup();
  pathname = "/";
});

const nav = () => within(screen.getByRole("navigation", { name: "Main navigation" }));
const linkLabels = () => nav().getAllByRole("link").map((a) => a.textContent);

describe("Navbar sidebar: Sở thích group", () => {
  it("hides Chạy bộ by default", () => {
    render(<Navbar />);
    expect(linkLabels()).toEqual(["Trang chủ", "Bài viết", "Sở thích"]);
    expect(nav().queryByRole("link", { name: "Chạy bộ" })).toBeNull();
    expect(nav().getByRole("button", { name: /Mở rộng Sở thích/ }).getAttribute("aria-expanded")).toBe("false");
  });

  it("shows Chạy bộ when the chevron is pressed, and hides it again on a second press", () => {
    render(<Navbar />);
    fireEvent.click(nav().getByRole("button", { name: /Mở rộng Sở thích/ }));
    expect(linkLabels()).toEqual(["Trang chủ", "Bài viết", "Sở thích", "Chạy bộ"]);
    expect(nav().getByRole("link", { name: "Chạy bộ" }).getAttribute("href")).toBe("/habits");

    fireEvent.click(nav().getByRole("button", { name: /Thu gọn Sở thích/ }));
    expect(nav().queryByRole("link", { name: "Chạy bộ" })).toBeNull();
  });

  it("opens the group when the Sở thích link itself is chosen", () => {
    render(<Navbar />);
    fireEvent.click(nav().getByRole("link", { name: "Sở thích" }));
    expect(nav().getByRole("link", { name: "Chạy bộ" })).toBeDefined();
  });

  it("collapses when Sở thích is chosen a second time (while already on its page), and expands on a third", () => {
    pathname = "/hobbies"; // the first choice navigated here and opened the group
    render(<Navbar />);
    expect(nav().getByRole("link", { name: "Chạy bộ" })).toBeDefined();

    fireEvent.click(nav().getByRole("link", { name: "Sở thích" }));
    expect(nav().queryByRole("link", { name: "Chạy bộ" })).toBeNull();

    fireEvent.click(nav().getByRole("link", { name: "Sở thích" }));
    expect(nav().getByRole("link", { name: "Chạy bộ" })).toBeDefined();
  });

  it("starts open and marks both rows current while on the child page", () => {
    pathname = "/habits";
    render(<Navbar />);
    expect(nav().getByRole("link", { name: "Chạy bộ" }).getAttribute("aria-current")).toBe("page");
    expect(nav().getByRole("link", { name: "Sở thích" }).getAttribute("aria-current")).toBe("page");
    expect(nav().getByRole("link", { name: "Bài viết" }).getAttribute("aria-current")).toBeNull();
  });
});
