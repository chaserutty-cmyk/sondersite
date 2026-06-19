"use client";

import Image from "next/image";
import GravityReveal from "@/components/GravityReveal";
import ChapterSeam from "@/components/ChapterSeam";
import { SERVICES } from "@/sections/ServicesHero";

/**
 * ServicesMobile — the portrait-edition SERVICES chapter (05), mobile only.
 *
 * Desktop is a four-column table whose entire visual column (the five render
 * panels) is hidden below 900px — so on phones the old layout lost every image.
 * This restores them as a vertical *deck*: each service is a framed plate that
 * settles into place with weight as it scrolls in (one image, one moment at a
 * time), led by the restored manifesto.
 *
 * Hidden above 767px via `.services-mobile { display: none }`.
 */
export default function ServicesMobile() {
  return (
    <div className="services-mobile">
      {/* Chapter header */}
      <GravityReveal variant="rise" distance={20}>
        <p className="svc-m-index">
          <span className="svc-m-index__tick" />
          05 — SERVICES
        </p>
      </GravityReveal>

      {/* Manifesto */}
      <GravityReveal variant="rise" delay={0.05}>
        <div className="svc-m-manifesto">
          <span className="svc-m-label">WHAT WE DO</span>
          <h2 className="svc-m-head">
            <span>WE BUILD</span>
            <span>DIGITAL</span>
            <span className="svc-m-head__gold">GRAVITY.</span>
          </h2>
          <p className="svc-m-intro">
            Integrated solutions that build presence systems with precision and
            purpose.
          </p>
        </div>
      </GravityReveal>

      {/* The deck — a sticky scroll-stack. Each card sticks at a progressively
          lower offset, so as you scroll the next card rises and covers the
          previous card's image, coming to rest just below its header. The
          stacking IS the motion, so no per-card reveal wrapper here. */}
      <div className="svc-m-deck">
        {SERVICES.map((service, i) => (
          <article
            key={service.num}
            className="svc-m-card"
            style={{ ["--i" as string]: i }}
          >
            <header className="svc-m-card__head">
              <span className="svc-m-card__num">{service.num}</span>
              <div className="svc-m-card__heading">
                <span className="svc-m-card__meta">{service.num} / 05</span>
                <h3 className="svc-m-card__title">{service.title}</h3>
              </div>
            </header>

            <div className="svc-m-plate">
              <Image
                src={service.image}
                alt={service.imageAlt}
                fill
                sizes="(max-width: 767px) 92vw, 22vw"
                style={{ objectFit: "cover" }}
              />
            </div>

            <p className="svc-m-card__desc">{service.desc}</p>
          </article>
        ))}
      </div>

      {/* Chapter seam — unified handoff into 06 CONNECT. */}
      <ChapterSeam stamp="05 / SERVICES" href="#connect" cta="START A PROJECT" />
    </div>
  );
}
