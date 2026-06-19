import { CSSProperties } from "react";

type GoldNodeProps = {
  size?: number;
  pulse?: boolean;
  halo?: boolean;
  className?: string;
  style?: CSSProperties;
  "aria-hidden"?: boolean;
};

/**
 * GoldNode
 *
 * The signature gold dot used across orbits, labels, form active states, and
 * progress markers. Pulse + halo are opt-in. Default is a calm static dot.
 *
 * The radial gradient + soft halo is what fakes "rendered ball" in flat SVG.
 */
export default function GoldNode({
  size = 6,
  pulse = false,
  halo = false,
  className = "",
  style,
  "aria-hidden": ariaHidden = true,
}: GoldNodeProps) {
  const viewBox = halo ? 24 : 12;
  const cx = viewBox / 2;
  const cy = viewBox / 2;
  const r = halo ? viewBox / 4 : viewBox / 2.4;
  const displaySize = halo ? size * 4 : size;

  return (
    <svg
      aria-hidden={ariaHidden}
      width={displaySize}
      height={displaySize}
      viewBox={`0 0 ${viewBox} ${viewBox}`}
      className={`inline-block ${pulse ? "sonder-pulse" : ""} ${className}`}
      style={style}
    >
      <defs>
        <radialGradient id={`sonder-node-${size}-${halo ? "h" : "n"}`}>
          <stop offset="0%" stopColor="#E2C281" />
          <stop offset="45%" stopColor="#B89154" />
          <stop offset="100%" stopColor="#6F5528" />
        </radialGradient>
        {halo && (
          <radialGradient id={`sonder-halo-${size}`}>
            <stop offset="0%" stopColor="#C1A56B" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#9A7A3D" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#9A7A3D" stopOpacity="0" />
          </radialGradient>
        )}
      </defs>
      {halo && (
        <circle
          cx={cx}
          cy={cy}
          r={viewBox / 2}
          fill={`url(#sonder-halo-${size})`}
        />
      )}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill={`url(#sonder-node-${size}-${halo ? "h" : "n"})`}
      />
    </svg>
  );
}
