"use client";

import { useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap, ensureGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * CoordinateMesh
 *
 * The top-right antique-gold technical mesh from IMG_4931. A fan of thin
 * radial spokes emanates from an anchor at the SVG's lower-left (positioned
 * to coincide with the polyhedron's upper-right star tip in the parent
 * layout) and spreads toward the top-right corner of the frame.
 *
 * The mesh has three structural layers:
 *   1. Spokes      — solid hairlines radiating from anchor to forward verts
 *   2. Edges       — short connectors triangulating the forward verts
 *   3. Vertex nodes — small gold dots anchoring the triangulation
 *
 * Optional decorations (default off in `quiet` mode):
 *   - Curved satellite trajectory + satellite icon
 *   - Coordinate labels (34.052, 118.243) at vertex anchors
 *   - GSAP stroke-draw entrance animation
 *
 * Props:
 *   - quiet:   suppress labels, satellite, and entrance animation. Use this
 *              when adding the first technical linework layer before any
 *              text/copy/motion is introduced.
 */

export type CoordinateMeshProps = {
  className?: string;
  style?: CSSProperties;
  width?: number;
  height?: number;
  /** Linework-only mode: no labels, no satellite icon, no animation. */
  quiet?: boolean;
};

export default function CoordinateMesh({
  className = "",
  style,
  width = 440,
  height = 300,
  quiet = false,
}: CoordinateMeshProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const w = width;
  const h = height;

  /* Anchor — bottom-left of the SVG. In SystemHero, the wrapper is positioned
     so this point overlaps with the polyhedron's upper-right star tip,
     making the mesh appear to emanate from the object itself. */
  const anchor = { x: w * 0.06, y: h * 0.92 };

  /* Forward vertices fanning from anchor toward top-right corner.
     Spacing is slightly irregular so the triangulation reads as a
     measured technical drawing, not a perfect radial. */
  const v1 = { x: w * 0.28, y: h * 0.52 }; // mid-low
  const v2 = { x: w * 0.46, y: h * 0.24 }; // mid-upper
  const v3 = { x: w * 0.68, y: h * 0.08 }; // top-mid
  const v4 = { x: w * 0.92, y: h * 0.18 }; // top-right (apex)
  const v5 = { x: w * 0.96, y: h * 0.52 }; // right-mid

  /* Satellite (only rendered when !quiet) — upper-left, with a dashed
     trajectory arcing toward v3. */
  const satX = w * 0.10;
  const satY = h * 0.10;
  const trajD = `M ${satX + 8} ${satY} Q ${(satX + v3.x) / 2} ${satY - 24} ${v3.x} ${v3.y}`;

  /* Spokes — anchor → each forward vertex. Strongest linework layer. */
  const spokes = [
    `M ${anchor.x} ${anchor.y} L ${v1.x} ${v1.y}`,
    `M ${anchor.x} ${anchor.y} L ${v2.x} ${v2.y}`,
    `M ${anchor.x} ${anchor.y} L ${v3.x} ${v3.y}`,
    `M ${anchor.x} ${anchor.y} L ${v4.x} ${v4.y}`,
    `M ${anchor.x} ${anchor.y} L ${v5.x} ${v5.y}`,
  ];

  /* Edges — triangulating the forward vertices. Thinner, fainter. */
  const edges = [
    `M ${v1.x} ${v1.y} L ${v2.x} ${v2.y}`,
    `M ${v2.x} ${v2.y} L ${v3.x} ${v3.y}`,
    `M ${v3.x} ${v3.y} L ${v4.x} ${v4.y}`,
    `M ${v4.x} ${v4.y} L ${v5.x} ${v5.y}`,
    `M ${v1.x} ${v1.y} L ${v5.x} ${v5.y}`,
  ];

  useLayoutEffect(() => {
    if (!rootRef.current) return;
    if (quiet) return; // quiet mode renders final state with no JS motion
    try {
      ensureGsap();
    } catch {
      return;
    }

    const paths = rootRef.current.querySelectorAll<SVGPathElement>("path.mesh-stroke");
    const labels = rootRef.current.querySelectorAll<HTMLElement>(".mesh-label");
    const sat = rootRef.current.querySelector<SVGGElement>(".mesh-satellite");

    if (prefersReducedMotion()) {
      paths.forEach((p) => {
        p.style.strokeDasharray = "";
        p.style.strokeDashoffset = "0";
      });
      labels.forEach((l) => (l.style.opacity = "1"));
      if (sat) sat.style.opacity = "1";
      return;
    }

    paths.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.style.strokeDashoffset = `${len}`;
    });
    labels.forEach((l) => (l.style.opacity = "0"));
    if (sat) sat.style.opacity = "0";

    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });
    tl.to(paths, { strokeDashoffset: 0, duration: 1.2, stagger: 0.06 })
      .to(labels, { opacity: 1, duration: 0.5, stagger: 0.08 }, "-=0.6")
      .to(sat, { opacity: 1, duration: 0.5 }, "-=0.6");

    return () => {
      tl.kill();
    };
  }, [w, h, quiet]);

  return (
    <div
      ref={rootRef}
      className={className}
      style={{
        position: "relative",
        width: w,
        height: h,
        pointerEvents: "none",
        ...style,
      }}
      aria-hidden
    >
      <svg
        width={w}
        height={h}
        viewBox={`0 0 ${w} ${h}`}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        {/* Satellite trajectory — only when not quiet */}
        {!quiet && (
          <path
            className="mesh-stroke"
            d={trajD}
            stroke="var(--hairline-gold)"
            strokeWidth="0.6"
            fill="none"
            strokeDasharray="2 3"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* Spokes — solid antique gold, primary structure */}
        {spokes.map((d, i) => (
          <path
            key={`s${i}`}
            className="mesh-stroke"
            d={d}
            stroke="var(--gold)"
            strokeWidth="0.5"
            opacity="0.42"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Edges — thinner triangulation between forward vertices */}
        {edges.map((d, i) => (
          <path
            key={`e${i}`}
            className="mesh-stroke"
            d={d}
            stroke="var(--gold)"
            strokeWidth="0.4"
            opacity="0.32"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        ))}

        {/* Vertex nodes — tiny gold dots, anchor + each forward vertex */}
        {[anchor, v1, v2, v3, v4, v5].map((p, i) => (
          <circle
            key={`n${i}`}
            cx={p.x}
            cy={p.y}
            r={i === 0 ? 1.8 : 1.2}
            fill="var(--gold)"
            opacity={i === 0 ? 0.72 : 0.5}
          />
        ))}

        {/* Satellite icon — only when not quiet */}
        {!quiet && (
          <g
            className="mesh-satellite"
            transform={`translate(${satX} ${satY})`}
          >
            <rect x="-2" y="-1.5" width="4" height="3" fill="var(--gold)" />
            <rect x="-6" y="-0.5" width="3" height="1" fill="var(--gold)" />
            <rect x="3" y="-0.5" width="3" height="1" fill="var(--gold)" />
            <rect x="-1" y="-3" width="2" height="1.4" fill="var(--gold)" opacity="0.8" />
          </g>
        )}
      </svg>

      {/* Coordinate labels — only when not quiet */}
      {!quiet && (
        <>
          <span
            className="mesh-label mono"
            style={{
              position: "absolute",
              top: `${(v3.y / h) * 100}%`,
              left: `${(v3.x / w) * 100}%`,
              transform: "translate(-50%, -130%)",
              fontSize: "10px",
              letterSpacing: "0.14em",
              color: "var(--gold)",
              opacity: 0.85,
              whiteSpace: "nowrap",
            }}
          >
            34.052
          </span>
          <span
            className="mesh-label mono"
            style={{
              position: "absolute",
              top: `${(v4.y / h) * 100}%`,
              left: `${(v4.x / w) * 100}%`,
              transform: "translate(-30%, -130%)",
              fontSize: "10px",
              letterSpacing: "0.14em",
              color: "var(--gold)",
              opacity: 0.85,
              whiteSpace: "nowrap",
            }}
          >
            118.243
          </span>
        </>
      )}
    </div>
  );
}
