"use client";

import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Page-wide motion, in one place.
 *
 *  - Lenis smooth scrolling, so the page eases rather than snaps (the Lonestone
 *    feel). Off under prefers-reduced-motion, where native scrolling is used.
 *  - Anchor links route through Lenis, offset for the fixed dock.
 *  - Blocks marked data-reveal / data-rise, capability and step blocks get .is-in
 *    once when they enter the viewport.
 *  - Elements marked data-parallax drift a few pixels against the scroll.
 *  - The floating dock (Book a Discovery Call + menu) appears after the hero.
 */
export default function Motion() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const root = document.documentElement;

    // Reveal observer.
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal], [data-rise], .cap, .step, .case");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("is-in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
    );
    targets.forEach((t) => (reduce ? t.classList.add("is-in") : io.observe(t)));

    // Dock visibility: after the hero has scrolled away.
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const dock = document.querySelector<HTMLElement>("[data-dock]");
    let dockIo: IntersectionObserver | null = null;
    if (hero && dock) {
      dockIo = new IntersectionObserver(([e]) => dock.classList.toggle("is-on", !e.isIntersecting), {
        threshold: 0.05,
      });
      dockIo.observe(hero);
    }

    // Smooth scroll.
    let lenis: Lenis | null = null;
    let raf = 0;
    const parallax = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const tick = (time: number) => {
      lenis?.raf(time);
      if (!reduce && parallax.length) {
        const vh = window.innerHeight;
        for (const el of parallax) {
          const r = el.getBoundingClientRect();
          if (r.bottom < -200 || r.top > vh + 200) continue;
          const amt = Number(el.dataset.parallax) || 24;
          const p = (r.top + r.height / 2 - vh / 2) / vh;
          el.style.transform = `translate3d(0, ${(-p * amt).toFixed(2)}px, 0)`;
        }
      }
      raf = requestAnimationFrame(tick);
    };
    if (!reduce) {
      lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 3.2), wheelMultiplier: 0.95 });
      root.classList.add("lenis");
    }
    raf = requestAnimationFrame(tick);

    // Anchor links.
    const onClick = (ev: MouseEvent) => {
      const a = (ev.target as HTMLElement).closest<HTMLAnchorElement>('a[href^="#"]');
      if (!a) return;
      const id = a.getAttribute("href")!;
      if (id === "#" || id === "#main") return;
      const el = id === "#top" ? document.body : document.querySelector<HTMLElement>(id);
      if (!el) return;
      ev.preventDefault();
      window.dispatchEvent(new CustomEvent("sonder:menu", { detail: false }));
      if (lenis) lenis.scrollTo(el, { offset: id === "#top" ? 0 : -8 });
      else el.scrollIntoView({ behavior: reduce ? "auto" : "smooth" });
      history.replaceState(null, "", id);
    };
    document.addEventListener("click", onClick);

    // Lock scroll while the menu is open.
    const onMenu = (e: Event) => {
      const open = (e as CustomEvent<boolean>).detail;
      if (open) lenis?.stop();
      else lenis?.start();
    };
    window.addEventListener("sonder:menu", onMenu);

    return () => {
      io.disconnect();
      dockIo?.disconnect();
      cancelAnimationFrame(raf);
      lenis?.destroy();
      root.classList.remove("lenis");
      document.removeEventListener("click", onClick);
      window.removeEventListener("sonder:menu", onMenu);
    };
  }, []);

  return null;
}
