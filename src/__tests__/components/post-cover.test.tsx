import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { PostCover } from "@/components/blog/post-cover";

afterEach(cleanup);

describe("PostCover", () => {
  it("renders an img with alt when src is a local path", () => {
    render(<PostCover src="/uploads/a.webp" alt="Cover A" topic="AI" />);
    const img = screen.getByAltText("Cover A") as HTMLImageElement;
    expect(img.getAttribute("src")).toBe("/uploads/a.webp");
    expect(img.getAttribute("loading")).toBe("lazy");
  });

  it("renders the topic fallback when src is missing", () => {
    render(<PostCover alt="x" topic="Running" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("Running")).toBeDefined();
  });

  it("renders fallback for external URLs (blocked by CSP)", () => {
    render(<PostCover src="https://example.com/a.jpg" alt="x" topic="SAP" />);
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("SAP")).toBeDefined();
  });

  it("rejects protocol-relative URLs", () => {
    render(<PostCover src="//evil.com/a.jpg" alt="x" topic="SAP" />);
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("rejects backslash paths", () => {
    render(<PostCover src="/\evil.com/a.jpg" alt="x" topic="SAP" />);
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("falls back after the image fails to load", () => {
    render(<PostCover src="/uploads/missing.webp" alt="Broken" topic="AI" />);
    fireEvent.error(screen.getByAltText("Broken"));
    expect(screen.queryByRole("img")).toBeNull();
    expect(screen.getByText("AI")).toBeDefined();
  });
});
