"use client";

import { useLayoutEffect, useRef } from "react";
import type { CSSProperties } from "react";
import { gsap, ensureGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * LeaderAnnotation
 *
 * A mono label joined to the layout by a thin hairline. Reads like a spec-sheet
 * callout pointing into the headline.
 *
 *   ┌── SC61164 L-RO
 *   │   77 X
 *   └────────────────►  (line extends `length` px toward the layout)
 *
 * The component is self-contained: it places a small label block with a bracket
 * border on the side facing the layout, and an SVG line emerging from that edge.
 * The line is given a fixed pixel `length` so the consumer doesn't need to
 * reason about cross-coordinate-system geometry.
 *
 * Curve
 * - "straight": single horizontal line
 * - "curve":    quad bezier with a soft sag (positive `sag` curves up, negative down)
 *
 * Tone
 * - "ink":  muted ink hairline + label
 * - "gold": gold hairline + gold-tinted label
 *
 * Motion
 * - Line stroke-draws over 0.8s on mount; respects prefers-reduced-motion.
 *
 * Visibility
 * - Hidden below 1024px viewport via `.system-section .leader-annotation { display: none }`
 *   in globals.css. Leaders are a desktop-only luxury.
 */

type CSSLen = string | number;

export type LeaderAnnotationProps = {
  lines: string[];
  /** absolute position of the label block within the parent positioned ancestor */
  position: {
    top?: CSSLen;
    left?: CSSLen;
    right?: CSSLen;
    bottom?: CSSLen;
  };
  /** which side the leader line emerges from */
  side?: "right" | "left";
  /** length of the hairline in pixels */
  length?: number;
  /** vertical curvature in pixels: positive = sag up, negative = sag down, 0 = straight */
  sag?: number;
  /** tonal palette */
  tone?: "ink" | "gold";
  /** seconds to wait before the line draws */
  delay?: number;
  className?: string;
  style?: CSSProperties;
};

function toCss(v: CSSLen): string {
  return typeof v === "number" ? `${v}px` : v;
}

export default function LeaderAnnotation({
  lines,
  position,
  side = "right",
  length = 180,
  sag = 0,
  tone = "ink",
  delay = 0,
  className = "",
  style,
}: LeaderAnnotationProps) {
  const pathRef = useRef<SVGPathElement | null>(null);

  useLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    try {
      ensureGsap();
    } catch {
      return;
    }

    if (prefersReducedMotion()) {
      path.style.strokeDasharray = "";
      path.style.strokeDashoffset = "0";
      return;
    }

    const len = path.getTotalLength();
    path.style.strokeDasharray = `${len}`;
    path.style.strokeDashoffset = `${len}`;
    const tween = gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.8,
      ease: "power2.out",
      delay,
    });
    return () => {
      tween.kill();
    };
  }, [delay, length, sag, side]);

  const stroke =
    tone === "gold" ? "var(--hairline-gold)" : "var(--hairline-strong)";
  const labelColor =
    tone === "gold" ? "var(--gold)" : "var(--soft-ink)";
  const borderColor = stroke;

  /* Bracket border on the side facing AWAY from the line emerges from. So if
     the line extends to the right, the bracket border is on the LEFT of the
     label (a left-bracket). */
  const bracketSide = side === "right" ? "borderLeft" : "borderRight";

  /* SVG line geometry — fixed viewBox in pixels matching the rendered size. */
  const svgH = Math.max(20, Math.abs(sag) * 2 + 20);
  const yMid = svgH / 2;
  const startX = side === "right" ? 0 : length;
  const endX = side === "right" ? length : 0;
  const cx = (startX + endX) / 2;
  const cy = yMid - sag;
  const d =
    sag === 0
      ? `M ${startX} ${yMid} L ${endX} ${yMid}`
      : `M ${startX} ${yMid} Q ${cx} ${cy} ${endX} ${yMid}`;

  return (
    <div
      aria-hidden
      className={`leader-annotation ${className}`}
      style={{
        position: "absolute",
        top: position.top !== undefined ? toCss(position.top) : undefined,
        left: position.left !== undefined ? toCss(position.left) : undefined,
        right: position.right !== undefined ? toCss(position.right) : undefined,
        bottom: position.bottom !== undefined ? toCss(position.bottom) : undefined,
        pointerEvents: "none",
        zIndex: 8,
        display: "flex",
        alignItems: "flex-start",
        flexDirection: side === "right" ? "row" : "row-reverse",
        ...style,
      }}
    >
      <div
        style={{
          [bracketSide]: `1px solid ${borderColor}`,
          paddingLeft: side === "right" ? "8px" : "0",
          paddingRight: side === "left" ? "8px" : "0",
          textAlign: side === "right" ? "left" : "right",
        }}
      >
        {lines.map((line, i) => (
          <div
            key={i}
            className="mono uppercase"
            style={{
              fontSize: "10px",
              letterSpacing: "0.18em",
              color: labelColor,
              lineHeight: 1.5,
              opacity: tone === "gold" ? 0.9 : 0.62,
              whiteSpace: "nowrap",
            }}
          >
            {line}
          </div>
        ))}
      </div>

      <svg
        width={length}
        height={svgH}
        viewBox={`0 0 ${length} ${svgH}`}
        style={{
          overflow: "visible",
          flexShrink: 0,
          marginTop: side === "right" ? "0.55em" : "0.55em",
        }}
      >
        <path
          ref={pathRef}
          d={d}
          stroke={stroke}
          strokeWidth="0.5"
          fill="none"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}
