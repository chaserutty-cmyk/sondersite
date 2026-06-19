"use client";

import { CSSProperties, useEffect, useRef } from "react";
import { gsap, ensureGsap, prefersReducedMotion } from "@/lib/motion";

type SystemAnnotationProps = {
  children: React.ReactNode;
  className?: string;
  style?: CSSProperties;
  /** Seconds after mount before the soft fade-in begins */
  delay?: number;
};

/**
 * SystemAnnotation
 *
 * Quiet classified-interface copy — small editorial type beside a hairline,
 * fades in after the hero headline and drifts subtly on scroll.
 */
export default function SystemAnnotation({
  children,
  className = "",
  style,
  delay = 1.55,
}: SystemAnnotationProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    ensureGsap();

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.set(el, { autoAlpha: 0, y: 10 });

    const fadeIn = gsap.to(el, {
      autoAlpha: 1,
      y: 0,
      duration: 1.35,
      ease: "power2.out",
      delay,
    });

    const section = el.closest("section");
    const parallax = section
      ? gsap.to(el, {
          y: -14,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 0.85,
          },
        })
      : null;

    return () => {
      fadeIn.kill();
      parallax?.scrollTrigger?.kill();
      parallax?.kill();
    };
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`system-annotation ${className}`.trim()}
      style={style}
    >
      <div aria-hidden className="system-annotation__line" />
      <p className="system-annotation__text">{children}</p>
    </div>
  );
}
