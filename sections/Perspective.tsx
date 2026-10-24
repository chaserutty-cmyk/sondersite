import { PERSPECTIVE, INTERFACES } from "@/lib/copy";
import { Eyebrow, Rise } from "@/components/ui";

/**
 * Our perspective — SynthCoder's dark "statement" sheet. Left: an operations console
 * whose only content is the approved workflow (New inquiry → Qualification →
 * CRM + follow-up); no invented numbers. Right: the approved heading and paragraphs
 * under a gold quote mark, signed off with the approved line.
 */
export default function Perspective() {
  const arch = INTERFACES.architecture;
  return (
    <section id="perspective" className="sheet sheet--dark on-dark pad" aria-labelledby="persp-h">
      <Eyebrow n="01" label={`${PERSPECTIVE.label} · ${PERSPECTIVE.kicker}`} />
      <div className="persp__grid">
        <div className="console" data-reveal data-parallax="18">
          <div className="console__bar mono">
            <span className="console__dots" aria-hidden="true">
              <i />
              <i />
              <i />
            </span>
            <span>Sonder · {PERSPECTIVE.label}</span>
            <span className="status">
              <i />
              {INTERFACES.assistant.status}
            </span>
          </div>
          <div className="console__body">
            <div className="console__rail" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="console__main">
              <div className="arch">
                {arch.map((n, i) => (
                  <div key={n.k} style={{ display: "contents" }}>
                    <div className="arch__node">
                      <span className="arch__k mono">{n.k}</span>
                      <span className="arch__v">{n.v}</span>
                      <span className="arch__s mono">{n.s}</span>
                    </div>
                    {i < arch.length - 1 ? <span className="arch__link" aria-hidden="true" /> : null}
                  </div>
                ))}
              </div>
              <div className="console__foot mono">
                <span>{INTERFACES.connected[0]}</span>
                <span>{INTERFACES.connected[1]}</span>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="persp__quote" aria-hidden="true">
            “
          </div>
          <Rise as="h2" className="persp__h" id="persp-h">
            {PERSPECTIVE.heading}
          </Rise>
          <div className="persp__body" data-reveal>
            {PERSPECTIVE.body.map((p) => (
              <p key={p} className="body">
                {p}
              </p>
            ))}
          </div>
          <div className="persp__sign" data-reveal>
            <span className="persp__sign-mark" aria-hidden="true">
              s.
            </span>
            <div className="mono">
              <span>{PERSPECTIVE.signoff[0]}</span>
              <span>{PERSPECTIVE.signoff[1]}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
