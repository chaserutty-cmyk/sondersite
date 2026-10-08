import { ImageResponse } from "next/og";

export const alt =
  "Sonder Digital Co. — Most brands chase attention. Few create gravity.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Code-generated share card. Ivory editorial ground, the brand thesis in
 * stacked caps with a single gold accent on GRAVITY, framed by mono chrome —
 * a flat echo of the SIGNAL chapter. Used for both Open Graph and Twitter.
 */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#f4f0e7",
          color: "#111111",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {/* Top chrome */}
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 6, color: "#4b4944", fontFamily: "monospace" }}>
          <span>SONDER DIGITAL CO.</span>
          <span>01 — SIGNAL</span>
        </div>

        {/* Thesis */}
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.0 }}>
          <span style={{ fontSize: 64, letterSpacing: -1, color: "#4b4944" }}>MOST BRANDS</span>
          <span style={{ fontSize: 64, letterSpacing: -1, color: "#4b4944", marginBottom: 18 }}>CHASE ATTENTION.</span>
          <span style={{ fontSize: 112, letterSpacing: -3, fontWeight: 700 }}>
            FEW CREATE <span style={{ color: "#9a7a3d", fontStyle: "italic" }}>GRAVITY.</span>
          </span>
        </div>

        {/* Bottom chrome */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ width: "100%", height: 1, background: "rgba(17,17,17,0.22)" }} />
          <span style={{ fontSize: 22, letterSpacing: 4, color: "#4b4944", fontFamily: "monospace" }}>
            DIGITAL EXPERIENCE ARCHITECTURE — SONDERDIGITAL-CO.COM
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
