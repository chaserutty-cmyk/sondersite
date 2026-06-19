"use client";

import { useEffect, useRef } from "react";
import {
  gsap,
  ensureGsap,
  prefersReducedMotion,
  isMobileViewport,
  GRAVITY_PULL,
} from "@/lib/motion";
import GravityReveal from "@/components/GravityReveal";
import ChapterSeam from "@/components/ChapterSeam";

/**
 * WorldMobile — the portrait-edition WORLD chapter (03), mobile only.
 *
 * The desktop spread is a wide absolute composition; on phones it collapses to
 * a vertical editorial column that finally restores the full manifesto the old
 * mobile layout deleted:
 *
 *   "Attention is not drawn by force, but by the irresistible pull of
 *    authored experience."
 *
 * Choreography (all gravity-grammar):
 *   · WORLD sits behind the type as an oversized watermark that bleeds off-edge.
 *   · "We engineer / presence." masks up line by line.
 *   · the manifesto falls in line by line; the gold words ignite as they land.
 *   · the climax — "authored experience." — is literally *pulled* up toward the
 *     word "pull" above it (the chapter's signature kinetic moment).
 *
 * Hidden above 767px via `.world-mobile { display: none }`.
 */
export default function WorldMobile() {
  const climaxRef = useRef<HTMLParagraphElement | null>(null);

  // Signature "pull": the climax is drawn up-and-left toward the word "pull",
  // its letterforms tightening from spread to set as it arrives.
  useEffect(() => {
    const el = climaxRef.current;
    if (!el || !isMobileViewport()) return;
    ensureGsap();

    if (prefersReducedMotion()) {
      gsap.set(el, { autoAlpha: 1, x: 0, y: 0, letterSpacing: "0px" });
      return;
    }

    gsap.set(el, { autoAlpha: 0, x: 30, y: 26, letterSpacing: "7px" });
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            gsap.to(el, {
              autoAlpha: 1,
              x: 0,
              y: 0,
              letterSpacing: "0px",
              duration: 1.15,
              ease: GRAVITY_PULL,
              overwrite: "auto",
            });
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="world-mobile" aria-hidden={false}>
      {/* Chapter index */}
      <GravityReveal variant="rise" distance={20}>
        <p className="world-m-index">
          <span className="world-m-index__tick" />
          03 — WORLD
        </p>
      </GravityReveal>

      {/* WORLD watermark — oversized, behind the type, bleeding off the right. */}
      <span className="world-m-watermark" aria-hidden="true">
        WORLD
      </span>

      {/* Statement — masks up line by line. */}
      <h2 className="world-m-statement">
        <GravityReveal variant="mask">
          <span className="world-m-statement__line">We engineer</span>
        </GravityReveal>
        <GravityReveal variant="mask" delay={0.12}>
          <span className="world-m-statement__line">presence.</span>
        </GravityReveal>
      </h2>

      {/* Manifesto — the restored quote, falling in line by line. */}
      <div className="world-m-quote">
        <GravityReveal variant="rise" delay={0}>
          <p className="world-m-line">
            Attention is <span className="world-quote__gold">not</span> drawn by
          </p>
        </GravityReveal>
        <GravityReveal variant="rise" delay={0.06}>
          <p className="world-m-line">
            <span className="world-quote__gold-lg">force,</span>{" "}
            <span className="world-m-assert">but by</span>
          </p>
        </GravityReveal>
        <GravityReveal variant="rise" delay={0.12}>
          <p className="world-m-line">
            the irresistible <span className="world-quote__gold-lg">pull</span> of
          </p>
        </GravityReveal>

        {/* Climax — pulled up toward "pull". */}
        <p ref={climaxRef} className="world-m-climax">
          authored
          <br />
          experience.
        </p>
      </div>

      {/* Chapter seam — unified handoff into 05 SERVICES. */}
      <ChapterSeam stamp="03 / WORLD" href="#services" cta="SEE THE SERVICES" />
    </div>
  );
}
