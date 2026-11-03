import { describe, it, expect } from "vitest";
import { ALL_TOPIC, groupAllPosts, groupPostsByTopic } from "@/lib/group-posts-by-topic";
import type { BlogPost } from "@/lib/mdx-utils";

function makePost(overrides: Partial<BlogPost>): BlogPost {
  return {
    slug: "p",
    title: "P",
    date: "2026-01-01",
    tags: ["AI"],
    excerpt: "e",
    draft: false,
    ...overrides,
  };
}

describe("groupPostsByTopic", () => {
  it("returns [] for no posts", () => {
    expect(groupPostsByTopic([])).toEqual([]);
  });

  it("makes a single group with featured and no related for one post", () => {
    const [g] = groupPostsByTopic([makePost({ slug: "a" })]);
    expect(g.topic).toBe("AI");
    expect(g.featured.slug).toBe("a");
    expect(g.related).toEqual([]);
    expect(g.total).toBe(1);
  });

  it("uses newest post as featured and the rest as related (newest first)", () => {
    const posts = [
      makePost({ slug: "old", date: "2026-01-01" }),
      makePost({ slug: "new", date: "2026-03-01" }),
      makePost({ slug: "mid", date: "2026-02-01" }),
    ];
    const [g] = groupPostsByTopic(posts);
    expect(g.featured.slug).toBe("new");
    expect(g.related.map((p) => p.slug)).toEqual(["mid", "old"]);
    expect(g.total).toBe(3);
  });

  it("lists a post in the group of every one of its tags", () => {
    const groups = groupPostsByTopic([
      makePost({ slug: "a", tags: ["AI", "SAP"], date: "2026-02-01" }),
      makePost({ slug: "b", tags: ["SAP"], date: "2026-01-01" }),
    ]);
    expect(groups.map((g) => g.topic).sort()).toEqual(["AI", "SAP"]);
    const sap = groups.find((g) => g.topic === "SAP")!;
    expect(sap.total).toBe(2);
    expect(sap.featured.slug).toBe("a");
    expect(groups.find((g) => g.topic === "AI")!.featured.slug).toBe("a");
  });

  it("does not list a post twice when a tag is duplicated", () => {
    const [g] = groupPostsByTopic([makePost({ tags: ["AI", "AI"] })]);
    expect(g.total).toBe(1);
  });

  it("puts untagged posts under 'Khác'", () => {
    const [g] = groupPostsByTopic([makePost({ tags: [] })]);
    expect(g.topic).toBe("Khác");
  });

  it("orders groups by post count desc, then featured date desc", () => {
    const groups = groupPostsByTopic([
      makePost({ slug: "r1", tags: ["Running"], date: "2026-01-01" }),
      makePost({ slug: "a1", tags: ["AI"], date: "2026-05-01" }),
      makePost({ slug: "s1", tags: ["SAP"], date: "2026-02-01" }),
      makePost({ slug: "s2", tags: ["SAP"], date: "2026-01-15" }),
    ]);
    expect(groups.map((g) => g.topic)).toEqual(["SAP", "AI", "Running"]);
  });

  it("does not break ordering on an invalid date", () => {
    const [g] = groupPostsByTopic([
      makePost({ slug: "bad", date: "not-a-date" }),
      makePost({ slug: "ok", date: "2026-02-01" }),
    ]);
    expect(g.featured.slug).toBe("ok");
  });

  it("caps related at the limit", () => {
    const posts = Array.from({ length: 9 }, (_, i) =>
      makePost({ slug: `p${i}`, date: `2026-01-0${i + 1}` })
    );
    const [g] = groupPostsByTopic(posts, 5);
    expect(g.related).toHaveLength(5);
    expect(g.total).toBe(9);
  });
});

describe("groupAllPosts", () => {
  it("returns null for no posts", () => {
    expect(groupAllPosts([])).toBeNull();
  });

  it("contains every post, newest first, with no cap on related", () => {
    const posts = Array.from({ length: 9 }, (_, i) =>
      makePost({ slug: `p${i}`, tags: [`t${i}`], date: `2026-01-0${i + 1}` })
    );
    const g = groupAllPosts(posts)!;
    expect(g.topic).toBe(ALL_TOPIC);
    expect(g.featured.slug).toBe("p8");
    expect(g.related).toHaveLength(8);
    expect(g.total).toBe(9);
  });
});
