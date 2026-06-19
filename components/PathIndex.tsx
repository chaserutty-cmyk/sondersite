/**
 * components/PathIndex.tsx
 *
 * Section 02 path-index labels — quiet, text-only, absolute-positioned
 * mono captions arranged in a loose fan around the lower-left/center
 * negative space of `SystemHero`.
 *
 * Each entry renders two lines:
 *   1. "{id} — PATH"        — quietest, cap-line marker
 *   2. "{coord}: {label}"   — slightly more present, value-line
 *
 * The component is purely presentational:
 *   - no animation (Phase A is text-only)
 *   - no sun-dot or leader lines (those are explicit later phases)
 *   - no decorative elements
 *   - pointer-events disabled, aria-hidden
 *
 * Placement model
 *   The consumer passes a `positions` array parallel to the entries.
 *   Each position is a CSS `top` / `left` string (typically a percentage)
 *   resolved against the nearest positioned ancestor. The wrapper itself
 *   is `position: absolute, inset: 0` so positions resolve against the
 *   parent section.
 */

import type { CSSProperties } from "react";
import { systemPaths, type SystemPath } from "@/lib/tokens";

export type PathIndexPosition = {
  /** CSS `top` value (e.g. "64%") */
  top: string;
  /** CSS `left` value (e.g. "11%") */
  left: string;
};

export type PathIndexProps = {
  /** Path entries to render. Defaults to the full `systemPaths` array. */
  entries?: readonly SystemPath[];
  /** Parallel-array of positions; one entry per path. */
  positions: readonly PathIndexPosition[];
  className?: string;
  style?: CSSProperties;
};

export default function PathIndex({
  entries = systemPaths,
  positions,
  className = "",
  style,
}: PathIndexProps) {
  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        ...style,
      }}
      aria-hidden
    >
      {entries.map((p, i) => {
        const pos = positions[i];
        if (!pos) return null;
        return (
          <div
            key={p.id}
            className="path-entry"
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              display: "flex",
              flexDirection: "column",
              gap: "4px",
              whiteSpace: "nowrap",
            }}
          >
            {/* Line 1 — cap marker, quietest */}
            <span
              className="mono"
              style={{
                fontFamily: "var(--font-mono), ui-monospace, monospace",
                fontSize: "10px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "rgba(17, 17, 17, 0.58)",
                fontWeight: 400,
                lineHeight: 1,
              }}
            >
              {p.id} — PATH
            </span>

            {/* Line 2 — value line: coord and label */}
            <span
              className="mono"
              style={{
                fontFamily: "var(--font-mono), ui-monospace, monospace",
                fontSize: "11px",
                letterSpacing: "0.04em",
                color: "rgba(17, 17, 17, 0.78)",
                fontWeight: 500,
                lineHeight: 1,
              }}
            >
              {p.coord}: {p.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
