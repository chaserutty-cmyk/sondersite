"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ensureGsap, prefersReducedMotion } from "@/lib/motion";

/**
 * GoldCursor
 *
 * A small gold dot that replaces the native cursor sitewide.
 * - Outer ring: slow-following halo, expands on hover over links/buttons
 * - Inner dot: snaps to exact pointer position
 *
 * Activation is gated behind an `enabled` state that only flips true AFTER
 * mount (client-only), so the server and first client render both produce
 * `null`. This avoids the React 19 hydration mismatch that previously froze
 * the cursor whenever the reduced-motion branch diverged between server and
 * client.
 *
 * The component is also the single source of truth for hiding the native
 * cursor: it adds `gold-cursor-active` to <html> only once it has
 * successfully activated, and globals.css scopes `cursor: none` to that
 * class. If the gold cursor can't run (reduced motion, coarse/touch pointer,
 * or any failure to mount), the native cursor is left intact rather than the
 * user being stranded with no cursor at all.
 */
const ACTIVE_CLASS = "gold-cursor-active";

export default function GoldCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  // Decide (client-only, post-mount) whether the gold cursor should run.
  // A pointer cursor is essential UX, so we activate regardless of
  // prefers-reduced-motion (reduced motion only softens the animation
  // below). We only skip on touch / coarse pointers, where there is no
  // hover cursor to replace.
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(pointer: coarse)").matches
    ) {
      return;
    }
    // Defer out of the effect body so we never synchronously cascade a render.
    const id = window.setTimeout(() => setEnabled(true), 0);
    return () => window.clearTimeout(id);
  }, []);

  // Wire up the follow animation once the divs are actually rendered.
  useEffect(() => {
    if (!enabled) return;

    ensureGsap();

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring) return;

    // Hide the native cursor only now that the replacement is live.
    document.documentElement.classList.add(ACTIVE_CLASS);

    // Reduced motion still gets a gold cursor — we just drop the smooth
    // trailing lerp (ring follows instantly) and the hover-expand tween.
    const reduce = prefersReducedMotion();
    const lerp = reduce ? 1 : 0.12;

    // Start off-screen so no flash at (0,0)
    gsap.set([dot, ring], { x: -80, y: -80 });

    let rafId: number;
    let mx = -80,
      my = -80;
    let rx = -80,
      ry = -80;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      // Dot: snaps directly
      gsap.set(dot, { x: mx, y: my });

      // Ring: lerps toward dot (instant when reduced motion is on)
      rx += (mx - rx) * lerp;
      ry += (my - ry) * lerp;
      gsap.set(ring, { x: rx, y: ry });

      // Contextual label trails the dot.
      if (label) gsap.set(label, { x: mx + 16, y: my + 16 });

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });

    // Expand ring on interactive elements; surface a contextual label when the
    // target carries data-cursor-label. (Instant set under reduced motion.)
    const showLabel = (text: string) => {
      if (!label) return;
      label.textContent = text;
      if (reduce) gsap.set(label, { opacity: 1, scale: 1 });
      else gsap.to(label, { opacity: 1, scale: 1, duration: 0.25, ease: "power2.out" });
    };
    const hideLabel = () => {
      if (!label) return;
      if (reduce) gsap.set(label, { opacity: 0, scale: 0.8 });
      else gsap.to(label, { opacity: 0, scale: 0.8, duration: 0.2, ease: "power2.out" });
    };

    const onEnter = (e: Event) => {
      if (reduce) gsap.set(ring, { scale: 2.2, opacity: 0.5 });
      else gsap.to(ring, { scale: 2.2, opacity: 0.5, duration: 0.3, ease: "power2.out" });
      const text = (e.currentTarget as HTMLElement).dataset.cursorLabel;
      if (text) showLabel(text);
    };
    const onLeave = () => {
      if (reduce) gsap.set(ring, { scale: 1, opacity: 1 });
      else gsap.to(ring, { scale: 1, opacity: 1, duration: 0.35, ease: "power2.out" });
      hideLabel();
    };

    const targets = "a, button, [role='button'], label, input, textarea, select";
    const addListeners = () => {
      document.querySelectorAll<HTMLElement>(targets).forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    addListeners();

    // Press feedback — the dot dips on mouse-down and springs back on release.
    const onDown = () =>
      reduce ? gsap.set(dot, { scale: 0.5 }) : gsap.to(dot, { scale: 0.5, duration: 0.14, ease: "power2.out" });
    const onUp = () =>
      reduce ? gsap.set(dot, { scale: 1 }) : gsap.to(dot, { scale: 1, duration: 0.22, ease: "power2.out" });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    // Re-attach on DOM mutations (SPA navigation, dynamic content)
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      observer.disconnect();
      document.querySelectorAll<HTMLElement>(targets).forEach((el) => {
        el.removeEventListener("mouseenter", onEnter);
        el.removeEventListener("mouseleave", onLeave);
      });
      document.documentElement.classList.remove(ACTIVE_CLASS);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      {/* Outer halo ring */}
      <div
        ref={ringRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          borderRadius: "50%",
          border: "1px solid rgba(154, 122, 61, 0.55)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 9999,
          willChange: "transform",
          mixBlendMode: "multiply",
        }}
      />

      {/* Inner gold dot */}
      <div
        ref={dotRef}
        aria-hidden
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: "var(--gold)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          zIndex: 10000,
          willChange: "transform",
        }}
      />

      {/* Contextual label — appears beside the cursor on elements carrying
          data-cursor-label (e.g. "ENTER", "VIEW"). */}
      <div
        ref={labelRef}
        aria-hidden
        className="mono uppercase"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          opacity: 0,
          transform: "translate(0, 0) scale(0.8)",
          transformOrigin: "left center",
          pointerEvents: "none",
          zIndex: 10000,
          fontSize: 9,
          letterSpacing: "0.22em",
          padding: "4px 8px",
          color: "var(--ivory-on-dark)",
          background: "var(--charcoal)",
          borderRadius: 999,
          whiteSpace: "nowrap",
          willChange: "transform, opacity",
        }}
      />
    </>
  );
}
