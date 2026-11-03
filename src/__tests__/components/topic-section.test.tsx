import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { TopicSection } from "@/components/home/topic-section";
import type { BlogPost } from "@/lib/mdx-utils";

afterEach(cleanup);

function makePost(overrides: Partial<BlogPost>): BlogPost {
  return {
    slug: "p",
    title: "P",
    date: "2026-01-01",
    tags: ["AI"],
    excerpt: "An excerpt.",
    draft: false,
    ...overrides,
  };
}

const related = [makePost({ slug: "r1", title: "Related One" }), makePost({ slug: "r2", title: "Related Two" })];

describe("TopicSection", () => {
  it("renders the topic tab linking to the filtered blog index", () => {
    render(<TopicSection topic="AI" featured={makePost({})} related={[]} />);
    expect(screen.getByRole("link", { name: "#AI" }).getAttribute("href")).toBe("/blog?tag=AI");
  });

  it("does not link the untagged topic to a tag filter that would be empty", () => {
    render(<TopicSection topic="Khác" featured={makePost({ tags: [] })} related={[]} />);
    expect(screen.queryByRole("link", { name: "#Khác" })).toBeNull();
    expect(screen.getByText("#Khác")).toBeDefined();
  });

  it("gives multi-word topics a valid labelled section", () => {
    render(<TopicSection topic="SAP ABAP" featured={makePost({})} related={[]} />);
    expect(screen.getByRole("region", { name: "#SAP ABAP" })).toBeDefined();
  });

  describe("collapsed by default", () => {
    it("keeps the cover image visible", () => {
      render(<TopicSection topic="AI" featured={makePost({ title: "Featured", coverImage: "/images/covers/x.webp" })} related={related} />);
      expect(screen.getByAltText("Featured").getAttribute("src")).toBe("/images/covers/x.webp");
    });

    it("keeps the fallback cover (topic label) when the post has no image", () => {
      render(<TopicSection topic="AI" featured={makePost({})} related={related} />);
      expect(screen.queryByRole("img")).toBeNull();
      expect(screen.getByText("AI", { selector: "span" })).toBeDefined();
    });

    it("shows the featured title, a short excerpt and the date, but not the related list", () => {
      render(<TopicSection topic="AI" featured={makePost({ slug: "feat", title: "Featured" })} related={related} />);
      expect(screen.getByRole("link", { name: /Featured/ }).getAttribute("href")).toBe("/blog/feat");
      expect(screen.getByText("An excerpt.")).toBeDefined();
      expect(screen.queryByText("Bài cùng chủ đề")).toBeNull();
      expect(screen.queryByText("Related One")).toBeNull();
    });

    it("offers a 'Xem thêm' button that is not expanded", () => {
      render(<TopicSection topic="AI" featured={makePost({})} related={related} />);
      expect(screen.getByRole("button", { name: /Xem thêm/ }).getAttribute("aria-expanded")).toBe("false");
    });
  });

  describe("expanded with 'Xem thêm'", () => {
    it("reveals the related list and keeps the cover", () => {
      render(<TopicSection topic="Running" featured={makePost({ tags: ["Running"], title: "Run", coverImage: "/images/covers/r.webp" })} related={related} />);
      fireEvent.click(screen.getByRole("button", { name: /Xem thêm/ }));
      expect(screen.getByAltText("Run")).toBeDefined();
      expect(screen.getByText("Bài cùng chủ đề")).toBeDefined();
      expect(screen.getByRole("link", { name: "Related One" }).getAttribute("href")).toBe("/blog/r1");
      expect(screen.getByRole("link", { name: "Related Two" })).toBeDefined();
      expect(screen.getByRole("button", { name: /Thu gọn/ }).getAttribute("aria-expanded")).toBe("true");
    });

    it("collapses again with 'Thu gọn'", () => {
      render(<TopicSection topic="AI" featured={makePost({})} related={related} />);
      fireEvent.click(screen.getByRole("button", { name: /Xem thêm/ }));
      fireEvent.click(screen.getByRole("button", { name: /Thu gọn/ }));
      expect(screen.queryByText("Bài cùng chủ đề")).toBeNull();
    });

    it("omits the related list when there are no related posts", () => {
      render(<TopicSection topic="AI" featured={makePost({})} related={[]} />);
      fireEvent.click(screen.getByRole("button", { name: /Xem thêm/ }));
      expect(screen.queryByText("Bài cùng chủ đề")).toBeNull();
    });
  });
});
