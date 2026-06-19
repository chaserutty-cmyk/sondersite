import type { CSSProperties } from "react";

type SparkleGlyphProps = {
  size?: number;
  tone?: "ink" | "soft-ink" | "gold";
  className?: string;
  style?: CSSProperties;
};

/**
 * SparkleGlyph
 *
 * The 4-point asterisk star used as a quiet accent — pinned to corners as the
 * "moment of signal" closing punctuation. A single tapered diamond + crossed
 * tapered diamond, drawn as one polygon. Pure SVG, no animation.
 */
export default function SparkleGlyph({
  size = 16,
  tone = "soft-ink",
  className = "",
  style,
}: SparkleGlyphProps) {
  const fill =
    tone === "gold"
      ? "var(--gold)"
      : tone === "ink"
        ? "var(--ink)"
        : "var(--soft-ink)";

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 16 16"
      className={className}
      style={style}
    >
      <path
        d="M 8 0 L 9.4 6.6 L 16 8 L 9.4 9.4 L 8 16 L 6.6 9.4 L 0 8 L 6.6 6.6 Z"
        fill={fill}
      />
    </svg>
  );
}
