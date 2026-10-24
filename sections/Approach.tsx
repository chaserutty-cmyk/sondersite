import type { CSSProperties } from "react";
import { APPROACH, CTA } from "@/lib/copy";
import { BOOKING_URL } from "@/lib/site";
import { Eyebrow, ArrowUpRight } from "@/components/ui";
import Counter from "@/components/Counter";
import Image from "next/image";

/**
 * Our approach — SynthCoder's "Execution Flow": a sticky dark art card on the left
 * (a licensed render of gold ribbons flowing on black) with
 * the approved heading, subline and a Book a Discovery Call link; the four steps
 * scroll on the right.
 */
export default function Approach() {
  return (
    <section id="approach" className="sheet" aria-labelledby="approach-h">
      <div className="split">
        <div className="art on-dark">
          <div className="art__media" aria-hidden="true">
            <Image src="/art/ribbon.webp" alt="" fill sizes="(min-width: 1100px) 36vw, 100vw" className="art__img" quality={82} />
          </div>
          <Eyebrow n="04" label={APPROACH.label} className="art__eyebrow" />
          <div className="art__copy">
            <h2 id="approach-h" className="art__title">
              {APPROACH.heading.replace("implementation.", "")}
              <span className="accent">implementation.</span>
            </h2>
            <p className="art__sub">{APPROACH.sub}</p>
            <a className="art__link mono" href={BOOKING_URL} target="_blank" rel="noopener" data-placement="approach">
              {CTA}
              <ArrowUpRight />
            </a>
          </div>
          <Counter selector="#approach .step" total={APPROACH.steps.length} ring="Discover · Design · Build · Refine" />
        </div>

        <ol className="col">
          {APPROACH.steps.map((s, i) => (
            <li key={s.title} className="step" style={{ "--p": i + 1 } as CSSProperties}>
              <div className="label mono">
                <b>00{i + 1}.</b>
                <span>{APPROACH.label}</span>
              </div>
              <h3 className="step__title">{s.title}</h3>
              <p className="body">{s.body}</p>
              <div className="step__bar mono" aria-hidden="true">
                <span />
                <em style={{ fontStyle: "normal", color: "var(--ink-3)" }}>
                  0{i + 1}/0{APPROACH.steps.length}
                </em>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
