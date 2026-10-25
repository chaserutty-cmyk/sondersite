import { TALK } from "@/lib/copy";
import { CONTACT_EMAIL } from "@/lib/site";
import { BookButton, Eyebrow, Rise, ArrowUpRight } from "@/components/ui";
import Loop from "@/components/Loop";

/**
 * Let's talk — SynthCoder's dark CTA sheet over a particle wave, centred. The
 * approved kicker, heading and two paragraphs; the primary action; the email.
 */
export default function Talk() {
  return (
    <section id="talk" className="sheet sheet--dark on-dark talk" aria-labelledby="talk-h">
      <Loop src="/video/talk-loop.mp4" srcSmall="/video/talk-loop-720.mp4" poster="/video/talk-loop.jpg" />
      <div className="talk__inner">
        <Eyebrow n="05" label={TALK.label} />
        <p className="talk__kicker mono" data-reveal>
          {TALK.kicker}
        </p>
        <Rise as="h2" className="talk__h" id="talk-h" accent={TALK.heading[1]}>
          {TALK.heading[0]}
        </Rise>
        {TALK.body.map((p, i) => (
          <p key={p} className="talk__body" data-reveal style={{ ["--d" as string]: `${150 + i * 100}ms` }}>
            {p}
          </p>
        ))}
        <div className="talk__actions" data-reveal style={{ ["--d" as string]: "350ms" }}>
          <BookButton tone="light" placement="talk" />
          <a className="talk__mail mono" href={`mailto:${CONTACT_EMAIL}`}>
            {CONTACT_EMAIL}
            <ArrowUpRight />
          </a>
        </div>
      </div>
    </section>
  );
}
