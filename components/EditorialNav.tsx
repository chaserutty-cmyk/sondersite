"use client";

import { useEffect, useRef, useState } from "react";
import MenuOverlay from "@/components/MenuOverlay";
import Magnetic from "@/components/Magnetic";

type EditorialNavProps = {
  className?: string;
};

/**
 * EditorialNav
 *
 * Persistent fixed masthead — the single owner of the SONDER / DIGITAL CO.
 * logotype across the whole page (per-section mastheads were removed in favour
 * of this one nav). Kept intentionally minimal — logotype + MENU only — so it
 * never collides with the top chrome of the full-viewport chapters beneath it;
 * chapter navigation lives in the persistent ChapterProgress bar instead.
 *
 *   Left:   SONDER / DIGITAL CO.   (stacked logotype, links home)
 *   Right:  MENU  (with circular plus mark)
 *
 * Behaviour:
 *   - fixed at top, fades in shortly after mount (after the intro hands off)
 *   - inverts ink → ivory while it overlaps the charcoal CONNECT chapter,
 *     computed on scroll from #connect's bounding rect vs. the nav baseline.
 *   No background, no shadow, no chrome.
 */
const NAV_BASELINE = 44; // px from top — the nav's vertical anchor for tone tests

export default function EditorialNav({ className = "" }: EditorialNavProps) {
  const [tone, setTone] = useState<"ink" | "ivory">("ink");
  const [shown, setShown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    // Fade the nav in after a beat so it arrives with (not before) the hero.
    const t = window.setTimeout(() => setShown(true), 200);

    // Any charcoal region (CONNECT chapter + the footer) marks itself with
    // data-nav-dark; the nav inverts while it overlaps one.
    const darkEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-nav-dark]")
    );
    if (darkEls.length === 0) return () => window.clearTimeout(t);

    const onScroll = () => {
      const overDark = darkEls.some((el) => {
        const rect = el.getBoundingClientRect();
        return rect.top <= NAV_BASELINE && rect.bottom >= NAV_BASELINE;
      });
      setTone(overDark ? "ivory" : "ink");
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const fg = tone === "ivory" ? "var(--ivory-on-dark)" : "var(--ink)";
  const dim = tone === "ivory" ? "rgba(241,233,220,0.7)" : "var(--soft-ink)";
  const ring = tone === "ivory" ? "rgba(241,233,220,0.55)" : "var(--hairline-strong)";

  return (
    <>
      <header
      className={`fixed left-0 right-0 top-0 z-50 flex items-start justify-between px-[var(--gutter)] pt-7 ${className}`}
      style={{
        color: fg,
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(-8px)",
        transition: "opacity 700ms ease, transform 700ms ease, color 500ms ease",
      }}
    >
      <a
        href="#signal"
        className="mono uppercase leading-[1.05]"
        style={{
          fontSize: "11px",
          letterSpacing: "0.2em",
          color: fg,
          transition: "color 500ms ease",
        }}
        aria-label="Sonder Digital Co. — Home"
      >
        SONDER
        <br />
        DIGITAL CO.
      </a>

      <Magnetic strength={0.5}>
      <button
        ref={menuBtnRef}
        type="button"
        onClick={() => setMenuOpen(true)}
        data-cursor-label="MENU"
        aria-haspopup="dialog"
        aria-expanded={menuOpen}
        className="group flex items-center gap-3"
        style={{ background: "transparent", border: "none", color: fg, cursor: "none" }}
      >
        <span
          className="mono uppercase"
          style={{ fontSize: "11px", letterSpacing: "0.24em", color: fg, transition: "color 500ms ease" }}
        >
          MENU
        </span>
        <span
          aria-hidden
          className="grid place-items-center rounded-full transition-transform duration-500 group-hover:rotate-90"
          style={{
            width: 26,
            height: 26,
            border: `1px solid ${ring}`,
            color: dim,
            lineHeight: 1,
            fontSize: "12px",
            transition: "border-color 500ms ease, color 500ms ease, transform 500ms ease",
          }}
        >
          +
        </span>
      </button>
      </Magnetic>
      </header>

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} returnFocusRef={menuBtnRef} />
    </>
  );
}
