import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { AboutContent } from "@/components/about/about-content";
import { timeline } from "@/data/about-data";

afterEach(cleanup);

describe("AboutContent", () => {
  it("has exactly one h1 with the person's name", () => {
    render(<AboutContent />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0].textContent).toContain("Phạm Ngọc Thanh");
  });

  it("renders the introduction with the role highlighted", () => {
    render(<AboutContent />);
    expect(screen.getByText(/Senior SAP Basis Specialist/)).toBeDefined();
  });

  it("renders every timeline entry", () => {
    render(<AboutContent />);
    for (const item of timeline) {
      expect(screen.getByText(item.title)).toBeDefined();
    }
  });
});
