"use client";

import { useEffect, useState } from "react";

/**
 * StickyApply — the Apply bar pinned to the bottom of the window, at every
 * screen size, from the moment the page loads.
 *
 * The page is long and has one action. This keeps that action, and the pay
 * line that earns the tap, in reach wherever the reader is. It steps aside in
 * exactly one place: while the application itself is on screen, so it never
 * sits on top of the form or its Submit button.
 *
 * It renders shown, so it is there before any script runs; the script only
 * ever hides it.
 */
export default function StickyApply({ label, pay, terms }: { label: string; pay: string; terms: string }) {
  const [shown, setShown] = useState(true);

  useEffect(() => {
    const form = document.querySelector("#apply");
    if (!form || !("IntersectionObserver" in window)) return;
    const io = new IntersectionObserver(([entry]) => setShown(!entry.isIntersecting));
    io.observe(form);
    return () => io.disconnect();
  }, []);

  return (
    <div className={`cr-sticky${shown ? " is-shown" : ""}`} inert={!shown}>
      <p className="cr-sticky__summary">
        <strong>{pay}</strong>
        <span>{terms}</span>
      </p>
      <a className="cr-btn cr-sticky__btn" href="#apply">
        <span className="cr-btn__node" aria-hidden="true" />
        {label}
      </a>
    </div>
  );
}
