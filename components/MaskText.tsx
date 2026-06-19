"use client";

import { useLayoutEffect, useRef } from "react";
import { gsap, ensureGsap, prefersReducedMotion } from "@/lib/motion";

type MaskTextProps = {
  lines: React.ReactNode[];
  as?: "h1" | "h2" | "h3" | "p" | "div";
  className?: string;
  lineClassName?: string;
  delay?: number;
  stagger?: number;
  trigger?: "mount" | "scroll";
  animate?: boolean;
};

/**
 * MaskText
 *
 * Editorial line-by-line reveal. Each line is wrapped in an overflow:hidden
 * span; the inner span animates from yPercent: 110 → 0 with GSAP.
 *
 * VISIBILITY GUARANTEE
 * Lines are rendered fully visible in the JSX. GSAP only touches them inside
 * useLayoutEffect, which runs synchronously after DOM mutation but BEFORE the
 * browser paints. So the sequence is:
 *
 *   render visible → useLayoutEffect sets yPercent: 110 → tween to 0 → paint
 *
 * If GSAP fails to load, if prefers-reduced-motion is on, if React Strict Mode
 * remounts the component, or if cleanup fires unexpectedly — the text stays
 * visible. The hidden state is never written unless we are about to animate
 * out of it.
 */
export default function MaskText({
  lines,
  as: Tag = "h1",
  className = "",
  lineClassName = "",
  delay = 0,
  stagger = 0.08,
  trigger = "mount",
  animate = true,
}: MaskTextProps) {
  const ref = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    if (!animate || !ref.current) return;

    const el = ref.current;
    let tween: gsap.core.Tween | null = null;
    let observer: IntersectionObserver | null = null;

    try {
      ensureGsap();
    } catch {
      return; // GSAP failed to load — text stays visible from initial render
    }

    const inner = Array.from(
      el.querySelectorAll<HTMLElement>(".mask-line > span")
    );
    if (inner.length === 0) return;

    const forceVisible = () => {
      try {
        gsap.set(inner, { yPercent: 0, clearProps: "transform" });
      } catch {
        inner.forEach((n) => (n.style.transform = ""));
      }
    };

    const reveal = () => {
      try {
        gsap.killTweensOf(inner);
        gsap.set(inner, { yPercent: 110, force3D: true });
        tween = gsap.to(inner, {
          yPercent: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger,
          delay,
          overwrite: "auto",
          onComplete: forceVisible,
        });
      } catch {
        forceVisible();
      }
    };

    if (prefersReducedMotion()) {
      return; // already visible from initial render
    }

    if (trigger === "scroll") {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              reveal();
              observer?.disconnect();
            }
          });
        },
        { threshold: 0.2 }
      );
      observer.observe(el);
    } else {
      reveal();
    }

    return () => {
      observer?.disconnect();
      tween?.kill();
      forceVisible();
    };
  }, [lines, delay, stagger, trigger, animate]);

  if (!animate) {
    return (
      <Tag className={className}>
        {lines.map((line, i) => (
          <span
            key={i}
            className={lineClassName}
            style={{ display: "block" }}
          >
            {line}
          </span>
        ))}
      </Tag>
    );
  }

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
    >
      {lines.map((line, i) => (
        <span key={i} className={`mask-line ${lineClassName}`}>
          <span style={{ display: "inline-block" }}>{line}</span>
        </span>
      ))}
    </Tag>
  );
}
