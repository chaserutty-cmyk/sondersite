"use client";

import { useLayoutEffect, useRef, type CSSProperties, type ReactNode } from "react";
import { gsap, ensureGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * Magnetic
 *
 * Wraps an interactive element so it subtly pulls toward the cursor while
 * hovered, then springs back on leave. Fine-pointer + motion-allowed only.
 */
type MagneticProps = {
  children: ReactNode;
  /** 0–1 — how far the element follows the cursor. */
  strength?: number;
  className?: string;
  style?: CSSProperties;
};

export default function Magnetic({ children, strength = 0.35, className = "", style }: MagneticProps) {
  const ref = useRef<HTMLSpanElement | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;

    try {
      ensureGsap();
    } catch {
      return;
    }

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * strength);
      yTo((e.clientY - (r.top + r.height / 2)) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
      gsap.set(el, { clearProps: "transform" });
    };
  }, [strength]);

  return (
    <span ref={ref} className={className} style={{ display: "inline-block", willChange: "transform", ...style }}>
      {children}
    </span>
  );
}
