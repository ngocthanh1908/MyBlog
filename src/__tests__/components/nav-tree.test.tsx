import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";

let pathname = "/";
vi.mock("next/navigation", () => ({ usePathname: () => pathname }));

import { NavTree } from "@/components/layout/nav-tree";

afterEach(() => {
  cleanup();
  pathname = "/";
});

describe("NavTree onNavigate (mobile drawer closing)", () => {
  it("fires when a link navigates elsewhere", () => {
    const onNavigate = vi.fn();
    render(<NavTree onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("link", { name: "Bài viết" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("fires on the first choice of Sở thích, which navigates to its page", () => {
    const onNavigate = vi.fn();
    render(<NavTree onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("link", { name: "Sở thích" }));
    expect(onNavigate).toHaveBeenCalledTimes(1);
  });

  it("does not fire when Sở thích is chosen again on its own page, so the drawer stays open while the group collapses", () => {
    pathname = "/hobbies";
    const onNavigate = vi.fn();
    render(<NavTree onNavigate={onNavigate} />);
    fireEvent.click(screen.getByRole("link", { name: "Sở thích" }));
    expect(onNavigate).not.toHaveBeenCalled();
    expect(screen.queryByRole("link", { name: "Chạy bộ" })).toBeNull();
  });
});
