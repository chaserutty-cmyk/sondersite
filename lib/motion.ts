"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef } from "react";

/**
 * Motion utilities for the Sonder Gravity System.
 *
 * Everything here respects prefers-reduced-motion. If the user has reduced
 * motion enabled, GSAP timelines short-circuit to their final state (no drift,
 * no parallax, no pulses, no line-draws).
 */

let registered = false;

export function ensureGsap() {
  if (registered) return;
  if (typeof window !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
