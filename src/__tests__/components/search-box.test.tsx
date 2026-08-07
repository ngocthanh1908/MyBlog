import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";

vi.mock("/pagefind/pagefind.js", () => ({
  default: { init: vi.fn(), search: vi.fn().mockResolvedValue({ results: [] }) },
}));

import { SearchBox } from "@/components/blog/search-box";

afterEach(cleanup);

describe("SearchBox", () => {
  it("renders search input with placeholder and accepts text", () => {
    render(<SearchBox />);
    const input = screen.getByPlaceholderText("Tim kiem bai viet...") as HTMLInputElement;
    expect(input).toBeDefined();
    expect(input.type).toBe("text");
  });
});
