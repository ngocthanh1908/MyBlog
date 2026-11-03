import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

let authorised = true;
vi.mock("@/lib/auth-utils", () => ({
  requireAuth: () => {
    if (!authorised) throw new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  },
}));

import { GET } from "@/app/api/uploads/route";

beforeEach(() => {
  authorised = true;
});

const call = (qs = "") => GET(new NextRequest(`http://localhost/api/uploads${qs}`));

describe("GET /api/uploads?folder=covers", () => {
  it("requires admin auth", async () => {
    authorised = false;
    expect((await call("?folder=covers")).status).toBe(401);
  });

  it("lists the built-in cover illustrations from /images/covers", async () => {
    const body = await (await call("?folder=covers&limit=100")).json();
    expect(body.total).toBeGreaterThanOrEqual(20);
    const first = body.files[0];
    expect(first.url).toMatch(/^\/images\/covers\/.+\.webp$/);
    expect(typeof first.size).toBe("number");
    expect(body.files.every((f: { url: string }) => f.url.startsWith("/images/covers/"))).toBe(true);
  });

  it("ignores unknown folder names instead of reading arbitrary directories", async () => {
    const body = await (await call("?folder=../../src")).json();
    const files = Array.isArray(body) ? body : body.files;
    expect(files.every((f: { url: string }) => f.url.startsWith("/uploads/"))).toBe(true);
  });

  it("keeps listing /uploads by default", async () => {
    const body = await (await call()).json();
    const files = Array.isArray(body) ? body : body.files;
    expect(files.every((f: { url: string }) => f.url.startsWith("/uploads/"))).toBe(true);
  });
});
