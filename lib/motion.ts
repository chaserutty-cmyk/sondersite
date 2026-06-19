"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CustomEase } from "gsap/CustomEase";
import { useEffect, useRef } from "react";

/**
 * Motion utilities for the Sonder Gravity System.
 *
 * Everything here respects prefers-reduced-motion. If the user has reduced
 * motion enabled, GSAP timelines short-circuit to their final state (no drift,
 * no parallax, no pulses, no line-draws).
 */

let registered = false;

/**
 * Signature easing for the mobile "gravity" motion language.
 *
 * GRAVITY_SETTLE — a weighted arrival with a small overshoot, as if the element
 *   has mass and settles into place. Used for objects that "fall" or "drop in".
 * GRAVITY_PULL  — a fast-out / slow-in curve with no overshoot, as if pulled by
 *   an unseen mass. Used for elements drawn in from a margin.
 *
 * These are registered as named CustomEases so GSAP timelines and the CSS
 * variables (--ease-gravity*) stay in lockstep.
 */
export const GRAVITY_SETTLE = "gravity";
export const GRAVITY_PULL = "gravityPull";

export function ensureGsap() {
  if (registered) return;
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger, CustomEase);
    // Weighted overshoot settle — control point y > 1 creates the "mass" bounce.
    CustomEase.create(GRAVITY_SETTLE, "M0,0 C0.34,1.42 0.5,1 0.62,1 0.78,1 0.86,1 1,1");
    // Pull-in — sharp departure, long deceleration, no overshoot.
    CustomEase.create(GRAVITY_PULL, "M0,0 C0.5,0 0.18,1 1,1");
    registered = true;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * isMobileViewport — true on portrait-phone widths (the only place the gravity
 * reveal engine and atmosphere layer activate). Kept in one helper so the
 * breakpoint (767px) matches the CSS `@media (max-width: 767px)` block exactly.
 */
export function isMobileViewport(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

/**
 * useGsap — run a GSAP context scoped to a ref. The cleanup auto-reverts all
 * tweens, kills ScrollTriggers, and disposes timelines on unmount.
 */
export function useGsap<T extends HTMLElement>(
  setup: (ctx: gsap.Context) => void,
  deps: unknown[] = []
) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    ensureGsap();
    const reduce = prefersReducedMotion();
    const ctx = gsap.context(() => {
      if (reduce) return;
      setup(ctx);
    }, ref.current);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ref;
}

export { gsap, ScrollTrigger };
