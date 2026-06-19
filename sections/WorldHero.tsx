"use client";

/**
 * sections/WorldHero.tsx
 *
 * Reference: /_refs/IMG_4934.PNG
 * Chapter:   03 — WORLD (id="world")
 *
 * Static editorial frame. All composition is server-rendered SVG / DOM —
 * no client JS, no animation, no "use client" directive.
 *
 * Composition:
 *   - underlay  : whisper draft grid (128 px squares at 6% ink, gutter-
 *                 contained, sits below every painted layer)
 *   - top-left  : SONDER / DIGITAL CO. masthead
 *   - top-right : moon + sun cluster (celestial counterweight to masthead)
 *   - left      : huge cropped 03 — / WORLD chapter monument
 *                 (bleeds past the left gutter on purpose)
 *   - right     : statement + gold-accented quote
 *                 (the bold gold "authored experience" phrase overlaps
 *                  into the WORLD stamp's airspace — designed collision)
 *   - registration: four hair-thin "+" crosshair marks at quartered
 *                   positions, implying an underlying engineered grid
 *   - left band : paired upper-left crosshair + READING 03 coordinate
 *                 reading (mono caps), turns the empty band into a quiet
 *                 instrument log
 *   - bottom-left: 03 — WORLD folio
 *   - bottom-right: 4-point sparkle (closing glint of "signal")
 *
 * Layer order (z-index):
 *   0  Whisper grid (underlay)
 *   1  WORLD stamp (atmosphere)
 *   3  Local fade haze (D ↔ "e" overlap softening)
 *   5  Right-column type (meaning)
 *  10  Metadata (masthead, folio, cluster, crosshairs, sparkle)
 */
import { useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import Crosshair from "@/components/Crosshair";
import DayNightCluster from "@/components/DayNightCluster";
import SparkleGlyph from "@/components/SparkleGlyph";

export default function WorldHero() {
  const sectionRef = useRef<HTMLElement | null>(null);

  /* Chapter entrance — the whole WORLD spread fades and rises into place as it
     scrolls in. Applied to the section element itself (which carries no inline
     transform), so the children's own transforms are untouched. `reveal-ready`
     is only added after mount, so no-JS / reduced-motion keeps it visible. */
  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (prefersReducedMotion()) return;
    section.classList.add("reveal-ready");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add("in-view");
            obs.disconnect();
          }
        });
      },
      { threshold: 0.05 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="world"
      className="world-section relative w-full overflow-hidden paper-grain"
      style={{
        background: "var(--ivory)",
        color: "var(--ink)",
        height: "100svh",
        minHeight: 720,
        paddingLeft: "var(--gutter)",
        paddingRight: "var(--gutter)",
      }}
    >
      {/* (Whisper draft grid removed — it read as unfinished scaffolding. The
          site-wide paper grain now carries the texture, and the registration
          crosshairs below remain as the intentional measured marks.) */}

      {/* (Per-section masthead removed — the persistent EditorialNav now owns
          the SONDER / DIGITAL CO. logotype sitewide.) */}

      {/* Top-right: moon + sun cluster -------------------------------------- */}
      {/* Counterweights the masthead — celestial signature on the same vertical
          register, mirrored across the page. Static decorative SVG. */}
      <DayNightCluster
        size={18}
        tone="ink"
        gap={10}
        style={{
          position: "absolute",
          top: "clamp(40px, 5vh, 64px)",
          right: "var(--gutter)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Registration crosshairs — three hair-thin "+" marks at quartered
          positions. Implied grid that converts the romantic typography into
          a measured composition. Read as printer's marks / surveyor targets. */}
      <Crosshair
        size={14}
        tone="ink"
        className="world-crosshair-mid"
        style={{
          position: "absolute",
          top: "clamp(56px, 8vh, 112px)",
          left: "clamp(280px, 32vw, 520px)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      <Crosshair
        size={14}
        tone="ink"
        className="world-crosshair-mid"
        style={{
          position: "absolute",
          top: "clamp(72px, 10vh, 140px)",
          right: "clamp(240px, 22vw, 360px)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      <Crosshair
        size={14}
        tone="ink"
        className="world-crosshair-mid"
        style={{
          position: "absolute",
          bottom: "clamp(64px, 9vh, 128px)",
          left: "clamp(460px, 55vw, 880px)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      {/* Upper-left registration: crosshair + coordinate reading.
          The "+" marks a point on the implied grid; the mono caps label
          below names what was measured at that point. The two share the
          same x-axis (left: 8vw) so they read as one paired instrument
          marking — a tick and the field-reading it registers. */}
      <Crosshair
        size={14}
        tone="ink"
        className="world-coord-mark"
        style={{
          position: "absolute",
          top: "clamp(140px, 20vh, 248px)",
          left: "clamp(80px, 8vw, 140px)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      <div
        className="world-coord-mark absolute"
        style={{
          top: "clamp(180px, 25vh, 308px)",
          left: "clamp(80px, 8vw, 140px)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      >
        <span
          className="label-tech"
          style={{
            display: "block",
            color: "var(--soft-ink)",
            letterSpacing: "0.24em",
          }}
        >
          READING 03
        </span>
        <span
          className="label-tech"
          style={{
            display: "block",
            color: "var(--soft-ink)",
            letterSpacing: "0.16em",
            marginTop: "4px",
          }}
        >
          47.5601° N · 19.0521° E
        </span>
      </div>

      {/* Left chapter monument — 03 — / WORLD ------------------------------ */}
      {/* bottom: clamp(52px, 7vh, 76px) clears the folio label (11px text +
          its own clamp(28px,4vh,48px) offset) with a small breathing gap.
          WORLD's baseline lands just above the 03 — WORLD folio stamp. */}
      <div
        className="absolute"
        style={{
          left: "var(--gutter)",
          bottom: "clamp(52px, 7vh, 76px)",
          zIndex: 1,
          pointerEvents: "none",
          opacity: 0.85,
        }}
      >
        <span className="world-stamp-index" style={{ display: "block" }}>
          03 —
        </span>
        <span className="world-stamp" style={{ display: "block" }}>
          WORLD
        </span>
      </div>

      {/* Centered statement: We engineer presence. ------------------------- */}
      {/* Pulled out of the right column so it can anchor on the page midline.
          left: 50% + translateX(-50%) puts the wrapper's centre on the page
          centre; textAlign: center stacks the two lines under that point. */}
      <h2
        className="world-statement absolute"
        style={{
          margin: 0,
          color: "#10100E",
          opacity: 1,
          fontWeight: 700,
          top: "clamp(72px, 10vh, 140px)",
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 5,
        }}
      >
        We engineer
        <br />
        presence.
      </h2>

      {/* Right text column — quote only ------------------------------------ */}
      {/* world-quote-col hidden on mobile; crescendo replaces it */}
      {/* Top now anchors the paragraph at approximately the same vertical
          position it had when the h2 sat above it (≈ original h2 height +
          original marginTop), so the staggered cascade keeps its rhythm and
          the gold crescendo's overlap with WORLD is unchanged. */}
      <div
        className="world-quote-col absolute"
        style={{
          right: "clamp(40px, 5vw, 80px)",
          top: "clamp(220px, 38vh, 400px)",
          maxWidth: "min(700px, 58%)",
          zIndex: 5,
          textAlign: "right",
        }}
      >
        {/* Quote composition — staggered, sculpted, NOT a centered paragraph.
            Each line carries its own paddingRight so the lines descend in a
            controlled staircase moving leftward into WORLD's airspace.
            All lines inherit textAlign: right from the column wrapper. */}

        {/* Line 1 — flush right, opening the composition at the gutter. */}
        <p
          className="world-quote"
          style={{
            marginTop: 0,
            marginBottom: 0,
            paddingRight: 0,
          }}
        >
          Attention is{" "}
          <span className="world-quote__gold">not</span> drawn by
        </p>

        {/* Line 2 — force sweeps furthest left, creating the widest offset. */}
        <p
          className="world-quote"
          style={{
            margin: 0,
            lineHeight: 0.95,
            paddingRight: "clamp(100px, 14vw, 200px)",
          }}
        >
          <span className="world-quote__gold-lg">force,</span>{" "}
          <span className="world-quote__assert">but by</span>
        </p>

        {/* Line 3 — pull tucks in slightly tighter than force. */}
        <p
          className="world-quote"
          style={{
            margin: 0,
            lineHeight: 0.95,
            paddingRight: "clamp(60px, 9vw, 140px)",
          }}
        >
          the irresistible{" "}
          <span className="world-quote__gold-lg">pull</span> of
        </p>

      </div>

      {/* Local fade haze — soft ivory radial that sits between WORLD (z:1)
          and the gold text (z:5). Centred on D's arc (the curved right
          portion of D) where experience.'s "e" actually overlaps in the
          rendered layout. Shift of ~13vw right of prior placement clears
          the L entirely and lands the haze on D's body. */}
      <div
        aria-hidden
        className="world-haze absolute"
        style={{
          right: "clamp(290px, 38vw, 600px)",
          bottom: "clamp(54px, 9vh, 128px)",
          width: "clamp(120px, 11vw, 180px)",
          height: "clamp(100px, 11vw, 170px)",
          background:
            "radial-gradient(ellipse at center, var(--ivory) 0%, rgba(244,240,231,0.94) 24%, rgba(244,240,231,0.62) 50%, rgba(244,240,231,0) 78%)",
          filter: "blur(7px)",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* Gold crescendo — absolutely positioned as one paired unit on the
          section, independent of the right column. Both words share the same
          right edge (text-align: right inside the wrapper), so "experience."
          being wider naturally extends further left. At 1440 px: container
          right-edge ≈ 1253 px, experience. left-edge ≈ 693 px — which lands
          ~31 px inside D's right edge (~724 px) for a light editorial kiss.
          authored (narrower) stays right of D entirely. D centre (~657 px)
          is never covered. */}
      <div
        className="world-crescendo absolute"
        style={{
          right: "clamp(120px, 13vw, 208px)",
          bottom: "clamp(80px, 11vh, 144px)",
          textAlign: "right",
          zIndex: 5,
          pointerEvents: "none",
        }}
      >
        <p
          className="world-quote__authored"
          style={{
            margin: 0,
            fontSize: "clamp(64px, 7.6vw, 124px)",
          }}
        >
          authored
        </p>
        <p
          className="world-quote__authored"
          style={{
            margin: 0,
            marginTop: "-0.18em",
            fontSize: "clamp(72px, 8.6vw, 138px)",
          }}
        >
          experience.
        </p>
      </div>

      {/* Bottom-left folio ------------------------------------------------- */}
      <div
        className="absolute"
        style={{
          bottom: "clamp(28px, 4vh, 48px)",
          left: "var(--gutter)",
          zIndex: 10,
        }}
      >
        <span className="label-tech" style={{ color: "var(--soft-ink)" }}>
          03 — WORLD
        </span>
      </div>

      {/* Bottom-right sparkle — closing glint, mirrors the moon+sun cluster.
          Sits on the same baseline as the folio for editorial symmetry. */}
      <SparkleGlyph
        size={16}
        tone="soft-ink"
        style={{
          position: "absolute",
          bottom: "clamp(28px, 4vh, 48px)",
          right: "var(--gutter)",
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
