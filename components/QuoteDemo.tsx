"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { INTERFACES } from "@/lib/copy";

/**
 * Intelligent Quote Follow-Up — the "interactive AI demonstration".
 *
 * When the card scrolls into view it plays: the quote context appears, the stage
 * moves from Quote received to Follow-up ready, the personalized message types
 * itself out, then Reply captured. Click or press Enter to replay. Scripted on the
 * client with the approved strings; nothing is sent anywhere.
 */
export default function QuoteDemo() {
  const q = INTERFACES.quote;
  const stages = INTERFACES.followUp.stages;
  const [stage, setStage] = useState(0);
  const [typed, setTyped] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const play = useCallback(() => {
    clear();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setStage(2);
      setTyped(q.message.length);
      return;
    }
    setStage(0);
    setTyped(0);
    timers.current.push(window.setTimeout(() => setStage(1), 900));
    for (let i = 1; i <= q.message.length; i++) {
      timers.current.push(window.setTimeout(() => setTyped(i), 1300 + i * 32));
    }
    timers.current.push(window.setTimeout(() => setStage(2), 1600 + q.message.length * 32));
  }, [q.message.length]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          play();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clear();
    };
  }, [play]);

  return (
    <div
      ref={ref}
      className="demo"
      role="button"
      tabIndex={0}
      aria-label="Replay the quote follow-up demonstration"
      onClick={play}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          play();
        }
      }}
    >
      <div className="demo__card">
        <div className="demo__bar mono">
          <span>Quote / Follow-up</span>
          <span>{q.time}</span>
        </div>
        <div className="demo__stages">
          {stages.map((s, i) => (
            <span key={s} className={`demo__stage ${i <= stage ? "on" : ""}`}>
              {s}
            </span>
          ))}
        </div>
        <div className="demo__block">
          <span className="mono">{q.label}</span>
          <p>
            {q.context[0]}
            <br />
            {q.context[1]}
          </p>
        </div>
        <div className="demo__arrow" aria-hidden="true">
          ↓
        </div>
        <div className="demo__block">
          <span className="mono">{q.messageLabel}</span>
          <p className="demo__msg" aria-live="polite">
            {q.message.slice(0, typed)}
            {stage < 2 ? <span className="caret" aria-hidden="true" /> : null}
          </p>
        </div>
        <div className="demo__cap mono">
          <span>{q.caption}</span>
          <span aria-hidden="true">↗</span>
        </div>
      </div>
    </div>
  );
}
