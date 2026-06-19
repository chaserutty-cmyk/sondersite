"use client";

import { useEffect, useState } from "react";
import { chapters } from "@/lib/tokens";
import GoldNode from "./GoldNode";

type ChapterProgressProps = {
  className?: string;
  tone?: "ink" | "ivory";
  interactive?: boolean;
  orientation?: "horizontal" | "vertical";
  /**
   * When true, the bar auto-inverts ink → ivory while any charcoal region
   * (elements marked [data-nav-dark], e.g. #connect + the footer) overlaps the
   * bar's baseline. Overrides the static `tone` prop.
   */
  autoInvertOverDark?: boolean;
};

/**
 * ChapterProgress
 *
 * The bottom progress bar with five physical markers labelled 01 02 03 05 06.
 * The gap is intentional editorial signal and must not be "corrected" to
 * 01 02 03 04 05 06.
 *
 * Active marker is the chapter most in view; updates on scroll. Hairline rule
 * connects all five markers across the bottom margin of the section.
 */
export default function ChapterProgress({
  className = "",
  tone: toneProp = "ink",
  interactive = true,
  orientation = "horizontal",
  autoInvertOverDark = false,
}: ChapterProgressProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [autoTone, setAutoTone] = useState<"ink" | "ivory">("ink");

  useEffect(() => {
    if (!interactive) return;
    const sections = chapters
      .map((c) => document.querySelector<HTMLElement>(c.href))
      .filter((el): el is HTMLElement => !!el);

    if (sections.length === 0) return;

    const darkEls = autoInvertOverDark
      ? Array.from(document.querySelectorAll<HTMLElement>("[data-nav-dark]"))
      : [];

    const onScroll = () => {
      // Center-of-viewport containment — robust to the pinned card sections,
      // whose offsetTop no longer tracks scroll. Last match wins (the topmost
      // section covering the centre), with a fallback to the furthest section
      // scrolled past for the footer region.
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      let nextActive = 0;
      sections.forEach((sec, i) => {
        if (sec.getBoundingClientRect().top <= cy) nextActive = i;
      });
      sections.forEach((sec, i) => {
        const r = sec.getBoundingClientRect();
        if (r.left <= cx && r.right >= cx && r.top <= cy && r.bottom >= cy) nextActive = i;
      });
      setActiveIndex(nextActive);

      if (darkEls.length) {
        // Invert while a dark region covers the indicator's baseline — the
        // viewport middle for the vertical right-rail, near the bottom edge
        // for the horizontal bar.
        const baseline =
          orientation === "vertical" ? window.innerHeight / 2 : window.innerHeight - 36;
        setAutoTone(
          darkEls.some((el) => {
            const rect = el.getBoundingClientRect();
            return rect.top <= baseline && rect.bottom >= baseline;
          })
            ? "ivory"
            : "ink"
        );
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [interactive, autoInvertOverDark, orientation]);

  const tone = autoInvertOverDark ? autoTone : toneProp;

  const ruleColor =
    tone === "ivory" ? "rgba(241, 233, 220, 0.22)" : "var(--hairline)";
  const numColor = tone === "ivory" ? "var(--ivory-on-dark)" : "var(--ink)";
  const dimColor =
    tone === "ivory" ? "rgba(241, 233, 220, 0.45)" : "var(--soft-ink)";

  if (orientation === "vertical") {
    return (
      <div
        className={`flex flex-col items-end ${className}`}
        role="navigation"
        aria-label="Chapter progress"
      >
        {chapters.map((chapter, i) => {
          const isActive = i === activeIndex;
          return (
            <div key={chapter.id} className="flex flex-col items-end">
              <a
                href={chapter.href}
                className="group flex items-center gap-2"
                style={{ height: 18 }}
                aria-label={`${chapter.id} — ${chapter.label}`}
              >
                <span
                  className="mono uppercase"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.24em",
                    color: isActive ? numColor : dimColor,
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translateX(0)" : "translateX(4px)",
                    transition: "opacity 300ms ease, transform 300ms ease, color 400ms ease",
                  }}
                >
                  {chapter.id}
                </span>
                {isActive ? (
                  <GoldNode size={6} pulse={interactive} />
                ) : (
                  <span
                    aria-hidden
                    className="inline-block rounded-full"
                    style={{ width: 5, height: 5, background: dimColor, opacity: 0.5, transition: "background 400ms ease" }}
                  />
                )}
              </a>
              {i < chapters.length - 1 && (
                <span
                  aria-hidden
                  style={{ width: 1, height: 18, background: ruleColor, marginRight: 2.5, transition: "background 400ms ease" }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`flex w-full items-center gap-6 ${className}`}
      role="navigation"
      aria-label="Chapter progress"
    >
      {chapters.map((chapter, i) => {
        const isActive = i === activeIndex;
        return (
          <div key={chapter.id} className="flex flex-1 items-center gap-3">
            <div
              className="flex items-center gap-2"
              style={{ minWidth: "fit-content" }}
            >
              {isActive ? (
                <GoldNode size={6} pulse={interactive} />
              ) : (
                <span
                  aria-hidden
                  className="inline-block rounded-full"
                  style={{
                    width: 5,
                    height: 5,
                    background: dimColor,
                    opacity: 0.45,
                  }}
                />
              )}
              <a
                href={chapter.href}
                className="mono uppercase transition-opacity hover:opacity-100"
                style={{
                  fontSize: "11px",
                  letterSpacing: "0.24em",
                  color: isActive ? numColor : dimColor,
                  opacity: isActive ? 1 : 0.7,
                }}
              >
                {chapter.id}
              </a>
            </div>
            {i < chapters.length - 1 && (
              <span
                aria-hidden
                className="block flex-1"
                style={{ height: "1px", background: ruleColor }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
