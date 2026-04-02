import { describe, it, expect } from "vitest";
import {
  latestRun,
  weeklyStats,
  personalRecords,
  currentGoals,
  philosophy,
} from "@/data/habits-data";

describe("latestRun", () => {
  it("has date, distance, pace, avgHR, notes", () => {
    expect(typeof latestRun.date).toBe("string");
    expect(typeof latestRun.distance).toBe("string");
    expect(typeof latestRun.pace).toBe("string");
    expect(typeof latestRun.avgHR).toBe("number");
    expect(typeof latestRun.notes).toBe("string");
  });
});

describe("weeklyStats", () => {
  it("has totalDistance, totalRuns, avgPace", () => {
    expect(typeof weeklyStats.totalDistance).toBe("string");
    expect(typeof weeklyStats.totalRuns).toBe("number");
    expect(typeof weeklyStats.avgPace).toBe("string");
  });
});

describe("personalRecords", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(personalRecords)).toBe(true);
    expect(personalRecords.length).toBeGreaterThan(0);
  });

  it("each record has event, time, date as strings", () => {
    for (const record of personalRecords) {
      expect(typeof record.event).toBe("string");
      expect(record.event.length).toBeGreaterThan(0);
      expect(typeof record.time).toBe("string");
      expect(record.time.length).toBeGreaterThan(0);
      expect(typeof record.date).toBe("string");
      expect(record.date.length).toBeGreaterThan(0);
    }
  });
});

describe("currentGoals", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(currentGoals)).toBe(true);
    expect(currentGoals.length).toBeGreaterThan(0);
  });

  it("each goal has goal, target, current as strings", () => {
    for (const g of currentGoals) {
      expect(typeof g.goal).toBe("string");
      expect(typeof g.target).toBe("string");
      expect(typeof g.current).toBe("string");
    }
  });
});

describe("philosophy", () => {
  it("is a non-empty string", () => {
    expect(typeof philosophy).toBe("string");
    expect(philosophy.length).toBeGreaterThan(0);
  });
});
