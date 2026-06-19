"use client";

/**
 * sections/SystemHero.tsx
 *
 * Reference: /_refs/IMG_4931.jpg
 * Chapter:   02 — SYSTEM (id="system")
 *
 * Headline-only pass. All supporting diagram, metadata, coordinate mesh,
 * sun dot, path index, leader annotations, polyhedron, and bottom corner
 * stamps are deliberately stripped so the typography can be tuned first.
 * They will be re-introduced one cluster at a time once the headline reads
 * cleanly against the reference.
 *
 * Currently visible:
 *   - top-left:  SONDER / DIGITAL CO.
 *   - headline:  STRATEGY. / SHAPES. / GRAVITY.
 */

import { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from "react";
import MaskText from "@/components/MaskText";
import Polyhedron from "@/components/Polyhedron";
import PathIndex from "@/components/PathIndex";

/** Imperative handle so the parent CardPair can fly the satellite during the
 *  post-slide "hold" beat (progress 0 → 1). */
export type SystemFlightHandle = { setFlight: (progress: number) => void };

const SystemHero = forwardRef<SystemFlightHandle>(function SystemHero(_props, ref) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const flightPathRef = useRef<SVGPathElement | null>(null);
  const satelliteRef = useRef<SVGSVGElement | null>(null);
  const setSatRef = useRef<((progress: number) => void) | null>(null);

  /* Satellite positioning. The small yellow satellite is placed along the
     dotted flight path; the path lives in a 100x100 viewBox so getPointAtLength
     returns viewport-percent units directly. The tangent between two samples
     becomes the rotation. The 01→02 CardPair drives `setFlight(progress)` as
     the System card holds after sliding in; on mobile / reduced motion the
     satellite simply rests at the end of its path. */
  useLayoutEffect(() => {
    const path = flightPathRef.current;
    const sat = satelliteRef.current;
    if (!path || !sat) return;

    const total = path.getTotalLength();
    const setSatAt = (progress: number) => {
      const clamped = Math.min(Math.max(progress, 0), 1);
      const len = total * clamped;
      const pt = path.getPointAtLength(len);
      const ahead = path.getPointAtLength(Math.min(len + 0.2, total));
      const angleRad = Math.atan2(ahead.y - pt.y, ahead.x - pt.x);
      // +90 keeps the satellite's panels perpendicular to motion direction.
      const angleDeg = (angleRad * 180) / Math.PI + 90;
      sat.style.top = `${pt.y}%`;
      sat.style.left = `${pt.x}%`;
      sat.style.transform = `translate(-50%, -50%) rotate(${angleDeg}deg)`;
    };

    setSatRef.current = setSatAt;
    // Default rest position (overridden by CardPair's hold beat on desktop).
    setSatAt(1);

    return () => {
      setSatRef.current = null;
    };
  }, []);

  useImperativeHandle(
    ref,
    () => ({ setFlight: (p: number) => setSatRef.current?.(p) }),
    []
  );

  return (
    <section
      ref={sectionRef}
      id="system"
      className="system-section relative w-full overflow-hidden"
      style={{
        background: "var(--ivory-light)",
        color: "var(--ink)",
        height: "100svh",
        minHeight: 720,
        paddingLeft: "var(--gutter)",
        paddingRight: "var(--gutter)",
        paddingTop: "clamp(16px, 2vh, 28px)",
      }}
    >
      {/* (Per-section masthead removed — the persistent EditorialNav now owns
          the SONDER / DIGITAL CO. logotype sitewide.) */}

      {/* Top-right technical mesh — pre-rendered linework asset.
          Trimmed PNG (907x513, transparent background, transparent cell
          interiors). Sized large enough to span the upper-right field and
          overlap the polyhedron's upper-right zone. Rendered behind the
          polyhedron via DOM order (both at z=1, polyhedron declared later
          so it paints on top). Opacity 0.65 keeps the mesh as quiet
          scaffolding — the polyhedron remains dominant. */}
      <img
        src="/assets/section-02-technical-mesh.png"
        alt=""
        aria-hidden
        className="system-mesh"
        style={{
          position: "absolute",
          top: "8%",
          right: "0%",
          width: "clamp(520px, 46vw, 820px)",
          height: "auto",
          objectFit: "contain",
          opacity: 0.65,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Polyhedron right field — subtle framing of STRATEGY's Y.
          The PNG was pre-cropped via `magick -trim` (617x740 bounding box).
          aspectRatio honors the exact trimmed ratio. */}
      <div
        aria-hidden
        className="system-polyhedron"
        style={{
          position: "absolute",
          top: "48%",
          right: "clamp(16px, 2vw, 40px)",
          transform: "translateY(-50%)",
          width: "clamp(376px, 35vw, 564px)",
          aspectRatio: "617 / 740",
          zIndex: 1,
          pointerEvents: "none",
        }}
      >
        <Polyhedron />
      </div>

      {/* Orbital leader lines — Phase C1. Two faint curved hairlines that
          arc through the sun-dot, suggesting the implied orbital path
          connecting the label cluster. z=2 sits above mesh/polyhedron
          (z=1) and BELOW both the sun-dot (z=3) and labels (z=4), so the
          lines pass under the dot and text rather than over them.
          SVG uses a 100x100 viewBox with preserveAspectRatio="none" so
          path coords read as direct percentages of the section.
          non-scaling-stroke keeps the hairline weight constant. */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          zIndex: 2,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {/* Path 1 — arcs from the left labels (01/02 cluster) inward
            toward the sun-dot at (30, 70). */}
        <path
          d="M 13 69 C 20 65, 28 66, 30 70"
          fill="none"
          stroke="rgba(154, 122, 61, 0.24)"
          strokeWidth="0.9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
        {/* Path 2 — continues from the sun-dot outward toward the
            upper-right (label 04/05 area). */}
        <path
          d="M 30 70 C 34 66, 40 63, 45 61"
          fill="none"
          stroke="rgba(154, 122, 61, 0.22)"
          strokeWidth="0.9"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Grand orbital arc — the signature compositional gesture from
            the reference. One long graceful curve that originates near
            the upper-right mesh region (around 60% / 18%), sweeps OUT
            to the right past the polyhedron (bulging through ~95% / 35%)
            then arcs back DOWN and LEFT to land at the sun-dot
            (30%, 70%). The outward bulge gives it true orbital geometry
            — a satellite trajectory, not a diagonal slash. */}
        <path
          d="M 60 18 C 95 32, 78 64, 30 70"
          fill="none"
          stroke="rgba(154, 122, 61, 0.34)"
          strokeWidth="1"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Per-label leader hairlines — Phase C3. Five whisper-thin
            curves, one from each path label toward the sun-dot at
            (30, 70). Each leader originates near the inner edge of its
            label (the side facing the dot) and arcs gently inward.
            Strokes are lighter than the orbital arcs so the per-label
            ties read as a quieter cross-system layer. */}

        {/* 01 POSITIONING (label at 11%, 64%) — from right of label inward */}
        <path
          d="M 22 65 Q 26 68 30 70"
          fill="none"
          stroke="rgba(154, 122, 61, 0.20)"
          strokeWidth="0.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* 02 NARRATIVE (label at 15%, 74%) — from right of label rising up */}
        <path
          d="M 24 75 Q 27 73 30 70"
          fill="none"
          stroke="rgba(154, 122, 61, 0.20)"
          strokeWidth="0.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* 03 MOTION (label at 29%, 79%) — vertical rise from label up to dot */}
        <path
          d="M 30 77 Q 30.5 74 30 70"
          fill="none"
          stroke="rgba(154, 122, 61, 0.18)"
          strokeWidth="0.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* 04 INTERFACE (label at 38%, 67%) — from left of label arcing inward */}
        <path
          d="M 37 68 Q 34 69 30 70"
          fill="none"
          stroke="rgba(154, 122, 61, 0.20)"
          strokeWidth="0.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* 05 MOTION (label at 30%, 62%) — short drop from label down to dot */}
        <path
          d="M 32 64 Q 31 67 30 70"
          fill="none"
          stroke="rgba(154, 122, 61, 0.18)"
          strokeWidth="0.6"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        {/* Sun → satellite flight trajectory — single smooth curve
            that sweeps around the G in GRAVITY.
            Geometry (viewBox = percentages):
              M 30 70        start at sun-dot
              C 22 72        control 1: pulls curve slightly down-left
                               at the start so it banks under GRAVITY
                               rather than diving straight at it
                -5 42        control 2: pulls curve far up-and-LEFT,
                               carrying it past the G's left edge
                3 27         end: just to the LEFT of the S in SHAPES
            ref'd so the scroll-driven flight animation samples it. */}
        <path
          ref={flightPathRef}
          d="M 30 70 C 22 72 -5 42 3 27"
          fill="none"
          stroke="rgba(154, 122, 61, 0.55)"
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeDasharray="0.5 1.6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      {/* Sun-side satellite glyph — small filled-yellow satellite that
          flies along the dotted flight path as the section scrolls into
          view (see scroll trigger in useLayoutEffect above). The inline
          top/left/transform values below are the START state (at the
          sun-dot). On mount, useLayoutEffect immediately positions the
          satellite at progress 0, then scroll updates take over. */}
      <svg
        ref={satelliteRef}
        aria-hidden
        viewBox="0 0 36 18"
        style={{
          position: "absolute",
          top: "70%",
          left: "30%",
          width: "clamp(34px, 2.8vw, 48px)",
          height: "auto",
          transform: "translate(-50%, -50%) rotate(-25deg)",
          zIndex: 4,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {/* Left solar panel — yellow fill + dark outline + cell divisions */}
        <rect
          x="2"
          y="7"
          width="10"
          height="4"
          fill="rgba(230, 190, 95, 0.92)"
          stroke="rgba(90, 65, 28, 0.85)"
          strokeWidth="0.7"
        />
        <line x1="5.3" y1="7" x2="5.3" y2="11" stroke="rgba(90, 65, 28, 0.75)" strokeWidth="0.5" />
        <line x1="8.6" y1="7" x2="8.6" y2="11" stroke="rgba(90, 65, 28, 0.75)" strokeWidth="0.5" />

        {/* Body — warmer/deeper yellow so it reads as the satellite core */}
        <rect
          x="14"
          y="6"
          width="6"
          height="6"
          fill="rgba(245, 205, 105, 0.95)"
          stroke="rgba(90, 65, 28, 0.95)"
          strokeWidth="0.85"
        />

        {/* Right solar panel — mirror of left */}
        <rect
          x="22"
          y="7"
          width="10"
          height="4"
          fill="rgba(230, 190, 95, 0.92)"
          stroke="rgba(90, 65, 28, 0.85)"
          strokeWidth="0.7"
        />
        <line x1="25.3" y1="7" x2="25.3" y2="11" stroke="rgba(90, 65, 28, 0.75)" strokeWidth="0.5" />
        <line x1="28.6" y1="7" x2="28.6" y2="11" stroke="rgba(90, 65, 28, 0.75)" strokeWidth="0.5" />

        {/* Antenna mast */}
        <line
          x1="17"
          y1="6"
          x2="17"
          y2="2.5"
          stroke="rgba(90, 65, 28, 0.85)"
          strokeWidth="0.8"
        />

        {/* Dish dot */}
        <circle cx="17" cy="2" r="1.2" fill="rgba(245, 205, 105, 0.98)" stroke="rgba(90, 65, 28, 0.85)" strokeWidth="0.5" />

        {/* Tail mast — mirror of antenna, extending down from body */}
        <line
          x1="17"
          y1="12"
          x2="17"
          y2="15.5"
          stroke="rgba(90, 65, 28, 0.85)"
          strokeWidth="0.8"
        />

        {/* Tail fin — short horizontal stabilizer at end of tail mast */}
        <line
          x1="15"
          y1="15.5"
          x2="19"
          y2="15.5"
          stroke="rgba(90, 65, 28, 0.9)"
          strokeWidth="0.9"
          strokeLinecap="round"
        />
      </svg>

      {/* Satellite glyph — Phase D. Tiny line-art satellite sitting just
          above the start of the grand orbital arc. Implies the arc is
          a trajectory rather than an abstract gesture. Its own SVG so
          each stroke can use natural ~1px widths instead of fractional
          viewBox units. z=2 keeps it on the linework atmosphere layer. */}
      <svg
        aria-hidden
        viewBox="0 0 36 18"
        style={{
          position: "absolute",
          top: "13.5%",
          left: "58%",
          width: "clamp(28px, 2.4vw, 44px)",
          height: "auto",
          zIndex: 2,
          pointerEvents: "none",
          overflow: "visible",
        }}
      >
        {/* Left solar panel — outer rectangle + 2 internal cell divisions */}
        <rect
          x="2"
          y="7"
          width="10"
          height="4"
          fill="none"
          stroke="rgba(154, 122, 61, 0.45)"
          strokeWidth="0.7"
        />
        <line x1="5.3" y1="7" x2="5.3" y2="11" stroke="rgba(154, 122, 61, 0.35)" strokeWidth="0.5" />
        <line x1="8.6" y1="7" x2="8.6" y2="11" stroke="rgba(154, 122, 61, 0.35)" strokeWidth="0.5" />

        {/* Body — central rectangle, slightly stronger stroke */}
        <rect
          x="14"
          y="6"
          width="6"
          height="6"
          fill="none"
          stroke="rgba(154, 122, 61, 0.55)"
          strokeWidth="0.85"
        />

        {/* Right solar panel — mirror of left */}
        <rect
          x="22"
          y="7"
          width="10"
          height="4"
          fill="none"
          stroke="rgba(154, 122, 61, 0.45)"
          strokeWidth="0.7"
        />
        <line x1="25.3" y1="7" x2="25.3" y2="11" stroke="rgba(154, 122, 61, 0.35)" strokeWidth="0.5" />
        <line x1="28.6" y1="7" x2="28.6" y2="11" stroke="rgba(154, 122, 61, 0.35)" strokeWidth="0.5" />

        {/* Antenna mast — short vertical from top of body */}
        <line
          x1="17"
          y1="6"
          x2="17"
          y2="2.5"
          stroke="rgba(154, 122, 61, 0.50)"
          strokeWidth="0.7"
        />

        {/* Dish dot at antenna tip */}
        <circle cx="17" cy="2" r="0.9" fill="rgba(154, 122, 61, 0.7)" />

        {/* Tail mast — mirror of antenna, extending down from body */}
        <line
          x1="17"
          y1="12"
          x2="17"
          y2="15.5"
          stroke="rgba(154, 122, 61, 0.50)"
          strokeWidth="0.7"
        />

        {/* Tail fin — short horizontal stabilizer at end of tail mast */}
        <line
          x1="15"
          y1="15.5"
          x2="19"
          y2="15.5"
          stroke="rgba(154, 122, 61, 0.55)"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      </svg>

      {/* Sun-dot anchor — quiet gold focal point that the path labels
          implicitly orbit. Phase B: dot only, no leader lines, no motion.
          z=3 sits above mesh/polyhedron (z=1) and below labels (z=4) so
          any label that overlaps the dot reads as label-over-dot. */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          top: "70%",
          left: "30%",
          width: "22px",
          height: "22px",
          borderRadius: "999px",
          background:
            "radial-gradient(circle at 50% 50%, rgba(255, 252, 240, 1) 0%, rgba(255, 230, 160, 0.98) 22%, rgba(240, 195, 110, 0.85) 50%, rgba(195, 150, 80, 0.38) 78%, rgba(176, 137, 74, 0) 100%)",
          boxShadow:
            "0 0 4px 1px rgba(255, 220, 150, 0.85), 0 0 12px 3px rgba(220, 175, 90, 0.65), 0 0 32px 8px rgba(193, 150, 80, 0.40), 0 0 80px 20px rgba(176, 137, 74, 0.20), 0 0 160px 40px rgba(176, 137, 74, 0.08)",
          transform: "translate(-50%, -50%)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* Path index — five quiet mono captions arranged in a loose fan
          across the lower-left and lower-center negative space. Phase A:
          text-only (no leader lines, no animation).
          z=4 sits above mesh/polyhedron (z=1) and the sun-dot (z=3),
          below headline (z=5). */}
      <PathIndex
        className="system-pathindex"
        style={{ zIndex: 4 }}
        positions={[
          { top: "64%", left: "11%" }, // 01 POSITIONING
          { top: "74%", left: "15%" }, // 02 NARRATIVE
          { top: "79%", left: "29%" }, // 03 MOTION
          { top: "67%", left: "38%" }, // 04 INTERFACE
          { top: "62%", left: "30%" }, // 05 MOTION
        ]}
      />

      {/* Headline column — staggered editorial composition.
          Each line has its own left offset to match the reference's
          off-axis poster layout:
            STRATEGY.   x = 0      (anchor)
            SHAPES.     x = +~180px (large right shift, serif focal moment)
            GRAVITY.    x = +~16px  (subtle staircase back toward STRATEGY)
          The outer div uses width: 100% so offsets are relative to the
          full section width, not a clamped column. */}
      <div
        className="relative"
        style={{
          marginTop: "clamp(8px, 1vh, 16px)",
          width: "100%",
          zIndex: 5,
        }}
      >
        {/* STRATEGY. — furthest right; anchor of the cascade */}
        <div style={{ paddingLeft: "clamp(96px, 12vw, 188px)" }}>
          <MaskText
            as="h1"
            className="system-display-sans"
            lines={[
              <span key="s">
                STRATEGY
                <span style={{ fontWeight: 700 }}>.</span>
              </span>,
            ]}
            stagger={0.06}
          />
        </div>

        {/* SHAPES. — large step left of STRATEGY; serif focal counterpoint */}
        <div style={{ paddingLeft: "clamp(40px, 5vw, 80px)" }}>
          <MaskText
            as="h1"
            className="system-display-serif-italic"
            lines={[
              <span key="sh">
                SHAPES
                <span style={{ fontWeight: 700, fontStyle: "normal", fontFamily: "var(--font-serif)" }}>.</span>
              </span>,
            ]}
            delay={0.22}
            stagger={0.06}
          />
        </div>

        {/* GRAVITY. — leftmost; hugs the gutter, maximum editorial tension */}
        <div style={{ paddingLeft: "clamp(8px, 1.2vw, 20px)" }}>
          <MaskText
            as="h1"
            className="system-display-sans"
            lines={[
              <span key="g">
                GRAVITY
                <span style={{ fontWeight: 700 }}>.</span>
              </span>,
            ]}
            delay={0.44}
            stagger={0.06}
          />
        </div>
      </div>
    </section>
  );
});

export default SystemHero;
