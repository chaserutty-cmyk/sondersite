import { WORK } from "@/lib/copy";
import { Eyebrow, Rise } from "@/components/ui";
import QuoteDemo from "@/components/QuoteDemo";

/**
 * In practice — a dark sheet with an index of three recent builds on the left and the
 * interactive quote follow-up demonstration pinned on the right.
 *
 * Each row: number, the approved title and description, the capabilities it combined
 * (the four capability names from the section above) and its status. No screenshots:
 * the demonstration is the one visual, and it is the thing the third row describes.
 */
export default function Work() {
  return (
    <section id="work" className="sheet sheet--dark on-dark pad" aria-labelledby="work-h">
      <div className="work__head">
        <div>
          <Eyebrow n="03" label={WORK.label} />
          <Rise as="h2" className="h2" id="work-h" accent={WORK.heading[1]}>
            {WORK.heading[0]}
          </Rise>
        </div>
        <p className="body" data-reveal>
          {WORK.sub}
        </p>
      </div>

      <div className="builds">
        <ol className="builds__list">
          {WORK.items.map((w, i) => (
            <li key={w.id} className="build" data-reveal style={{ ["--d" as string]: `${i * 90}ms` }}>
              <span className="build__n mono">0{i + 1}</span>
              <div className="build__main">
                <h3 className="build__title">{w.title}</h3>
                <p className="build__body">{w.body}</p>
                <div className="build__meta">
                  <ul className="build__caps" aria-label="Capabilities combined">
                    {w.caps.map((c) => (
                      <li key={c} className="tag tag--dark">
                        {c}
                      </li>
                    ))}
                  </ul>
                  <span className="build__status mono">
                    <i aria-hidden="true" />
                    {w.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ol>

        <div className="builds__demo" data-reveal>
          <div className="builds__stage">
            <QuoteDemo />
          </div>
          <p className="builds__note mono">
            <i aria-hidden="true" />
            {WORK.demoNote}
          </p>
        </div>
      </div>

      <div className="work__foot mono">
        <span>{WORK.footnote}</span>
        <span>Sonder Digital / 2026</span>
      </div>
    </section>
  );
}
