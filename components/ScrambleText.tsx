"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * ScrambleText
 *
 * A monospace "decode" effect: the label resolves from random glyphs to its
 * final text. Renders the final text on the server (no layout shift, fully
 * accessible); the scramble plays on scroll-in, and again on hover.
 */
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/·—";

type ScrambleTextProps = {
  text: string;
  className?: string;
  style?: CSSProperties;
  /** Characters revealed per frame — higher resolves faster. */
  speed?: number;
};

export default function ScrambleText({ text, className = "", style, speed = 0.4 }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const rafRef = useRef(0);
  const [display, setDisplay] = useState(text);

  const run = () => {
    if (prefersReducedMotion()) {
      setDisplay(text);
      return;
    }
    cancelAnimationFrame(rafRef.current);
    let revealed = 0;
    const step = () => {
      setDisplay(
        text
          .split("")
          .map((ch, i) => {
            if (ch === " ") return " ";
            if (i < Math.floor(revealed)) return ch;
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );
      revealed += speed;
      if (revealed < text.length) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
      }
    };
    rafRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) return;
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            run();
            obs.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    obs.observe(el);
    return () => {
      obs.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span ref={ref} className={className} style={style} onMouseEnter={run}>
      {display}
    </span>
  );
}
