"use client";

import { useEffect, useRef } from "react";
import { gsap, ensureGsap, isMobileViewport, prefersReducedMotion } from "@/lib/motion";
import GravityReveal from "@/components/GravityReveal";
import Polyhedron from "@/components/Polyhedron";
import ChapterSeam from "@/components/ChapterSeam";
import { systemPaths } from "@/lib/tokens";

/**
 * SystemMobile — the portrait-edition SYSTEM chapter (02), mobile only.
 *
 * Desktop hides the polyhedron, mesh, and path index on phones, leaving the
 * sun-dot and arcs floating in a void; the satellite only flies via the
 * desktop CardPair hold-beat. This rebuilds the chapter for portrait:
 *
 *   · STRATEGY / SHAPES / GRAVITY headline, masked in.
 *   · a real orbital diagram — concentric orbits, a glowing sun-dot, the
 *     polyhedron behind it — with the satellite SIGNATURE: it is scrubbed
 *     around its flight path by scroll. You drive the orbit.
 *   · the five system paths, restored as a legible mono caption ledger.
 *
 * Hidden above 767px via `.system-mobile { display: none }`.
 */
export default function SystemMobile() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const satRef = useRef<SVGGElement | null>(null);
  const pathsRef = useRef<HTMLDivElement | null>(null);

  // Scroll drives the satellite around the orbit. Progress is the stage's
  // travel through the viewport (enters bottom → leaves top), mapped to the
  // flight path via getPointAtLength so it stays exact at any size.
  useEffect(() => {
    const stage = stageRef.current;
    const path = pathRef.current;
    const sat = satRef.current;
    if (!stage || !path || !sat || !isMobileViewport()) return;

    const total = path.getTotalLength();
    const place = (progress: number) => {
      const p = Math.min(Math.max(progress, 0), 1);
      const pt = path.getPointAtLength(total * p);
      const ahead = path.getPointAtLength(Math.min(total * p + 0.5, total));
      const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI + 90;
      sat.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${angle})`);
    };

    if (prefersReducedMotion()) {
      place(0.62); // a settled rest position
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = stage.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the stage's top first reaches the bottom of the viewport,
      // 1 when the stage has fully passed the top.
      const progress = (vh - r.top) / (vh + r.height);
      place(progress);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Scroll-focus: the disciplines stack stays dim except the one nearest the
  // focus line, which brightens and unfurls its value line — so only one
  // discipline's copy is on screen at a time.
  //
  // Driven by GSAP (inline styles) rather than CSS transitions: in this dev
  // env a `transition` on a JS-toggled property sticks at its start value, so
  // GSAP is the reliable path AND keeps the unfurl smooth.
  useEffect(() => {
    const container = pathsRef.current;
    if (!container || !isMobileViewport()) return;
    const rows = Array.from(container.querySelectorAll<HTMLElement>(".sys-m-path"));
    if (rows.length === 0) return;
    ensureGsap();

    const COLOR = {
      labelOn: "#111111",
      labelOff: "rgba(17,17,17,0.3)",
      idOn: "#9a7a3d",
      idOff: "rgba(154,122,61,0.4)",
    };
    type Part = {
      label: HTMLElement;
      note: HTMLElement;
      id: HTMLElement;
      coord: HTMLElement | null;
    };
    const parts: Part[] = rows.map((r) => ({
      label: r.querySelector<HTMLElement>(".sys-m-path__label")!,
      note: r.querySelector<HTMLElement>(".sys-m-path__note")!,
      id: r.querySelector<HTMLElement>(".sys-m-path__id")!,
      coord: r.querySelector<HTMLElement>(".sys-m-path__coord"),
    }));

    const setActive = (p: Part, on: boolean, dur: number) => {
      gsap.to(p.label, {
        color: on ? COLOR.labelOn : COLOR.labelOff,
        backgroundSize: on ? "40px 2px" : "0px 2px",
        duration: dur,
        ease: "power2.out",
        overwrite: "auto",
      });
      gsap.to(p.id, {
        color: on ? COLOR.idOn : COLOR.idOff,
        duration: dur,
        ease: "power2.out",
        overwrite: "auto",
      });
      if (p.coord) {
        gsap.to(p.coord, { autoAlpha: on ? 1 : 0, duration: dur, overwrite: "auto" });
      }
      gsap.to(p.note, {
        height: on ? "auto" : 0,
        marginTop: on ? 11 : 0,
        autoAlpha: on ? 1 : 0,
        duration: dur,
        ease: "power2.out",
        overwrite: "auto",
      });
    };

    // Start fully collapsed.
    parts.forEach((p) => gsap.set(p.note, { height: 0, autoAlpha: 0 }));

    if (prefersReducedMotion()) {
      parts.forEach((p) => setActive(p, true, 0)); // reveal everything, no motion
      return;
    }

    let current = -1;
    const nameCenter = (r: HTMLElement) => {
      const rect = (r.querySelector<HTMLElement>(".sys-m-path__label") ?? r).getBoundingClientRect();
      return rect.top + rect.height / 2;
    };
    const evaluate = () => {
      // Skip the work when the ledger is well outside the viewport.
      const box = container.getBoundingClientRect();
      if (box.bottom < -40 || box.top > window.innerHeight + 40) return;
      const focusY = window.innerHeight * 0.42;
      let best = 0;
      let bestDist = Infinity;
      rows.forEach((r, i) => {
        const d = Math.abs(nameCenter(r) - focusY);
        if (d < bestDist) {
          bestDist = d;
          best = i;
        }
      });
      // Hysteresis: only hand focus to a new row when it's meaningfully closer
      // than the current one. The active note unfurls and reflows the column,
      // which would otherwise flip focus back and forth between neighbours.
      let next = current;
      if (current < 0) {
        next = best;
      } else if (best !== current) {
        const currentDist = Math.abs(nameCenter(rows[current]) - focusY);
        if (bestDist < currentDist - 36) next = best;
      }
      if (next !== current) {
        const firstActivation = current < 0;
        if (current >= 0) setActive(parts[current], false, 0.5);
        setActive(parts[next], true, firstActivation ? 0 : 0.5);
        current = next;
      }
    };

    // Activate the nearest discipline immediately, then track on scroll. We
    // call evaluate() directly (no rAF gate) so it never depends on rAF timing;
    // it only triggers a GSAP tween when the focused row actually changes.
    evaluate();
    const onScroll = () => evaluate();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div className="system-mobile">
      {/* Chapter index */}
      <GravityReveal variant="rise" distance={20}>
        <p className="sys-m-index">
          <span className="sys-m-index__tick" />
          02 — SYSTEM
        </p>
      </GravityReveal>

      {/* Headline */}
      <h1 className="sys-m-headline">
        <GravityReveal variant="mask">
          <span className="sys-m-headline__sans">STRATEGY.</span>
        </GravityReveal>
        <GravityReveal variant="mask" delay={0.1}>
          <span className="sys-m-headline__serif">SHAPES.</span>
        </GravityReveal>
        <GravityReveal variant="mask" delay={0.2}>
          <span className="sys-m-headline__sans">GRAVITY.</span>
        </GravityReveal>
      </h1>

      {/* Orbital diagram — the satellite scrubs along the path on scroll. */}
      <GravityReveal variant="settle" distance={40}>
        <div className="sys-m-stage" ref={stageRef}>
          <Polyhedron className="sys-m-poly" />
          <svg
            className="sys-m-orbit"
            viewBox="0 0 100 100"
            aria-hidden
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Concentric orbits */}
            <ellipse cx="50" cy="52" rx="38" ry="40" className="sys-m-ring" />
            <ellipse cx="50" cy="52" rx="24" ry="26" className="sys-m-ring sys-m-ring--inner" />

            {/* Flight path — a full ellipse (two clean semicircle arcs so
                getPointAtLength traverses it smoothly without degenerating). */}
            <path
              ref={pathRef}
              d="M 88 52 A 38 40 0 0 1 12 52 A 38 40 0 0 1 88 52"
              className="sys-m-flight"
            />

            {/* Gravity-well core — an instrument node, not a sun: a flat gold
                disc inside two fine concentric rings, with a center crosshair
                (echoes the desktop OrbitalDiagram language). */}
            <circle cx="50" cy="52" r="14" className="sys-m-well sys-m-well--outer" />
            <circle cx="50" cy="52" r="8.4" className="sys-m-well" />
            <circle cx="50" cy="52" r="3.4" className="sys-m-core" />
            <g className="sys-m-core-cross">
              <line x1="44" y1="52" x2="56" y2="52" />
              <line x1="50" y1="46" x2="50" y2="58" />
            </g>

            {/* Orbiting body — a minimal gold node ringed in ink, scrubbed
                along the flight path on scroll. */}
            <g ref={satRef} className="sys-m-sat">
              <circle cx="0" cy="0" r="2.6" className="sys-m-sat__ring" />
              <circle cx="0" cy="0" r="1.5" className="sys-m-sat__body" />
            </g>
          </svg>

          <span className="sys-m-stage__cue">SCROLL TO ORBIT</span>
        </div>
      </GravityReveal>

      {/* Disciplines ledger — what I architect, with a value line each. */}
      <GravityReveal variant="rise" distance={18}>
        <p className="sys-m-paths-label">
          <span className="sys-m-paths-label__tick" />
          THE DISCIPLINES
        </p>
      </GravityReveal>
      <div className="sys-m-paths" ref={pathsRef}>
        {systemPaths.map((p) => (
          <div className="sys-m-path" key={p.id}>
            <span className="sys-m-path__id">{p.id}</span>
            <div className="sys-m-path__body">
              <div className="sys-m-path__row">
                <h3 className="sys-m-path__label">{p.label}</h3>
                <span className="sys-m-path__coord">{p.coord}</span>
              </div>
              <p className="sys-m-path__note">{p.note}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chapter seam — unified handoff into 03 WORLD. */}
      <ChapterSeam stamp="02 / SYSTEM" href="#world" cta="ENTER THE WORLD" />
    </div>
  );
}
