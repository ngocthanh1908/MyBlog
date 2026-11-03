import { describe, it, expect, afterEach, vi } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

vi.mock("next-themes", () => ({ useTheme: () => ({ resolvedTheme: "light" }) }));
vi.mock("@giscus/react", () => ({ default: () => <div data-testid="giscus" /> }));

import { CommentsSection } from "@/components/blog/comments-section";

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
});

describe("CommentsSection", () => {
  it("renders nothing when giscus is not configured, so visitors do not see its error", () => {
    vi.stubEnv("NEXT_PUBLIC_GISCUS_REPO_ID", "");
    vi.stubEnv("NEXT_PUBLIC_GISCUS_CATEGORY_ID", "");
    const { container } = render(<CommentsSection />);
    expect(container.firstChild).toBeNull();
    expect(screen.queryByTestId("giscus")).toBeNull();
  });

  it("renders nothing when only one of the two ids is set", () => {
    vi.stubEnv("NEXT_PUBLIC_GISCUS_REPO_ID", "R_123");
    vi.stubEnv("NEXT_PUBLIC_GISCUS_CATEGORY_ID", "");
    const { container } = render(<CommentsSection />);
    expect(container.firstChild).toBeNull();
  });

  it("renders the 'Bình luận' section with giscus once both ids are configured", () => {
    vi.stubEnv("NEXT_PUBLIC_GISCUS_REPO_ID", "R_123");
    vi.stubEnv("NEXT_PUBLIC_GISCUS_CATEGORY_ID", "DIC_456");
    render(<CommentsSection />);
    expect(screen.getByRole("heading", { name: "Bình luận" })).toBeDefined();
    expect(screen.getByTestId("giscus")).toBeDefined();
  });
});
