import { ImageResponse } from "next/og";
import { HERO, DISCIPLINES } from "@/lib/copy";

export const alt = "Sonder Digital Co. — We build technology that makes your business work better.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card. Ivory ground, the approved headline in serif with the third line
 * in gold italic, a hairline, and the four-word capability index in mono.
 * A flat echo of the hero.
 */
export default function OpenGraphImage() {
  const [l1, l2, l3] = HERO.headline;
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
          padding: "60px 72px 56px",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "baseline",
            fontSize: 26,
            letterSpacing: -0.5,
          }}
        >
          <span>
            Sonder{" "}
            <span style={{ fontFamily: "Helvetica, Arial, sans-serif", fontSize: 14, letterSpacing: 3, opacity: 0.7 }}>
              DIGITAL CO.
            </span>
          </span>
          <span style={{ fontFamily: "monospace", fontSize: 15, letterSpacing: 3, color: "#4b4944" }}>
            ATLANTA, GEORGIA
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.0, letterSpacing: -2 }}>
          <span style={{ fontSize: 84 }}>{l1}</span>
          <span style={{ fontSize: 84 }}>{l2}</span>
          <span style={{ fontSize: 84, color: "#9a7a3d", fontStyle: "italic" }}>{l3}</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ width: "100%", height: 1, background: "rgba(17,17,17,0.22)" }} />
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontFamily: "monospace",
              fontSize: 16,
              letterSpacing: 3,
              color: "#4b4944",
            }}
          >
            <span>{DISCIPLINES.join("  ·  ").toUpperCase()}</span>
            <span>SONDERDIGITALCO.COM</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
