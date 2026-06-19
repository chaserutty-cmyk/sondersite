"use client";

import { useEffect, useLayoutEffect, useState } from "react";
import { prefersReducedMotion } from "@/lib/motion";

const shouldSkip = () => {
  try {
    return !!sessionStorage.getItem("sonder-intro-shown") || prefersReducedMotion();
  } catch {
    return false;
  }
};

/**
 * Intro — a multi-beat "system boot" that builds suspense before the hero:
 *
 *   boot   (0–1.8s) : a 000→100 counter ticks while an orbital ring strokes in,
 *                     a hairline draws, and the technical readout types out.
 *   reveal (1.8–2.5s): the SONDER wordmark resolves as the counter locks at 100.
 *   out    (2.5–3.3s): the ivory panel is drawn off to the right like a card,
 *                      revealing chapter 01.
 *
 * Plays once per session; prefers-reduced-motion / returning visitors dismiss
 * instantly. Renders on the server so the first paint is the loader (no hero
 * flash); scroll is locked only while it plays.
 */
const KEY = "sonder-intro-shown";

type Phase = "boot" | "reveal" | "out" | "done";

export default function Intro() {
  const [phase, setPhase] = useState<Phase>("boot");
  const [count, setCount] = useState(0);

  // Skip synchronously BEFORE paint on repeat visits / reduced motion, so the
  // loader is removed before the browser paints it (no flash) and without
  // mutating any server-rendered attribute (no hydration mismatch).
  useLayoutEffect(() => {
    if (shouldSkip()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase("done");
    }
  }, []);

  useEffect(() => {
    if (shouldSkip()) return;

    document.body.style.overflow = "hidden";

    const COUNT_MS = 2100;
    const start = performance.now();
    // easeInOutCubic — accelerates then settles, so the count lingers near 100.
    const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    let raf = requestAnimationFrame(function tick(now) {
      const t = Math.min((now - start) / COUNT_MS, 1);
      setCount(Math.round(ease(t) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
    });

    const timers = [
      window.setTimeout(() => setPhase("reveal"), 2200),
      window.setTimeout(() => setPhase("out"), 3050),
      window.setTimeout(() => {
        setPhase("done");
        document.body.style.overflow = "";
        sessionStorage.setItem(KEY, "1");
      }, 3950),
    ];

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach(window.clearTimeout);
      document.body.style.overflow = "";
    };
  }, []);

  if (phase === "done") return null;

  const revealed = phase === "reveal" || phase === "out";

  return (
    <div
      aria-hidden
      className="intro-loader"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "var(--ivory)",
        overflow: "hidden",
        transform: phase === "out" ? "translateX(105%)" : "translateX(0)",
        transition: "transform 800ms cubic-bezier(0.76, 0, 0.24, 1)",
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
    >
      {/* Orbital ring — strokes in during boot */}
      <svg
        aria-hidden
        viewBox="0 0 100 100"
        preserveAspectRatio="xMidYMid meet"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          width: "min(56vmin, 460px)",
          height: "min(56vmin, 460px)",
          transform: "translate(-50%, -50%)",
          overflow: "visible",
          opacity: 0.5,
        }}
      >
        <ellipse
          className="intro-orbit-path"
          cx="50"
          cy="50"
          rx="46"
          ry="20"
          fill="none"
          stroke="var(--hairline-gold)"
          strokeWidth="0.5"
          pathLength={1}
          transform="rotate(-18 50 50)"
        />
        <ellipse
          className="intro-orbit-path intro-orbit-path--2"
          cx="50"
          cy="50"
          rx="20"
          ry="46"
          fill="none"
          stroke="rgba(17,17,17,0.12)"
          strokeWidth="0.5"
          pathLength={1}
          transform="rotate(12 50 50)"
        />
        <circle cx="50" cy="50" r="1.4" fill="var(--gold)" className="intro-orbit-node" />
      </svg>

      {/* Center wordmark */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif), serif",
            fontWeight: 500,
            fontSize: "clamp(40px, 7vw, 88px)",
            letterSpacing: "-0.02em",
            lineHeight: 1,
            color: "var(--ink)",
            opacity: revealed ? 1 : 0,
            transform: revealed ? "translateY(0)" : "translateY(10px)",
            transition: "opacity 600ms ease, transform 800ms cubic-bezier(0.2,0.6,0.16,1)",
          }}
        >
          SONDER<span style={{ color: "var(--gold)" }}>.</span>
        </span>
        <span
          aria-hidden
          style={{
            height: 1,
            width: revealed ? "clamp(120px, 18vw, 240px)" : 0,
            background: "var(--hairline-strong)",
            transition: "width 700ms cubic-bezier(0.76, 0, 0.24, 1)",
          }}
        />
        <span
          className="mono uppercase"
          style={{
            fontSize: 11,
            letterSpacing: "0.3em",
            color: "var(--soft-ink)",
            opacity: revealed ? 0.8 : 0,
            transition: "opacity 600ms ease 150ms",
          }}
        >
          DIGITAL CO.
        </span>
      </div>

      {/* Bottom-left readout */}
      <div
        className="mono uppercase"
        style={{
          position: "absolute",
          left: "var(--gutter)",
          bottom: "clamp(28px, 5vh, 52px)",
          fontSize: 11,
          letterSpacing: "0.24em",
          color: "var(--soft-ink)",
          lineHeight: 1.8,
        }}
      >
        <span style={{ display: "block", color: "var(--gold)" }}>● INITIALIZING GRAVITY SYSTEM</span>
        <span style={{ display: "block", opacity: 0.7 }}>34.052° N · 118.245° W</span>
      </div>

      {/* Bottom-right counter */}
      <div
        className="mono"
        style={{
          position: "absolute",
          right: "var(--gutter)",
          bottom: "clamp(24px, 5vh, 48px)",
          fontSize: "clamp(40px, 7vw, 96px)",
          fontWeight: 300,
          letterSpacing: "-0.02em",
          color: "var(--ink)",
          lineHeight: 0.9,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {String(count).padStart(3, "0")}
      </div>
    </div>
  );
}
