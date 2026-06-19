"use client";

/**
 * sections/ServicesHero.tsx
 *
 * Reference: /_refs/2D272943-FC22-4E0B-B340-8880A96F3E21.PNG
 * Chapter:   05 — SERVICES (id="services")
 *
 * Phases through 7+8 — left manifesto, service rows, panel placeholders,
 * and the two mechanical rail PNG overlays now in place. The dashed Phase 1C
 * corridor reservation has been retired in favour of the real PNG rails.
 *
 * Rail composition (per reference):
 *   - rail-vertical.png  — single brass pipe with 5 screws + tick marks,
 *                          sits slightly left of the services / visual
 *                          column boundary, runs full body height.
 *   - rail-curved.png    — twin pipes with mid-mounted satellite dish and
 *                          a curved right-hand termination at the bottom,
 *                          sits adjacent and slightly right of the
 *                          vertical rail. z-index above the vertical rail
 *                          so the satellite dish overlaps cleanly.
 *
 * Both rails are absolutely positioned inside the body grid container
 * (which is position: relative). They are anchored to the computed column
 * boundary `calc(68% - var(--gutter) * 0.36)` and translated to match the
 * reference's offset between the two pipes.
 */

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import LiveCoord from "@/components/LiveCoord";

/** Shared mono caps for the section's header/footer editorial chrome. */
const chromeMono = {
  fontFamily: "var(--font-mono), 'IBM Plex Mono', Menlo, monospace",
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
} as const;

/** Computed left positions for the two rail PNG overlays.
 *
 *  Body grid: 4 tracks at 32% / 22% / 16% / 30%
 *    (manifesto / services / rail-corridor / visual)
 *  with paddingInline: var(--gutter). The 16% middle track is intentionally
 *  empty — it reserves the visual breathing room between the services text
 *  and the image panels where the absolutely-positioned rail PNGs sit.
 *
 *  Solving each separator's absolute x in the body container coordinates
 *  (inner area = 100% − 2*gutter):
 *
 *  - Col 1 / 2 separator (manifesto | services):
 *      gutter + 0.32 * (100% − 2*gutter) = 32% + 0.36 * gutter
 *
 *  - Col 3 / 4 separator (corridor | visual):
 *      gutter + 0.70 * (100% − 2*gutter) = 70% − 0.40 * gutter
 */
const RAIL_BOUNDARY_MID = "calc(32% + var(--gutter) * 0.36)";
const RAIL_BOUNDARY_RIGHT = "calc(70% - var(--gutter) * 0.40)";

type Service = {
  num: string;
  title: string;
  desc: string;
  /** Right-column panel render — 1024×640 (16:10) PNG, ivory background. */
  image: string;
  /** Short alt text for the panel render. */
  imageAlt: string;
};

const SERVICES: Service[] = [
  {
    num: "01",
    title: "BRAND STRATEGY",
    desc: `Clarity, positioning, and
differentiation that sets
you apart.`,
    image: "/assets/services/luxurious_compass_inspired_abstract_design.png",
    imageAlt: "Brass compass with concentric rings and orbital markers on ivory",
  },
  {
    num: "02",
    title: `DIGITAL
EXPERIENCES`,
    desc: `Custom websites and
application systems that feel
intentional and effortless.`,
    image: "/assets/services/abstrakte_oberfläche_mit_goldenen_akzenten.png",
    imageAlt: "Stacked translucent interface panels with brass accents",
  },
  {
    num: "03",
    title: `CAMPAIGN
WORLDS`,
    desc: `Launches and campaigns
designed to create impact
and movement.`,
    image: "/assets/services/élégant_réseau_d_ondes_en_or.png",
    imageAlt: "Elegant network of golden wave threads with floating spheres",
  },
  {
    num: "04",
    title: "MOTION & FILM",
    desc: `Cinematic visuals and
motion systems that bring
stories to life.`,
    image: "/assets/services/orbital_elegance_in_soft_tones.png",
    imageAlt: "Lunar sphere with a brass orbital ring on ivory paper",
  },
  {
    num: "05",
    title: `CONVERSION
ARCHITECTURE`,
    desc: `Funnels, flows, and trust
systems that turn attention
into action.`,
    image: "/assets/services/minimal_golden_funnel_with_ivory_rings.png",
    imageAlt: "Brass funnel of concentric rings spiraling toward a sphere",
  },
];

const ROW_COUNT = SERVICES.length;

const rowFrame = (i: number) => ({
  display: "flex",
  alignItems: "center",
  minHeight: 0,
  borderTop: i === 0 ? "1px solid var(--hairline)" : undefined,
  borderBottom: "1px solid var(--hairline)",
});

