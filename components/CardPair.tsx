"use client";

import { useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import { gsap, ensureGsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

/**
 * CardPair
 *
 * A scroll-driven "card stack" transition. The `under` section is pinned to the
 * viewport while the `over` section slides in from the right (xPercent 100 → 0)
 * like a card laid on top, complete with a soft left-edge shadow and a subtle
 * darkening + scale on the section beneath for depth.
 *
 * After the slide completes, an optional "hold" beat (holdVh) keeps the pair
 * pinned for further scroll, reporting progress 0→1 via `onHold` — used to fly
 * the SystemHero satellite once its card has landed.
 *
 * Enhancement is desktop + fine-pointer + motion-allowed only. Otherwise the
 * two sections render as ordinary stacked normal-flow blocks (the SSR output),
 * so reduced-motion / touch / no-JS all degrade to a clean vertical scroll.
 */
type CardPairProps = {
  under: ReactNode;
  over: ReactNode;
  /** Extra pinned scroll after the slide, as a % of viewport (for a hold beat). */
  holdVh?: number;
  /** Reports hold-beat progress 0→1 (0 during the slide). */
  onHold?: (progress: number) => void;
  className?: string;
};

export default function CardPair({
  under,
  over,
  holdVh = 0,
  onHold,
  className = "",
}: CardPairProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const underRef = useRef<HTMLDivElement | null>(null);
  const overRef = useRef<HTMLDivElement | null>(null);
  const scrimRef = useRef<HTMLDivElement | null>(null);

  const onHoldRef = useRef(onHold);
  useEffect(() => {
    onHoldRef.current = onHold;
  });

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const underEl = underRef.current;
    const overEl = overRef.current;
    const scrim = scrimRef.current;
    if (!wrap || !underEl || !overEl) return;

    const enable =
      !prefersReducedMotion() &&
      window.matchMedia("(min-width: 1024px)").matches &&
      window.matchMedia("(pointer: fine)").matches;

    if (!enable) {
      // Normal stacked flow (SSR default). Park any hold-driven element at rest.
      onHoldRef.current?.(1);
      return;
    }

    try {
      ensureGsap();
    } catch {
      onHoldRef.current?.(1);
      return;
    }

    // Restructure to overlay: lift `over` out of flow and off-screen right.
    wrap.classList.add("card-pair-active");
    wrap.style.overflow = "hidden";
    wrap.style.height = "100svh";
    gsap.set(underEl, { zIndex: 1 });
    gsap.set(overEl, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      xPercent: 100,
      zIndex: 2,
      overflow: "hidden",
      borderRadius: 28,
    });

    // Fraction of the pinned scroll spent on the slide (rest is the hold beat).
    const slideFrac = 100 / (100 + holdVh);

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: "top top",
      end: () => "+=" + window.innerHeight * (1 + holdVh / 100),
      pin: true,
      pinSpacing: true,
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        const p = self.progress;
        const slideP = Math.min(p / slideFrac, 1);
        // Rounded leading corners while sliding; square once landed.
        gsap.set(overEl, { xPercent: 100 * (1 - slideP), borderRadius: 28 * (1 - slideP) });
        gsap.set(underEl, { scale: 1 - 0.03 * slideP });
        if (scrim) scrim.style.opacity = String(0.22 * slideP);
        const holdP =
          holdVh > 0 ? Math.min(Math.max((p - slideFrac) / (1 - slideFrac), 0), 1) : 0;
        onHoldRef.current?.(holdP);
      },
    });

    return () => {
      st.kill();
      wrap.classList.remove("card-pair-active");
      wrap.style.removeProperty("overflow");
      wrap.style.removeProperty("height");
      gsap.set([underEl, overEl], { clearProps: "all" });
      if (scrim) scrim.style.removeProperty("opacity");
    };
  }, [holdVh]);

  return (
    <div
      ref={wrapRef}
      className={`card-pair ${className}`}
      style={{ position: "relative", isolation: "isolate" }}
    >
      <div ref={underRef} className="card-under" style={{ position: "relative", transformOrigin: "center center" }}>
        {under}
        <div
          ref={scrimRef}
          aria-hidden
          className="card-scrim"
          style={{
            position: "absolute",
            inset: 0,
            background: "#000",
            opacity: 0,
            pointerEvents: "none",
            zIndex: 30,
          }}
        />
      </div>

      <div ref={overRef} className="card-over" style={{ position: "relative" }}>
        {over}
      </div>
    </div>
  );
}
