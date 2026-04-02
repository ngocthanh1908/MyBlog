import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatCard } from "@/components/habits/stat-card";

describe("StatCard", () => {
  it("renders value and label", () => {
    render(<StatCard value="42 km" label="Distance" />);
    expect(screen.getByText("42 km")).toBeDefined();
    expect(screen.getByText("Distance")).toBeDefined();
  });

  it("renders without icon prop", () => {
    render(<StatCard value="4" label="Runs" />);
    expect(screen.getByText("4")).toBeDefined();
    expect(screen.getByText("Runs")).toBeDefined();
  });

  it("renders with an icon node", () => {
    render(<StatCard value="135 bpm" label="Avg HR" icon={<span>HR</span>} />);
    expect(screen.getByText("135 bpm")).toBeDefined();
    expect(screen.getByText("Avg HR")).toBeDefined();
    expect(screen.getByText("HR")).toBeDefined();
  });
});
