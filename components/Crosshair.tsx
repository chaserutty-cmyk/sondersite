import { CSSProperties } from "react";

type CrosshairProps = {
  size?: number;
  tone?: "ink" | "ivory" | "gold";
  className?: string;
  style?: CSSProperties;
};

/**
 * Crosshair
 *
 * The tiny + mark scattered across editorial sections. Functions as visual
 * "tick" or registration mark, never as decoration. Always thin, always quiet.
 */
export default function Crosshair({
  size = 10,
  tone = "ink",
  className = "",
  style,
}: CrosshairProps) {
  const color =
    tone === "ivory"
      ? "rgba(241,233,220,0.4)"
      : tone === "gold"
        ? "var(--hairline-gold)"
        : "var(--hairline-strong)";

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      style={style}
    >
      <line
        x1={size / 2}
        y1="0"
        x2={size / 2}
        y2={size}
        stroke={color}
        strokeWidth="0.6"
      />
      <line
        x1="0"
        y1={size / 2}
        x2={size}
        y2={size / 2}
        stroke={color}
        strokeWidth="0.6"
      />
    </svg>
  );
}
