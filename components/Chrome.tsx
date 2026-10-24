"use client";

import { useEffect, useRef, useState } from "react";
import { NAV, CONTACT_EMAIL } from "@/lib/site";
import { BookPill, Logo, ArrowUpRight } from "@/components/ui";

/**
 * MenuButton dispatches "sonder:menu"; Chrome listens and renders the full-screen
 * menu and the floating dock (Book a Discovery Call + menu), SynthCoder-style.
 */
export function MenuButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      className={`menu-btn ${className}`}
      aria-label="Open menu"
      aria-haspopup="dialog"
      onClick={() => window.dispatchEvent(new CustomEvent("sonder:menu", { detail: true }))}
    >
      <i aria-hidden="true" />
    </button>
  );
}

export default function Chrome() {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const lastFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onMenu = (e: Event) => {
      const next = (e as CustomEvent<boolean>).detail;
      if (next) lastFocus.current = document.activeElement as HTMLElement;
      setOpen(next);
    };
    window.addEventListener("sonder:menu", onMenu);
    return () => window.removeEventListener("sonder:menu", onMenu);
  }, []);

  useEffect(() => {
    if (!open) {
      lastFocus.current?.focus?.();
      return;
    }
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") window.dispatchEvent(new CustomEvent("sonder:menu", { detail: false }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <div className="dock" data-dock>
        <BookPill placement="dock" />
        <MenuButton />
      </div>

      {open ? (
        <div className="menu" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="menu__top">
            <Logo className="on-dark" />
            <button
              ref={closeRef}
              type="button"
              className="menu-btn"
              aria-label="Close menu"
              onClick={() => window.dispatchEvent(new CustomEvent("sonder:menu", { detail: false }))}
            >
              <span className="menu__close" aria-hidden="true">
                ×
              </span>
            </button>
          </div>
          <nav className="menu__links" aria-label="Page sections">
            {NAV.map((n, i) => (
              <a key={n.href} href={n.href}>
                <span>0{i + 1}</span>
                {n.label}
              </a>
            ))}
          </nav>
          <div className="menu__foot">
            <a className="mono" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL} <ArrowUpRight className="inline" />
            </a>
            <BookPill className="pill-btn--ghost" placement="menu" />
          </div>
        </div>
      ) : null}
    </>
  );
}
