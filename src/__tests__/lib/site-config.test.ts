import { describe, it, expect } from "vitest";
import { siteConfig } from "@/lib/site-config";

describe("siteConfig", () => {
  it("has a non-empty name string", () => {
    expect(typeof siteConfig.name).toBe("string");
    expect(siteConfig.name.length).toBeGreaterThan(0);
  });

  it("has a non-empty description string", () => {
    expect(typeof siteConfig.description).toBe("string");
    expect(siteConfig.description.length).toBeGreaterThan(0);
  });

  it("has a siteUrl string", () => {
    expect(typeof siteConfig.siteUrl).toBe("string");
    expect(siteConfig.siteUrl.length).toBeGreaterThan(0);
  });

  it("has navLinks as a non-empty array with label and href", () => {
    expect(Array.isArray(siteConfig.navLinks)).toBe(true);
    expect(siteConfig.navLinks.length).toBeGreaterThan(0);
    for (const link of siteConfig.navLinks) {
      expect(typeof link.label).toBe("string");
      expect(typeof link.href).toBe("string");
    }
  });

  it("has socialLinks with github, linkedin, and email", () => {
    expect(typeof siteConfig.socialLinks).toBe("object");
    expect(typeof siteConfig.socialLinks.github).toBe("string");
    expect(typeof siteConfig.socialLinks.linkedin).toBe("string");
    expect(typeof siteConfig.socialLinks.email).toBe("string");
  });
});
