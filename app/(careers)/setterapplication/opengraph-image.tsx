import { ImageResponse } from "next/og";
import { BONUS, HERO, PAY, REQUIREMENT } from "@/lib/careers/copy";

export const alt = `${HERO.headline.join(" ")} — Sonder Digital Co. ${PAY.line}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Share card for the role. This is what a Facebook group sees before anyone
 * clicks, so it carries what a caller decides on: the role, the base pay, the
 * two bonus amounts, the hours, and the one requirement. Same ivory ground and
 * mono chrome as the site's card.
 */
export default function OpenGraphImage() {
  const facts = [`${PAY.base.toUpperCase()} BASE`, "~16 HRS / WEEK", "REMOTE"];
  const bonuses =
    `BONUSES: ${BONUS.show.amount} ${BONUS.show.per} + ${BONUS.close.amount} ${BONUS.close.per}`.toUpperCase();
  const required = `REQUIRED: ${REQUIREMENT.short} ${REQUIREMENT.of}`.toUpperCase();
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
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 6,
            color: "#4b4944",
            fontFamily: "monospace",
          }}
        >
          <span>SONDER DIGITAL CO.</span>
          <span>OPEN ROLE</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.0 }}>
          <span style={{ fontSize: 92, letterSpacing: -2 }}>{HERO.headline[0]}</span>
          <span style={{ fontSize: 112, letterSpacing: -3, fontWeight: 700, fontStyle: "italic", color: "#9a7a3d" }}>
            {HERO.headline[1]}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ width: "100%", height: 1, background: "rgba(17,17,17,0.22)" }} />
          <div style={{ display: "flex", gap: 32, fontSize: 24, letterSpacing: 3, fontFamily: "monospace" }}>
            {facts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
          <span style={{ fontSize: 24, letterSpacing: 3, fontFamily: "monospace" }}>{bonuses}</span>
          <span style={{ fontSize: 22, letterSpacing: 3, color: "#6f5528", fontFamily: "monospace" }}>{required}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
