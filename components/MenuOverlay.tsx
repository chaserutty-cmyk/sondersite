"use client";

import { useEffect, useRef, useState } from "react";
import { chapters } from "@/lib/tokens";

/**
 * MenuOverlay
 *
 * Full-screen editorial menu that slides in from the right (echoing the card
 * motif). Oversized serif chapter links with index numerals + gold hover, plus
 * a quiet contact / coordinates / social column. Locks scroll, traps focus,
 * closes on Esc, link click, or the × control.
 *
 * Mounted only while open (plus the exit transition), so it never sits
 * off-screen contributing to horizontal overflow.
 */
type MenuOverlayProps = {
  open: boolean;
  onClose: () => void;
  returnFocusRef?: React.RefObject<HTMLElement | null>;
};

const social = [
  { label: "Instagram", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Behance", href: "#" },
];

const EXIT_MS = 720;

export default function MenuOverlay({ open, onClose, returnFocusRef }: MenuOverlayProps) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const [render, setRender] = useState(false);
  const [entered, setEntered] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);

  // Determine which chapter is currently in view when the menu opens.
  useEffect(() => {
    if (!render) return;
    const id = requestAnimationFrame(() => {
      // Center-of-viewport containment (robust to the pinned card sections).
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      const els = chapters.map((c) => document.querySelector<HTMLElement>(c.href));
      let idx = 0;
      els.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top <= cy) idx = i;
      });
      els.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.left <= cx && r.right >= cx && r.top <= cy && r.bottom >= cy) idx = i;
      });
      setActiveIdx(idx);
    });
    return () => cancelAnimationFrame(id);
  }, [render]);

  // Mount on open; on close, play the exit transition then unmount.
  // Using setTimeout instead of rAF so this works in background tabs too.
  useEffect(() => {
    let t1 = 0;
    let t2 = 0;
    if (open) {
      setRender(true);
      t1 = window.setTimeout(() => setEntered(true), 16);
    } else {
      setEntered(false);
      t2 = window.setTimeout(() => setRender(false), EXIT_MS);
    }
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [open]);

  // Scroll lock while mounted.
  useEffect(() => {
    if (!render) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [render]);

  // Focus management + Esc + basic focus trap.
  useEffect(() => {
    if (!render) return;
    const panel = panelRef.current;
    const returnEl = returnFocusRef?.current ?? null;
    closeRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && panel) {
        const focusables = panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])');
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      returnEl?.focus();
    };
  }, [render, onClose, returnFocusRef]);

  if (!render) return null;

  return (
    <div
      ref={panelRef}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="menu-overlay"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 70,
        background: "var(--charcoal)",
        color: "var(--ivory-on-dark)",
        padding: "clamp(28px, 5vh, 56px) var(--gutter)",
        display: "flex",
        flexDirection: "column",
        transform: entered ? "translateX(0)" : "translateX(100%)",
        transition: "transform 720ms cubic-bezier(0.76, 0, 0.24, 1)",
        willChange: "transform",
      }}
    >
      {/* Top bar */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
        <span
          className="mono uppercase"
          style={{ fontSize: 11, letterSpacing: "0.2em", lineHeight: 1.4, color: "var(--ivory-on-dark)" }}
        >
          SONDER
          <br />
          DIGITAL CO.
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          className="mono uppercase menu-close"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            background: "transparent",
            border: "none",
            color: "var(--ivory-on-dark)",
            fontSize: 11,
            letterSpacing: "0.24em",
            cursor: "none",
          }}
          aria-label="Close menu"
        >
          CLOSE
          <span aria-hidden style={{ fontSize: 16, lineHeight: 1, color: "var(--soft-gold)" }}>
            ×
          </span>
        </button>
      </div>

      {/* Chapter links */}
      <nav
        aria-label="Chapters"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: "clamp(2px, 0.6vh, 8px)",
        }}
      >
        {chapters.map((c, i) => {
          const active = i === activeIdx;
          return (
            <a
              key={c.id}
              href={c.href}
              onClick={onClose}
              className="menu-link"
              aria-current={active ? "true" : undefined}
              style={{
                display: "flex",
                alignItems: "baseline",
                gap: "clamp(16px, 2vw, 32px)",
                textDecoration: "none",
                color: "var(--ivory-on-dark)",
                opacity: entered ? 1 : 0,
                transform: entered ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 600ms ease ${0.12 + i * 0.06}s, transform 700ms cubic-bezier(0.2,0.6,0.16,1) ${0.12 + i * 0.06}s`,
              }}
            >
              <span
                className="mono"
                style={{
                  fontSize: 12,
                  letterSpacing: "0.2em",
                  color: "var(--soft-gold)",
                  width: 28,
                  flexShrink: 0,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                {active && (
                  <span
                    aria-hidden
                    style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--soft-gold)", flexShrink: 0 }}
                  />
                )}
                {c.id}
              </span>
              <span
                className="menu-link__label"
                style={{
                  fontFamily: "var(--font-serif), serif",
                  fontWeight: 500,
                  fontSize: "clamp(40px, 8vw, 104px)",
                  lineHeight: 1.0,
                  letterSpacing: "-0.02em",
                  textTransform: "uppercase",
                  fontStyle: active ? "italic" : "normal",
                  color: active ? "var(--soft-gold)" : "var(--ivory-on-dark)",
                }}
              >
                {c.label}
              </span>
            </a>
          );
        })}
      </nav>

      {/* Bottom column — contact + social */}
      <div
        className="menu-foot"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: "var(--gutter)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <span className="mono uppercase" style={{ fontSize: 10, letterSpacing: "0.26em", color: "var(--soft-gold)" }}>
            REACH
          </span>
          <a
            href="mailto:chase@sonderdigital-co.com"
            className="menu-contact"
            style={{
              fontFamily: "var(--font-serif), serif",
              fontStyle: "italic",
              fontSize: "clamp(18px, 2.4vw, 28px)",
              color: "var(--ivory-on-dark)",
              textDecoration: "none",
            }}
          >
            chase@sonderdigital-co.com
          </a>
        </div>
        <div style={{ display: "flex", gap: "clamp(16px, 2vw, 28px)" }}>
          {social.map((s) => (
            <a
              key={s.label}
              href={s.href}
              className="mono uppercase menu-social"
              style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--ivory-on-dark)", textDecoration: "none", opacity: 0.75 }}
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
