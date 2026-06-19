"use client";

import type { CSSProperties } from "react";

/**
 * SunDot
 *
 * The luminous focal counterweight that sits at the lower-center of the
 * SystemHero. A small gold dot with a soft radial halo, joined to the
 * polyhedron at upper-right by a single curved hairline orbit. A tiny
 * satellite icon rides ~28% along that orbit.
 *
 * Visual hierarchy:
 *   - halo:        very soft radial gradient, ~64px, low opacity, pulses
 *   - core dot:    8px solid gold, steady
 *   - orbit line:  thin gold hairline, curves up-right
 *   - satellite:   3-rect cluster sitting on the orbit
 *
 * Motion
 *   - core dot: steady
 *   - halo: gentle pulse via `.sonder-pulse` keyframe (already in globals.css)
 *   - orbit + satellite: render immediately; no entrance tween needed because
 *     SystemHero composes its own timeline and the sun appears late in it.
 *
 * Reduced motion: pulse stops via the global @media rule in globals.css.
 */

export type SunDotProps = {
  className?: string;
  style?: CSSProperties;
  /** orbit length in px — controls how far the satellite arc reaches */
  orbitWidth?: number;
  /** orbit height in px — controls arc curvature */
  orbitHeight?: number;
};

export default function SunDot({
  className = "",
  style,
  orbitWidth = 320,
  orbitHeight = 140,
}: SunDotProps) {
  const w = orbitWidth;
  const h = orbitHeight;

  /* Orbit path: starts at the sun (left center), arcs up-right to a vanishing
     point near the polyhedron. Single quad bezier. */
  const start = { x: 0, y: h - 4 };
  const end = { x: w - 8, y: 8 };
  const ctrl = { x: w * 0.45, y: -h * 0.15 };
  const orbitD = `M ${start.x} ${start.y} Q ${ctrl.x} ${ctrl.y} ${end.x} ${end.y}`;

  /* Satellite position — 28% along the curve (quad bezier interpolation) */
  const t = 0.28;
  const sx =
    (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * ctrl.x + t * t * end.x;
  const sy =
    (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * ctrl.y + t * t * end.y;

  return (
    <div
      aria-hidden
      className={className}
      style={{
        position: "absolute",
        width: w,
        height: h,
        pointerEvents: "none",
        ...style,
      }}
    >
      {/* Halo + core dot — anchored at orbit start */}
      <div
        style={{
          position: "absolute",
          left: start.x,
          top: start.y,
          width: 0,
          height: 0,
        }}
      >
        <div
          className="sonder-pulse"
          style={{
            position: "absolute",
            width: 64,
            height: 64,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, rgba(154,122,61,0.42) 0%, rgba(154,122,61,0.18) 35%, rgba(154,122,61,0) 70%)",
            filter: "blur(0.4px)",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 10,
            height: 10,
            borderRadius: "50%",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle, #E2C281 0%, #B89154 55%, #6F5528 100%)",
            boxShadow:
              "0 0 8px rgba(226, 194, 129, 0.6), 0 0 18px rgba(154, 122, 61, 0.35)",
          }}
        />
      </div>

      {/* Orbit hairline + satellite */}
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{
          position: "absolute",
          inset: 0,
          overflow: "visible",
        }}
      >
        <path
          d={orbitD}
          stroke="var(--hairline-gold)"
          strokeWidth="0.5"
          strokeDasharray="2 3"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />

        {/* Satellite — 3-rect cluster on the orbit */}
        <g transform={`translate(${sx} ${sy})`}>
          <rect x="-1.8" y="-1.4" width="3.6" height="2.8" fill="var(--gold)" />
          <rect x="-4.5" y="-0.4" width="2.4" height="0.8" fill="var(--gold)" opacity="0.85" />
          <rect x="2.2" y="-0.4" width="2.4" height="0.8" fill="var(--gold)" opacity="0.85" />
        </g>
      </svg>
    </div>
  );
}
