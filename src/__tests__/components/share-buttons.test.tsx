import { describe, it, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen, fireEvent, cleanup, waitFor } from "@testing-library/react";
import { ShareButtons } from "@/components/blog/share-buttons";

afterEach(cleanup);

const url = "https://example.com/blog/my-post";
const title = "My Post Title";

describe("ShareButtons", () => {
  let writeText: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
  });

  it("renders a Facebook share link with the URL-encoded post URL", () => {
    render(<ShareButtons url={url} title={title} />);
    const link = screen.getByRole("link", { name: /facebook/i });
    expect(link.getAttribute("href")).toBe(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    );
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders an X/Twitter share link with URL-encoded url and title", () => {
    render(<ShareButtons url={url} title={title} />);
    const link = screen.getByRole("link", { name: /^x$/i });
    expect(link.getAttribute("href")).toBe(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    );
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("renders a LinkedIn share link with the URL-encoded post URL", () => {
    render(<ShareButtons url={url} title={title} />);
    const link = screen.getByRole("link", { name: /linkedin/i });
    expect(link.getAttribute("href")).toBe(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    );
    expect(link.getAttribute("target")).toBe("_blank");
    expect(link.getAttribute("rel")).toBe("noopener noreferrer");
  });

  it("copies the url to the clipboard and shows a copied label", async () => {
    render(<ShareButtons url={url} title={title} />);
    const button = screen.getByRole("button", { name: /sao chép liên kết/i });
    fireEvent.click(button);

    expect(writeText).toHaveBeenCalledWith(url);
    await waitFor(() =>
      expect(screen.getByRole("button", { name: /đã sao chép/i })).toBeDefined()
    );
  });

  it("falls back to showing the raw url when the clipboard API throws", async () => {
    writeText.mockRejectedValueOnce(new Error("denied"));
    render(<ShareButtons url={url} title={title} />);
    const button = screen.getByRole("button", { name: /sao chép liên kết/i });
    fireEvent.click(button);

    await waitFor(() => {
      const fallbackInput = screen.getByDisplayValue(url) as HTMLInputElement;
      expect(fallbackInput.readOnly).toBe(true);
    });
  });
});
