"use client";

import { useEffect, useRef } from "react";

/**
 * Loop — a silent, looping background video (the hero and closing-section motion
 * graphics).
 *
 * Nothing but the poster is fetched until the element comes within a viewport of the
 * screen; then the right encode is attached (a 720p file on narrow screens or slow
 * connections) and played. Playback pauses while off screen. Under
 * prefers-reduced-motion the poster frame stays. Decorative, so hidden from
 * assistive tech.
 */
export default function Loop({
  src,
  srcSmall,
  poster,
  className = "",
}: {
  src: string;
  srcSmall?: string;
  poster: string;
  className?: string;
}) {
  const ref = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    type NetInfo = { saveData?: boolean; effectiveType?: string };
    const net = (navigator as Navigator & { connection?: NetInfo }).connection;
    const slow = !!net && (net.saveData === true || /(^|[^4])[23]g$/.test(net.effectiveType ?? ""));
    const small = window.innerWidth < 900 || slow;
    const chosen = small && srcSmall ? srcSmall : src;

    let attached = false;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          if (!attached) {
            v.src = chosen;
            v.load();
            attached = true;
          }
          v.play().catch(() => {});
        } else v.pause();
      },
      { rootMargin: "100% 0px 100% 0px" },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [src, srcSmall]);

  return (
    <video
      ref={ref}
      className={`loop ${className}`}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
