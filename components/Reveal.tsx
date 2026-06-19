"use client";

import { useEffect, useRef } from "react";
import { gsap, ensureGsap, prefersReducedMotion } from "@/lib/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  threshold?: number;
};

/**
 * Reveal
 *
 * Fade-and-rise scroll wrapper. Used to bring in supporting copy, technical
 * metadata, service rows, and form fields once they enter the viewport.
 *
 * Always renders a div — the wrapper is purely presentational so the element
 * type carries no semantic meaning. Respects prefers-reduced-motion.
 */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  y = 28,
  threshold = 0.18,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    ensureGsap();
    const el = ref.current;

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 1, y: 0 });
      return;
    }

    gsap.set(el, { autoAlpha: 0, y });

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(el, {
              autoAlpha: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              delay,
              overwrite: "auto",
            });
            obs.disconnect();
          }
        });
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay, y, threshold]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
