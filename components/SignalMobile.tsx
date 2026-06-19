"use client";

import { useEffect, useRef } from "react";
import { isMobileViewport, prefersReducedMotion } from "@/lib/motion";
import GravityReveal from "@/components/GravityReveal";
import GravityCoreImage from "@/components/GravityCoreImage";
import OrbitalDiagram from "@/components/OrbitalDiagram";
import ChapterSeam from "@/components/ChapterSeam";

/**
 * SignalMobile — the portrait-edition SIGNAL chapter (01), mobile only.
 *
 * Desktop hides the entire diagram zone on phones, so the hero lost its orb.
 * This restores the gravity core + orbital rings as a portrait centerpiece set
 * between the two halves of the poster headline, and gives it the chapter's
 * SIGNATURE: the core answers device tilt (gyroscope) and drifts on scroll —
 * gravity you can feel. Tilt gracefully degrades to scroll-parallax when the
 * gyroscope is unavailable or permission is denied.
 *
 * Hidden above 767px via `.signal-mobile { display: none }`.
 */
export default function SignalMobile() {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const orbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const orb = orbRef.current;
    if (!stage || !orb || !isMobileViewport() || prefersReducedMotion()) return;

    // target = where the orb wants to be; cur = where it is (lerped → settle).
    let tiltX = 0, tiltY = 0;
    let curX = 0, curY = 0;
    let raf = 0;
    let active = true;

    const onOrient = (e: DeviceOrientationEvent) => {
      const g = Math.max(-30, Math.min(30, e.gamma ?? 0)); // left/right
      const b = Math.max(-30, Math.min(30, (e.beta ?? 45) - 45)); // front/back
      tiltX = (g / 30) * 18;
      tiltY = (b / 30) * 14;
    };

    const loop = () => {
      // scroll parallax — orb drifts opposite the stage's travel.
      const r = stage.getBoundingClientRect();
      const fromCenter = r.top + r.height / 2 - window.innerHeight / 2;
      const parallax = (fromCenter / window.innerHeight) * -26;
      const targetX = tiltX;
      const targetY = tiltY + parallax;
      curX += (targetX - curX) * 0.08; // weighted settle
      curY += (targetY - curY) * 0.08;
      orb.style.transform = `translate(${curX.toFixed(2)}px, ${curY.toFixed(2)}px)`;
      if (active) raf = requestAnimationFrame(loop);
    };

    // Run the loop only while the hero is near the viewport.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting && !raf) {
            active = true;
            raf = requestAnimationFrame(loop);
          } else if (!en.isIntersecting) {
            active = false;
            if (raf) { cancelAnimationFrame(raf); raf = 0; }
          }
        });
      },
      { threshold: 0 }
    );
    io.observe(stage);

    // Gyroscope — request permission on first touch where iOS requires it,
    // otherwise subscribe directly. Scroll-parallax works regardless.
    const DOE = window.DeviceOrientationEvent as
      | (typeof DeviceOrientationEvent & { requestPermission?: () => Promise<PermissionState> })
      | undefined;
    let touchHandler: (() => void) | null = null;
    if (DOE) {
      if (typeof DOE.requestPermission === "function") {
        touchHandler = () => {
          DOE.requestPermission!()
            .then((state) => {
              if (state === "granted") window.addEventListener("deviceorientation", onOrient);
            })
            .catch(() => {});
          if (touchHandler) window.removeEventListener("touchstart", touchHandler);
        };
        window.addEventListener("touchstart", touchHandler, { once: true });
      } else {
        window.addEventListener("deviceorientation", onOrient);
      }
    }

    return () => {
      active = false;
      if (raf) cancelAnimationFrame(raf);
      io.disconnect();
      window.removeEventListener("deviceorientation", onOrient);
      if (touchHandler) window.removeEventListener("touchstart", touchHandler);
    };
  }, []);

  return (
    <div className="signal-mobile">
      {/* Chapter index */}
      <GravityReveal variant="rise" distance={20}>
        <p className="sig-m-index">
          <span className="sig-m-index__tick" />
          01 — SIGNAL
        </p>
      </GravityReveal>

      {/* Headline — first half */}
      <h1 className="sig-m-headline">
        <GravityReveal variant="mask">
          <span className="sig-m-line sig-m-line--serif">MOST BRANDS</span>
        </GravityReveal>
        <GravityReveal variant="mask" delay={0.1}>
          <span className="sig-m-line sig-m-line--serif">
            CHASE ATTENTION<span className="sig-m-gold">.</span>
          </span>
        </GravityReveal>
      </h1>

      {/* Orb stage — gravity core + orbital rings, tilt/parallax driven. */}
      <GravityReveal variant="settle" distance={44}>
        <div className="sig-m-stage" ref={stageRef}>
          <div className="sig-m-orb" ref={orbRef}>
            <div className="sig-m-orbit">
              <OrbitalDiagram />
            </div>
            <GravityCoreImage />
          </div>
          <span className="sig-m-stage__meta">ORBIT ID · SD-01 / GRAVITY CORE</span>
        </div>
      </GravityReveal>

      {/* Headline — second half (the payoff) */}
      <h1 className="sig-m-headline sig-m-headline--payoff">
        <GravityReveal variant="mask">
          <span className="sig-m-line">FEW</span>
        </GravityReveal>
        <GravityReveal variant="mask" delay={0.08}>
          <span className="sig-m-line">CREATE</span>
        </GravityReveal>
        <GravityReveal variant="mask" delay={0.16}>
          <span className="sig-m-line">
            <span className="sig-m-gravity">GRAVITY</span>
            <span className="sig-m-gravity-dot">.</span>
          </span>
        </GravityReveal>
      </h1>

      {/* Thesis annotation */}
      <GravityReveal variant="rise" delay={0.05}>
        <p className="sig-m-annotation">
          We engineer digital presence systems that build trust, create pull, and
          turn perception into momentum.
        </p>
      </GravityReveal>

      {/* Chapter seam — unified handoff into 02 SYSTEM. */}
      <ChapterSeam stamp="01 / SIGNAL" href="#system" cta="EXPLORE THE SYSTEM" />
    </div>
  );
}
