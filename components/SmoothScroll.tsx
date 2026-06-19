"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { ensureGsap, gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * SmoothScroll
 *
 * Lenis momentum scrolling, bridged to GSAP ScrollTrigger so pinned/scrubbed
 * timelines (e.g. SystemHero's satellite flight, the 01→02 transition) stay in
 * sync. Side-effect only — renders nothing.
 *
 * Skipped entirely under prefers-reduced-motion or coarse pointers (touch),
 * where native scrolling is the correct, accessible behaviour.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    ensureGsap();

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    lenis.on("scroll", ScrollTrigger.update);

    const onRaf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onRaf);
    gsap.ticker.lagSmoothing(0);

    // Smooth-scroll in-page anchor links (nav, menu, footer, CTAs) via Lenis
    // instead of the browser's instant hash jump.
    const onClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!anchor) return;
      const hash = anchor.getAttribute("href");
      if (!hash || hash === "#") return;
      const target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2 });
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.remove(onRaf);
      lenis.destroy();
    };
  }, []);

  return null;
}
