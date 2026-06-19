"use client";

import { useEffect, useState } from "react";

/**
 * ScrollProgress — a 1px gold hairline pinned to the very top of the viewport
 * whose width tracks overall page scroll. A quiet "instrument" reading of how
 * far through the system the reader is.
 */
export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(window.scrollY / max, 1) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        zIndex: 55,
        pointerEvents: "none",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: "linear-gradient(to right, var(--deep-gold), var(--gold), var(--soft-gold))",
          transformOrigin: "left",
          transition: "width 120ms linear",
        }}
      />
    </div>
  );
}
