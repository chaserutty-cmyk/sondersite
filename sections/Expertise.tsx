import type { CSSProperties } from "react";
import { EXPERTISE } from "@/lib/copy";
import { Eyebrow, Output } from "@/components/ui";
import Counter from "@/components/Counter";
import Image from "next/image";
import { TileAI, TileAutomation, TileSoftware, TileSales } from "@/components/Tile";

const TILES: Record<string, React.ComponentType> = { ai: TileAI, automation: TileAutomation, software: TileSoftware, sales: TileSales };

/**
 * Our expertise (Solutions) — SynthCoder's services layout. A sticky dark art card on
 * the left holds a licensed tunnel render graded to gold, the approved heading and subline, and a
 * live 01/04 counter. The right column scrolls through the four capabilities, each
 * with its label, title, approved lead and description, a workflow bar, tags drawn
 * from its own description, two device renders and a typed output line.
 */
function TileFor({ id }: { id: string }) {
  const T = TILES[id];
  return <T />;
}

export default function Expertise() {
  const items = EXPERTISE.items;
  return (
    <section id="solutions" className="sheet" aria-labelledby="solutions-h">
      <div className="split">
        <div className="art on-dark">
          <div className="art__media" aria-hidden="true">
            <Image src="/art/tunnel.webp" alt="" fill sizes="(min-width: 1100px) 36vw, 100vw" className="art__img" quality={82} />
          </div>
          <Eyebrow n="02" label={EXPERTISE.label} className="art__eyebrow" />
          <div className="art__copy">
            <h2 id="solutions-h" className="art__title">
              {EXPERTISE.heading[0]}
              <br />
              <span className="accent">{EXPERTISE.heading[1]}</span>
            </h2>
            <p className="art__sub">{EXPERTISE.sub}</p>
          </div>
          <Counter selector="#solutions .cap" total={items.length} ring="Sonder Digital · What we build" />
        </div>

        <div className="col">
          {items.map((c, idx) => {
            return (
              <article key={c.id} id={`cap-${c.id}`} className="cap">
                <div className="label mono" data-reveal>
                  <b>00{idx + 1}.</b>
                  <span>{c.tag}</span>
                </div>
                <h3 className="h3 cap__title" data-reveal>
                  {c.title}
                </h3>
                <p className="cap__lead" data-reveal>
                  {c.lead}
                </p>
                <p className="body cap__body" data-reveal>
                  {c.body}
                </p>

                <div className="flow" data-reveal aria-label={c.flow.join(", then ")}>
                  {c.flow.map((f, i) => (
                    <span key={f} style={{ display: "contents" }}>
                      <span className="flow__node">
                        <i aria-hidden="true" />
                        {f}
                      </span>
                      {i < c.flow.length - 1 ? (
                        <span className="flow__link" style={{ "--i": i } as CSSProperties} aria-hidden="true" />
                      ) : null}
                    </span>
                  ))}
                </div>

                <div className="tags" data-reveal>
                  {c.pills.map((p) => (
                    <span key={p} className="tag">
                      {p}
                    </span>
                  ))}
                </div>

                <div data-reveal>
                  <TileFor id={c.id} />
                </div>

                <Output text={c.output} />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
