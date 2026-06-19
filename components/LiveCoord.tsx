"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * LiveCoord — a coordinate readout that occasionally jitters its final digit,
 * like a live instrument settling on a fix. Renders the exact base string on
 * the server (and under reduced motion), so it's stable and accessible.
 */
type LiveCoordProps = {
  base: string;
  className?: string;
  style?: CSSProperties;
};

export default function LiveCoord({ base, className = "", style }: LiveCoordProps) {
  const [text, setText] = useState(base);
  const timer = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;

    const lastDigit = base.match(/\d(?=\D*$)/); // final digit in the string
    if (!lastDigit) return;

    const tick = () => {
      setText(base.replace(/\d(?=\D*$)/, String(Math.floor(Math.random() * 10))));
      window.setTimeout(() => setText(base), 110);
      timer.current = window.setTimeout(tick, 2600 + Math.random() * 2600);
    };
    timer.current = window.setTimeout(tick, 1800 + Math.random() * 1800);

    return () => window.clearTimeout(timer.current);
  }, [base]);

  return (
    <span className={className} style={style}>
      {text}
    </span>
  );
}
