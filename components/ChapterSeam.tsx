"use client";

import GravityReveal from "@/components/GravityReveal";

/**
 * ChapterSeam — the portrait-edition chapter handoff, mobile only.
 *
 * Every light chapter closes with the same instrument: a hairline, the chapter
 * stamp on the left (a bookend to the "0X — NAME" index that opened it), and a
 * single underline-and-gold-node CTA on the right that carries the eye into the
 * next chapter. One seam language across the whole scroll = cohesion + flow.
 *
 * Rendered inside the `.X-mobile` components, so it only exists below 767px.
 */
type ChapterSeamProps = {
  /** Left bookend, e.g. "01 / SIGNAL". */
  stamp: string;
  /** Anchor of the next chapter, e.g. "#system". */
  href: string;
  /** Forward CTA label, e.g. "EXPLORE THE SYSTEM". */
  cta: string;
};

export default function ChapterSeam({ stamp, href, cta }: ChapterSeamProps) {
  return (
    <GravityReveal variant="rise" distance={16}>
      <div className="m-seam">
        <span className="m-seam__stamp">{stamp}</span>
        <a className="m-seam__cta" href={href}>
          {cta}
          <span aria-hidden className="m-seam__node" />
        </a>
      </div>
    </GravityReveal>
  );
}
