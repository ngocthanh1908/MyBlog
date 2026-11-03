import { describe, it, expect } from "vitest";
import { navLinks, isNavLinkActive } from "@/lib/nav-links";

describe("navLinks", () => {
  it("has a 'Sở thích' section whose only child is 'Chạy bộ' (/habits)", () => {
    const hobbies = navLinks.find((l) => l.label === "Sở thích");
    expect(hobbies?.href).toBe("/hobbies");
    expect(hobbies?.children?.map((c) => [c.label, c.href])).toEqual([["Chạy bộ", "/habits"]]);
  });

  it("no longer lists 'Chạy bộ' at the top level", () => {
    expect(navLinks.some((l) => l.label === "Chạy bộ")).toBe(false);
  });
});

describe("isNavLinkActive", () => {
  const hobbies = navLinks.find((l) => l.href === "/hobbies")!;
  it("is active on its own page", () => {
    expect(isNavLinkActive(hobbies, "/hobbies")).toBe(true);
  });
  it("stays active while a child page is open", () => {
    expect(isNavLinkActive(hobbies, "/habits")).toBe(true);
  });
  it("is not active on unrelated pages", () => {
    expect(isNavLinkActive(hobbies, "/blog")).toBe(false);
  });
  it("does not treat a path that merely shares a prefix as a child", () => {
    expect(isNavLinkActive(hobbies, "/hobbies-extra")).toBe(false);
  });
});