/**
 * Small uppercase mono label with a short gold underline rule. Reused for
 * `WHAT WE DO` and `OUR APPROACH` in the manifesto column. The rule is part
 * of the label as a unit — never use the label without it.
 */
function LabelWithRule({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <span
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "var(--gold)",
        }}
      >
        {children}
      </span>
      <span
        aria-hidden
        style={{
          display: "block",
          width: 28,
          height: 1,
          background: "var(--gold)",
        }}
      />
    </div>
  );
}

export default function ServicesHero() {
  const gridRef = useRef<HTMLDivElement | null>(null);

  /* Row stagger — reveal the service rows as the table scrolls into view.
     `reveal-ready` is added only after mount (JS present, motion allowed), so
     if JS fails or reduced-motion is on, rows stay fully visible. CSS owns the
     per-row transition-delay stagger. */
  useLayoutEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;
    if (prefersReducedMotion()) return;
    grid.classList.add("reveal-ready");
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            grid.classList.add("in-view");
            obs.disconnect();
          }
        });
      },
      { threshold: 0.12 }
    );
    obs.observe(grid);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="services"
      aria-label="Services"
      className="services-section paper-grain"
      style={{
        /* Definite height (not just min-height) is required because the
           5-row sub-grid uses `1fr` — fr units need a definite parent
           height to resolve. The section runs ~12svh past the viewport
           so the table can extend lower and row 05 lands closer to the
           footer hairline. */
        height: "112svh",
        minHeight: "112svh",
        background: "var(--ivory)",
        color: "var(--ink)",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        /* Top clearance for the persistent fixed nav (which now owns the
           SONDER logotype). */
        paddingTop: "clamp(56px, 7vh, 84px)",
      }}
    >
      {/* Slim chapter strip — left-anchored only, so it clears the fixed nav's
          logotype (left) and never collides with MENU (right). Its bottom
          hairline is the top rule of the services table. */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "0 var(--gutter) 18px",
          borderBottom: "1px solid var(--hairline)",
          flexShrink: 0,
        }}
      >
        <span style={{ ...chromeMono, color: "var(--ink)" }}>
          05&#8201;&mdash;&#8201;SERVICES
        </span>
        <span style={{ ...chromeMono, display: "flex", alignItems: "center", gap: 8, color: "var(--soft-ink)" }}>
          <svg aria-hidden width={10} height={10} viewBox="0 0 10 10">
            <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" strokeWidth="0.7" />
            <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="0.7" />
          </svg>
          <LiveCoord base="34.052° N, 118.245° W" />
        </span>
      </header>

      <div
        ref={gridRef}
        className="services-grid"
        style={{
          flex: 1,
          display: "grid",
          /* Editorial asymmetric grid:
             - Col 1 (manifesto) 32% — wider headline + orbit zone
             - Col 2 (services)  22% — tight editorial band for numerals + copy
             - Col 3 (corridor)  16% — empty track holding the rail overlays
             - Col 4 (visual)    30% — image-panel stack
             Sum = 100%. The corridor is an explicit empty grid track so the
             rail PNGs (absolute overlays in this container) don't visually
             squeeze the services copy or the panel column. */
          gridTemplateColumns: "32% 22% 16% 30%",
          // Horizontal gutter preserved for column rhythm; vertical inset
          // removed entirely so the 5 service rows run edge-to-edge between
          // the header and footer hairlines. Combined with the taller
          // section above, this expands row 05 down toward the footer.
          paddingInline: "var(--gutter)",
          paddingBlock: 0,
          minHeight: 0,
          position: "relative",
        }}
      >
        {/* Left manifesto column — Phase 2 content + Phase 6 gold-ball anchor.
            - position:relative scopes the absolutely-positioned gold ball
              wrapper below to this column's bounding box.
            - isolation:isolate forces this column to FORM a stacking context
              of its own. Without it, the wrapper's z-index:-1 would escape
              up the tree and render BELOW the section's ivory background
              (i.e. invisibly). Isolating here keeps the wrapper above the
              section background while still allowing it to sit behind the
              column's text descendants — exactly the layering the brief
              calls for (orbits < ball < text). */}
        <div
          className="svc-col svc-manifesto"
          style={{
            minHeight: 0,
            marginRight: "var(--gutter)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            position: "relative",
            isolation: "isolate",
          }}
        >
          {/* TOP STACK — label + headline + body */}
          <div style={{ display: "flex", flexDirection: "column", gap: 28, flexShrink: 0 }}>
            <LabelWithRule>WHAT WE DO</LabelWithRule>

            <h2
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontSize: "clamp(40px, 4.2vw, 64px)",
                fontWeight: 500,
                fontStyle: "normal",
                lineHeight: 0.95,
                letterSpacing: "0",
                textTransform: "uppercase",
                color: "var(--ink)",
              }}
            >
              <span style={{ display: "block" }}>WE BUILD</span>
              <span style={{ display: "block" }}>DIGITAL</span>
              <span
                style={{
                  display: "block",
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 300,
                  fontSize: "1.15em",
                  color: "var(--gold)",
                  letterSpacing: "0.005em",
                  lineHeight: 1.0,
                  marginTop: "0.04em",
                }}
              >
                GRAVITY.
              </span>
            </h2>

            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-sans)",
                fontSize: 12.5,
                fontWeight: 400,
                lineHeight: 1.6,
                color: "var(--soft-ink)",
                maxWidth: "26ch",
                letterSpacing: "0.008em",
                whiteSpace: "pre-line",
              }}
            >
              {`Integrated solutions that build
presence systems with precision
and purpose.`}
            </p>
          </div>

          {/* Lower-left orbit/sphere PNG reservation — now sits BETWEEN the
              top stack and the OUR APPROACH caption so the gold ball lands
              in the mid-lower negative space (matching the reference). The
              `flex: 1` spacer absorbs all remaining vertical room, which
              pushes OUR APPROACH to the very bottom of the manifesto column.
              Phase 6 drops the orbit asset into this reservation as an
              absolutely-positioned overlay. */}
          <div aria-hidden style={{ flex: 1, minHeight: "clamp(60px, 8vw, 140px)" }} />

          {/* OUR APPROACH — compact titled caption block anchored to the
              bottom of the manifesto column (last flex child). paddingBottom
              keeps the block clear of the footer hairline. */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 12,
              flexShrink: 0,
              paddingBottom: "clamp(16px, 2vw, 32px)",
            }}
          >
            <LabelWithRule>OUR APPROACH</LabelWithRule>

            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-serif)",
                fontStyle: "italic",
                fontWeight: 400,
                fontSize: 13,
                lineHeight: 1.5,
                color: "var(--ink)",
                maxWidth: 200,
                whiteSpace: "pre-line",
              }}
            >
              {`Strategy, storytelling,
design, and technology
aligned to one outcome:
gravitational pull.`}
            </p>
          </div>
        </div>

        {/* Middle services column — 5 services */}
        <div
          className="svc-col svc-list"
          style={{
            minHeight: 0,
            borderLeft: "1px solid var(--hairline)",
            paddingLeft: "var(--gutter)",
            paddingRight: "var(--gutter)",
            display: "grid",
            gridTemplateRows: `repeat(${ROW_COUNT}, 1fr)`,
          }}
        >
          {SERVICES.map((service, i) => (
            <div key={service.num} className="svc-row" style={{ ...rowFrame(i), gap: 20 }}>
              {/* Numeral */}
              <div
                className="svc-num"
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 400,
                  fontSize: "clamp(56px, 6vw, 84px)",
                  lineHeight: 1.0,
                  color: "var(--ink)",
                  width: "clamp(72px, 7vw, 104px)",
                  flexShrink: 0,
                  letterSpacing: 0,
                }}
              >
                {service.num}
              </div>

              {/* Title + description block */}
              <div
                style={{
                  flex: 1,
                  minWidth: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                }}
              >
                <div
                  className="svc-title"
                  style={{
                    fontFamily: "var(--font-serif)",
                    fontStyle: "italic",
                    fontWeight: 500,
                    fontSize: "clamp(15px, 1.3vw, 19px)",
                    textTransform: "uppercase",
                    letterSpacing: "0.08em",
                    color: "var(--gold)",
                    lineHeight: 1.12,
                    whiteSpace: "pre-line",
                  }}
                >
                  {service.title}
                </div>
                <p
                  style={{
                    margin: 0,
                    fontFamily: "var(--font-sans)",
                    fontSize: 11.5,
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: "rgba(17, 17, 17, 0.76)",
                    maxWidth: "21ch",
                    letterSpacing: 0,
                    whiteSpace: "pre-line",
                  }}
                >
                  {service.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Rail corridor — empty grid track (col 3) reserving the 16% gap
            between the services text column and the image panel column.
            The brass rail PNGs are absolutely positioned overlays inside
            the body grid container and visually occupy this track; the
            track itself stays empty so the rails own this real estate
            without competing with content. */}
        <div className="svc-corridor" aria-hidden style={{ minHeight: 0 }} />

        {/* Right visual column — Phase 5: 5 equal rows with real panel renders.
            Now sits in col 4 of the body grid. paddingLeft is small (the rail
            corridor in col 3 already holds the rails); the borderLeft draws
            the hairline at the corridor/visual boundary. */}
        <div
          className="svc-col svc-visual"
          style={{
            minHeight: 0,
            borderLeft: "1px solid var(--hairline)",
            paddingLeft: "clamp(20px, 2.5vw, 40px)",
            paddingRight: "clamp(12px, 1.5vw, 24px)",
            position: "relative",
            display: "grid",
            gridTemplateRows: `repeat(${ROW_COUNT}, 1fr)`,
          }}
        >
          {SERVICES.map((service, i) => (
            <div
              key={service.num}
              className="svc-vrow"
              style={{
                ...rowFrame(i),
                alignItems: "center",
                gap: 12,
              }}
            >
              {/* Image panel — 16:10 letterbox, vertically centered. Source
                  PNGs are native 1024×640 so object-fit: cover is lossless
                  here; the cover keyword is defensive against future swaps. */}
              <div
                className="svc-panel"
                style={{
                  flex: 1,
                  minWidth: 0,
                  alignSelf: "center",
                  aspectRatio: "16 / 10",
                  maxHeight: "72%",
                  background: "var(--paper)",
                  border: "1px solid var(--hairline)",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <Image
                  src={service.image}
                  alt={service.imageAlt}
                  fill
                  sizes="(max-width: 1024px) 28vw, 22vw"
                  className="svc-panel-img"
                  style={{ objectFit: "cover" }}
                />
              </div>

              {/* Right-edge arrow — vertically centered, independent of panel */}
              <span
                className="svc-arrow"
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: 15,
                  lineHeight: 1,
                  color: "var(--ink)",
                  opacity: 0.6,
                  flexShrink: 0,
                  alignSelf: "center",
                }}
                aria-hidden
              >
                →
              </span>
            </div>
          ))}
        </div>

        {/* MECHANICAL RAIL OVERLAYS — Phases 7 + 8.
            Both rails are absolutely positioned inside the body grid container
            and anchored to the new asymmetric layout's column boundaries:
              - Vertical rail → manifesto / services boundary (32% body)
              - Curved rail   → corridor / visual boundary    (70% body)
            Both run the full body height; transparent PNG padding controls
            the visible pipe width. The curved rail is z-stacked above the
            vertical rail so the satellite dish overlaps cleanly. */}
        <Image
          src="/assets/services/rail-vertical-clean.png"
          alt=""
          aria-hidden
          className="services-rail"
          width={682}
          height={1024}
          priority
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            height: "100%",
            width: "auto",
            // Pipe center sits at PNG x=341 of 682 = 50% — lands the pipe
            // directly on the manifesto/services column separator line of
            // the new 32 / 22 / 16 / 30 grid.
            left: RAIL_BOUNDARY_MID,
            transform: "translateX(-50%)",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 10,
          }}
        />

        <Image
          src="/assets/services/rail-curved-clean.png"
          alt=""
          aria-hidden
          className="services-rail"
          width={768}
          height={1024}
          priority
          style={{
            position: "absolute",
            top: 0,
            // Removed `bottom: 0` so height isn't double-constrained when
            // we shift down; section overflow:hidden clips any spillover.
            height: "100%",
            width: "auto",
            // Left pipe center sits at PNG x=365 of 768 = 47.5% — lands the
            // pipe directly on the corridor / visual column separator line
            // (70% in the new grid). translateY(10%) pushes the curved
            // bottom termination clear of the row-05 image card.
            left: RAIL_BOUNDARY_RIGHT,
            transform: "translate(-47.5%, 10%)",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 11,
          }}
        />
      </div>

      <footer
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--gutter)",
          padding: "20px var(--gutter)",
          borderTop: "1px solid var(--hairline)",
          flexShrink: 0,
        }}
      >
        {/* Left — folio */}
        <span style={{ ...chromeMono, color: "var(--soft-ink)" }}>
          05&#8201;&mdash;&#8201;SERVICES
        </span>

        {/* Center — outlined pill CTA */}
        <a
          href="#connect"
          style={{
            ...chromeMono,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "11px 26px",
            borderRadius: 999,
            border: "1px solid var(--hairline-strong)",
            color: "var(--ink)",
            textDecoration: "none",
            transition: "border-color 240ms ease, color 240ms ease",
          }}
        >
          VIEW OUR SERVICES
        </a>

        {/* Right — next-chapter pointer */}
        <a
          href="#connect"
          style={{
            ...chromeMono,
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            color: "var(--soft-ink)",
            textDecoration: "none",
          }}
        >
          NEXT CHAPTER
          <span aria-hidden style={{ color: "var(--gold)" }}>&rarr;</span>
        </a>
      </footer>
    </section>
  );
}
