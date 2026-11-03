import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { AdminLoginModal } from "@/components/admin/admin-login-modal";

const push = vi.fn();
vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

const login = vi.fn();
vi.mock("@/components/admin/admin-auth-provider", () => ({
  useAdminAuth: () => ({ login }),
}));

afterEach(() => {
  cleanup();
  push.mockClear();
  login.mockClear();
});

describe("AdminLoginModal", () => {
  it("navigates to the homepage when the close (x) button is clicked without logging in", () => {
    render(<AdminLoginModal />);

    fireEvent.click(screen.getByRole("button", { name: /đóng/i }));

    expect(push).toHaveBeenCalledWith("/");
    expect(login).not.toHaveBeenCalled();
  });

  it("navigates to the homepage when clicking the modal backdrop", () => {
    render(<AdminLoginModal />);

    fireEvent.click(screen.getByText("Đăng nhập quản trị").closest(".fixed") as Element);

    expect(push).toHaveBeenCalledWith("/");
  });
});
