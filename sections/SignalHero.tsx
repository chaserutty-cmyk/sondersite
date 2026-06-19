"use client";

/**
 * sections/SignalHero.tsx
 *
 * Reference: /public/references/F5201951-D981-432C-9F02-177920881A5F.PNG
 *
 * Layout model: a single composed editorial viewport.
 * section#signal is exactly height: 100svh with overflow: hidden.
 * All content (label, headline, copy, CTA, diagram, bottom band) fits
 * inside the first viewport — no scroll required on desktop.
 *
 * Layer order:
 *   1. Diagram zone     — position: absolute, right-anchored, zIndex: 1
 *   2. Text column      — normal flow, left half, zIndex: 10
 *   3. Bottom band      — position: absolute, bottom-anchored, zIndex: 10
 */

import { useLayoutEffect, useRef } from "react";
import { gsap, ensureGsap, prefersReducedMotion } from "@/lib/motion";
import GravityCoreImage from "@/components/GravityCoreImage";
import OrbitalDiagram from "@/components/OrbitalDiagram";
import SectionLabel from "@/components/SectionLabel";
import TechnicalMeta from "@/components/TechnicalMeta";
import GoldNode from "@/components/GoldNode";
import EditorialRule from "@/components/EditorialRule";
import Crosshair from "@/components/Crosshair";
import MaskText from "@/components/MaskText";
import Reveal from "@/components/Reveal";
import Magnetic from "@/components/Magnetic";
import SystemAnnotation from "@/components/SystemAnnotation";
import SignalMobile from "@/components/SignalMobile";

