import { describe, it, expect } from "vitest";
import {
  runStats,
  runDashboardTitle,
  runDashboardSubtitle,
  mafTitle,
  mafContent,
} from "@/data/habits-data";

describe("runStats", () => {
  it("is a non-empty array with value and label", () => {
    expect(Array.isArray(runStats)).toBe(true);
    expect(runStats.length).toBeGreaterThan(0);
    for (const stat of runStats) {
      expect(typeof stat.value).toBe("string");
      expect(typeof stat.label).toBe("string");
    }
  });
});

describe("dashboard text", () => {
  it("has non-empty title and subtitle", () => {
    expect(runDashboardTitle.length).toBeGreaterThan(0);
    expect(runDashboardSubtitle.length).toBeGreaterThan(0);
  });
});

describe("MAF content", () => {
  it("has title and non-empty content array", () => {
    expect(mafTitle.length).toBeGreaterThan(0);
    expect(Array.isArray(mafContent)).toBe(true);
    expect(mafContent.length).toBeGreaterThan(0);
  });
});
