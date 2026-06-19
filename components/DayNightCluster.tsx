import type { CSSProperties } from "react";

type DayNightClusterProps = {
  size?: number;
  tone?: "ink" | "soft-ink";
  gap?: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * DayNightCluster
 *
 * Static crescent moon + small rayed sun, paired horizontally. The quiet
 * celestial signature that anchors the top-right of editorial chapters and
 * counterweights the SONDER / DIGITAL CO. masthead on the opposite corner.
 * Pure SVG, no client JS, no theme behavior — purely decorative.
 *
 * Strokes are kept hair-thin at any render size via vectorEffect=non-scaling.
 */
export default function DayNightCluster({
  size = 18,
  tone = "ink",
  gap = 10,
  className = "",
  style,
}: DayNightClusterProps) {
  const stroke = tone === "soft-ink" ? "var(--soft-ink)" : "var(--ink)";

  const cx = 9;
  const cy = 9;
  const rInner = 4.5;
  const rOuter = 7;
  const rays = [0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x1: cx + rInner * Math.cos(rad),
      y1: cy + rInner * Math.sin(rad),
      x2: cx + rOuter * Math.cos(rad),
      y2: cy + rOuter * Math.sin(rad),
    };
  });

  return (
    <div
      aria-hidden
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: `${gap}px`,
        ...style,
      }}
    >
      {/* Crescent moon — single closed path: outer r=7 arc swept the long way,
          then inner cutter r=6.5 arc returning, intersecting at y≈3.08/14.92. */}
      <svg width={size} height={size} viewBox="0 0 18 18">
        <path
          d="M 5.26 3.08 A 7 7 0 1 0 5.26 14.92 A 6.5 6.5 0 0 1 5.26 3.08 Z"
          fill="none"
          stroke={stroke}
          strokeWidth="0.8"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Sun — small core circle + 8 hairline rays at 45° intervals */}
      <svg width={size} height={size} viewBox="0 0 18 18">
        <circle
          cx={cx}
          cy={cy}
          r="2.4"
          fill="none"
          stroke={stroke}
          strokeWidth="0.8"
          vectorEffect="non-scaling-stroke"
        />
        {rays.map((r, i) => (
          <line
            key={i}
            x1={r.x1}
            y1={r.y1}
            x2={r.x2}
            y2={r.y2}
            stroke={stroke}
            strokeWidth="0.8"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </svg>
    </div>
  );
}
