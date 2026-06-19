"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  ensureGsap,
  prefersReducedMotion,
  isMobileViewport,
  GRAVITY_SETTLE,
  GRAVITY_PULL,
} from "@/lib/motion";

/**
 * GravityReveal — the portrait-edition reveal engine.
 *
 * Every mobile chapter composes its choreography out of these variants so the
 * whole scroll obeys one motion language: mass, pull, settle.
 *
 *   rise        — fades up from below with a weighted arrival (default).
 *   settle      — drops in from above, slightly scaled down, with an overshoot
 *                 "landing" (things have mass).
 *   pull-left   — drawn in from the left margin toward the content.
 *   pull-right  — drawn in from the right margin.
 *   mask        — clip-reveal: the line slides up out of a hidden frame.
 *   ignite      — gold accents brighten/bloom into place (no travel).
 *
 * DESKTOP IS NEVER TOUCHED. The wrapper is `display: contents` above 767px, so
 * it generates no box and the desktop layout is byte-identical; the GSAP setup
 * also bails immediately on non-mobile viewports. On mobile it becomes a real
 * block and animates on scroll-in. Respects prefers-reduced-motion.
 */

type Variant = "rise" | "settle" | "pull-left" | "pull-right" | "mask" | "ignite";

type GravityRevealProps = {
  children: React.ReactNode;
  variant?: Variant;
  /** Seconds of delay before this element animates in. Use to cascade siblings. */
  delay?: number;
  /** Travel distance in px (ignored by mask/ignite). */
  distance?: number;
  /** IntersectionObserver threshold. */
  threshold?: number;
  /** Stagger this element's *direct children* instead of the element itself. */
  staggerChildren?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function GravityReveal({
  children,
  variant = "rise",
  delay = 0,
  distance = 42,
  threshold = 0.2,
  staggerChildren,
  className = "",
  style,
}: GravityRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Desktop / tablet: the wrapper is display:contents and we never animate.
    if (!isMobileViewport()) return;

    ensureGsap();

    // What we actually move. `mask` clips the wrapper as a static frame and
    // slides the inner content up out of it, so it must animate the children.
    const animateChildren = variant === "mask" || staggerChildren != null;
    const targets: Element[] = animateChildren ? Array.from(el.children) : [el];
    if (targets.length === 0) return;

    if (prefersReducedMotion()) {
      // Never clip a non-animating line — descenders must stay visible.
      el.style.overflow = "visible";
      gsap.set(targets, { autoAlpha: 1, x: 0, y: 0, yPercent: 0, clearProps: "transform,filter" });
      return;
    }

    // `mask` clips the wrapper ONLY while the line travels up out of frame; it is
    // released on completion (below) so descenders (the "Y" in GRAVITY, etc.) are
    // never clipped at rest.
    if (variant === "mask") el.style.overflow = "hidden";

    // Build the from-state + tween config for the chosen variant.
    const stagger = staggerChildren ?? 0;
    let from: gsap.TweenVars;
    const to: gsap.TweenVars = {
      autoAlpha: 1,
      x: 0,
      y: 0,
      scale: 1,
      filter: "brightness(1)",
      overwrite: "auto",
      delay,
      stagger,
    };

    switch (variant) {
      case "settle":
        from = { autoAlpha: 0, y: -distance * 0.7, scale: 0.94 };
        to.duration = 1.1;
        to.ease = GRAVITY_SETTLE;
        break;
      case "pull-left":
        from = { autoAlpha: 0, x: -distance };
        to.duration = 1.0;
        to.ease = GRAVITY_PULL;
        break;
      case "pull-right":
        from = { autoAlpha: 0, x: distance };
        to.duration = 1.0;
        to.ease = GRAVITY_PULL;
        break;
      case "mask":
        // Wrapper is the static clip frame (set above); the inner line slides
        // up into view from below it. Release the clip once it lands so the
        // descenders are no longer cut by the (sub-1) line-height frame.
        from = { yPercent: 110 };
        to.yPercent = 0;
        to.autoAlpha = 1;
        to.duration = 0.95;
        to.ease = GRAVITY_SETTLE;
        to.onComplete = () => {
          el.style.overflow = "visible";
        };
        break;
      case "ignite":
        from = { autoAlpha: 0, filter: "brightness(0.35) saturate(0.6)", scale: 0.985 };
        to.duration = 0.55;
        to.ease = "power2.out";
        break;
      case "rise":
      default:
        from = { autoAlpha: 0, y: distance };
        to.duration = 0.95;
        to.ease = GRAVITY_SETTLE;
        break;
    }

    gsap.set(targets, from);

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(targets, to);
            obs.disconnect();
          }
        });
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div ref={ref} className={`gravity-reveal ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}
