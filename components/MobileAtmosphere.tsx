"use client";

import { useEffect, useRef } from "react";
import { isMobileViewport, prefersReducedMotion } from "@/lib/motion";

/**
 * MobileAtmosphere — the portrait-edition ambient layer.
 *
 * Three fixed, pointer-events-none planes that only render on phones (the whole
 * group is `display: none` above 767px, so desktop is untouched):
 *
 *   · meridian — a 1px gold "measuring instrument" spine down the left margin
 *     whose fill tracks scroll progress (orientation + progress in one detail).
 *   · grain    — a barely-there animated film grain over the paper texture.
 *   · vignette — a soft edge darkening to frame the page like a printed plate.
 *
 * The scroll-fill is the only JS; it's mobile-gated and rAF-throttled.
 */
export default function MobileAtmosphere() {
  const fillRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (!isMobileViewport() || prefersReducedMotion()) return;
    const fill = fillRef.current;
    if (!fill) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
      fill.style.transform = `scaleY(${progress})`;
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

  return (
    <div className="mobile-atmosphere" aria-hidden="true">
      <div className="mobile-grain" />
      <div className="mobile-vignette" />
      <div className="mobile-meridian">
        <span ref={fillRef} className="mobile-meridian__fill" />
        <span className="mobile-meridian__tick" style={{ top: "16%" }} />
        <span className="mobile-meridian__tick" style={{ top: "38%" }} />
        <span className="mobile-meridian__tick" style={{ top: "60%" }} />
        <span className="mobile-meridian__tick" style={{ top: "82%" }} />
      </div>
    </div>
  );
}