export default function SignalHero() {
  const driftRef = useRef<HTMLDivElement | null>(null);

  /* Cursor drift — the orbital diagram parallaxes gently toward the pointer,
     giving the gravity core a sense of depth and "pull". Fine-pointer + motion
     only; otherwise the diagram sits perfectly still. */
  useLayoutEffect(() => {
    const el = driftRef.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    try {
      ensureGsap();
    } catch {
      return;
    }
    const xTo = gsap.quickTo(el, "x", { duration: 1.1, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 1.1, ease: "power3.out" });
    const onMove = (e: MouseEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      xTo(nx * 38);
      yTo(ny * 30);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      gsap.set(el, { clearProps: "transform" });
    };
  }, []);

  return (
    <section
      id="signal"
      className="relative w-full overflow-hidden paper-grain"
      style={{
        background: "var(--ivory)",
        color: "var(--ink)",
        height: "100svh",
        minHeight: "640px",
        overflow: "hidden",
        paddingLeft: "var(--gutter)",
        paddingRight: "var(--gutter)",
        /* Vertical padding handled by child positioning, not section padding,
           so we can anchor both top content and bottom band precisely. */
        paddingTop: "clamp(72px, 9vh, 112px)",
        paddingBottom: 0,
      }}
    >
      {/* Desktop composition — display:contents shell (byte-identical desktop;
          hidden on mobile, where SignalMobile takes over). */}
      <div className="signal-desktop">
      {/* Section label + top crosshair ---------------------------------------- */}
      <div
        className="relative z-20"
        style={{ marginBottom: "clamp(16px, 2.4vh, 36px)" }}
      >
        <SectionLabel index="01" label="SIGNAL" />
      </div>

      <Crosshair
        className="absolute"
        size={12}
        style={{ top: "clamp(52px, 6.5vh, 80px)", left: "27%" }}
      />

      {/* Diagram zone — right-shifted to open up breathing room from the text ---- */}
      <div
        ref={driftRef}
        className="signal-diagram absolute"
        style={{
          top: "clamp(80px, 10vh, 130px)",
          right: 0,
          bottom: "clamp(96px, 13vh, 140px)",
          width: "clamp(400px, 54%, 720px)",
          zIndex: 1,
          pointerEvents: "none",
          willChange: "transform",
        }}
        aria-hidden
      >
        {/* Orbital ellipses — behind the core image */}
        <div className="absolute inset-0" style={{ zIndex: 1 }}>
          <OrbitalDiagram />
        </div>

        {/* Gravity core — image asset, z-index 3, sits above orbits */}
        <GravityCoreImage />

        {/* ORBIT ID: SD-01 / GRAVITY CORE — top-right */}
        <div
          className="absolute"
          style={{ top: 0, right: "clamp(20px, 2.5vw, 40px)", zIndex: 3 }}
        >
          <TechnicalMeta
            value="ORBIT ID: SD-01"
            label="GRAVITY CORE"
            align="right"
          />
        </div>

        {/* Single crosshair at upper-right orbital node */}
        <Crosshair
          className="absolute"
          size={10}
          style={{ top: "8%", right: "18%" }}
        />
      </div>

      {/* Text column — wide enough for headline content to breathe without wrapping */}
      <div
        className="signal-text relative"
        style={{
          maxWidth: "clamp(500px, 62%, 960px)",
          zIndex: 10,
        }}
      >
        {/* First headline block — Cormorant Garamond 500, high-contrast editorial serif */}
        <MaskText
          as="h1"
          lines={[
            "MOST BRANDS",
            <span key="attention">
              CHASE ATTENTION
              <span style={{ color: "var(--gold)" }}>.</span>
            </span>,
          ]}
          className="display-hero-top"
          stagger={0.09}
        />

        {/* Vertical hairline hinge — expanded to create an intentional editorial
            pause between the two headline groups */}
        <div
          aria-hidden
          style={{
            width: "1px",
            height: "clamp(28px, 3.6vh, 48px)",
            background: "var(--hairline-strong)",
            marginLeft: 0,
            marginTop: "clamp(20px, 3vh, 40px)",
            marginBottom: "clamp(20px, 3vh, 40px)",
          }}
        />

        {/* Second headline block — Optima Bold for FEW/CREATE,
            Cormorant italic for GRAVITY, all at poster scale. */}
        <MaskText
          as="h1"
          lines={[
            <span key="few">FEW</span>,
            <span key="create">CREATE</span>,
            <span key="gravity">
              <span
                style={{
                  fontFamily: "var(--font-serif)",
                  fontStyle: "italic",
                  fontWeight: 600,
                  fontSize: "1.11em",
                  color: "var(--gold)",
                  letterSpacing: "0em",
                }}
              >
                GRAVITY
              </span>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "normal",
                  fontWeight: 700,
                  color: "var(--ink)",
                }}
              >
                .
              </span>
            </span>,
          ]}
          className="display-hero-bottom"
          delay={0.35}
          stagger={0.09}
        />

      </div>

      {/* CTA — absolutely anchored lower-left, aligned with the headline left edge,
          above the bottom band. Positioned independently so the headline breathes. */}
      <div
        className="absolute"
        style={{
          left: "var(--gutter)",
          bottom: "clamp(116px, 15vh, 168px)",
          zIndex: 10,
        }}
      >
        <Reveal delay={1.3}>
          <Magnetic strength={0.4}>
            <a
              href="#system"
              data-cursor-label="ENTER"
              className="group inline-flex items-center gap-4"
              aria-label="Explore the system — jump to System chapter"
            >
              <span
                className="label-tech cta-underline"
                style={{
                  paddingBottom: "4px",
                  color: "var(--ink)",
                  transition: "letter-spacing 400ms ease",
                }}
              >
                EXPLORE THE SYSTEM
              </span>
              <GoldNode size={6} halo />
            </a>
          </Magnetic>
        </Reveal>
      </div>

      {/* System annotation — quiet philosophy layer, lower-right negative space */}
      <SystemAnnotation
        className="signal-annotation"
        style={{
          position: "absolute",
          right: "clamp(28px, 3.6vw, 56px)",
          bottom: "clamp(112px, 15vh, 156px)",
          zIndex: 10,
        }}
      >
        We engineer digital presence systems that build trust, create pull, and
        turn perception into momentum.
      </SystemAnnotation>

      {/* Bottom band — absolutely anchored to the bottom of the section -------- */}
      <div
        className="absolute left-0 right-0"
        style={{
          bottom: "clamp(16px, 2.8vh, 36px)",
          paddingLeft: "var(--gutter)",
          paddingRight: "var(--gutter)",
          zIndex: 10,
        }}
      >
        {/* Above rule: 01  ○ SCROLL TO ORBIT  05 */}
        <Reveal delay={1.5}>
          <div
            className="flex items-center"
            style={{
              paddingBottom: "clamp(10px, 1.6vh, 20px)",
              gap: "clamp(16px, 2.4vw, 36px)",
            }}
          >
            <span
              className="mono uppercase"
              style={{ fontSize: "11px", letterSpacing: "0.24em", color: "var(--ink)" }}
            >
              01
            </span>

            <div className="flex items-center gap-3" style={{ flex: 1, justifyContent: "center" }}>
              <span
                aria-hidden
                style={{
                  width: "13px",
                  height: "13px",
                  border: "1px solid var(--ink)",
                  borderRadius: "50%",
                  display: "inline-block",
                  flexShrink: 0,
                }}
              />
              <span className="label-tech" style={{ color: "var(--ink)" }}>
                SCROLL TO ORBIT
              </span>
            </div>

            <span
              className="mono uppercase"
              style={{ fontSize: "11px", letterSpacing: "0.24em", color: "var(--soft-ink)" }}
            >
              05
            </span>
          </div>
        </Reveal>

        {/* Horizontal hairline */}
        <EditorialRule />
      </div>
      </div>

      {/* Portrait-edition composition — mobile only (≤767px). */}
      <SignalMobile />
    </section>
  );
}
