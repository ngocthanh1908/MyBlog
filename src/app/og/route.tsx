import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const title = searchParams.get("title") || "Pham Ngoc Thanh";
  const description =
    searchParams.get("description") ||
    "Senior SAP Consultant, AI Architect, Marathon Runner";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px",
          background: "linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ fontSize: 20, color: "#818cf8", fontWeight: 600 }}>
            Pham Ngoc Thanh
          </div>
          <div
            style={{
              fontSize: title.length > 40 ? 48 : 56,
              fontWeight: 700,
              color: "#f9fafb",
              lineHeight: 1.2,
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                fontSize: 22,
                color: "#9ca3af",
                marginTop: "8px",
                lineHeight: 1.4,
              }}
            >
              {description.length > 120
                ? description.slice(0, 120) + "..."
                : description}
            </div>
          )}
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
