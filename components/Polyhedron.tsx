"use client";

import type { CSSProperties } from "react";

/**
 * Polyhedron — image slot for the gold wireframe stellated polyhedron that
 * occupies the right field of the SystemHero.
 *
 * Source asset lives at `public/assets/system-polyhedron.png` (stellated gold
 * wireframe over parchment facets). Recommended future exports: PNG @ 2x,
 * transparency where you want ivory to bleed through the section background.
 *
 * Until the asset exists, the component renders a faint dashed bounding box
 * so the layout's right field is visible during composition work. Once the
 * PNG is dropped in, swap the `placeholder` flag to false or simply leave
 * it on — the <img> will overlay the placeholder.
 *
 * When the final artifact arrives (whether PNG, SVG, or R3F canvas), only
 * the contents of this component need to change. The SystemHero composition
 * stays untouched.
 */

export type PolyhedronProps = {
  className?: string;
  style?: CSSProperties;
  src?: string;
  /** show a dashed bounding box behind the image during composition */
  showPlaceholder?: boolean;
};

export default function Polyhedron({
  className = "",
  style,
  src = "/assets/system-polyhedron.png",
  showPlaceholder = false,
}: PolyhedronProps) {
  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        ...style,
      }}
      aria-hidden
    >
      {showPlaceholder && (
        <div
          style={{
            position: "absolute",
            inset: "8% 4% 8% 8%",
            border: "1px dashed var(--hairline)",
            borderRadius: "2px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.55,
          }}
        >
          <span
            className="mono uppercase"
            style={{
              fontSize: "10px",
              letterSpacing: "0.22em",
              color: "var(--soft-ink)",
            }}
          >
            POLYHEDRON · ASSET PENDING
          </span>
        </div>
      )}

      {/* The img sits above the placeholder; if the file 404s, browsers
          render its alt text (empty here) and the placeholder remains visible. */}
      <img
        src={src}
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "right center",
          pointerEvents: "none",
        }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
    </div>
  );
}
