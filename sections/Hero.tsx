import { HERO, DISCIPLINES, INTERFACES } from "@/lib/copy";
import { NAV, CONTACT_EMAIL } from "@/lib/site";
import { BookButton, BookPill, Eyebrow, Logo, ArrowDown, Rise } from "@/components/ui";
import { MenuButton } from "@/components/Chrome";
import Loop from "@/components/Loop";

/**
 * Hero — SynthCoder's split: a white type sheet (logo, anchors, menu, headline,
 * paragraphs, primary action) beside a dark sheet carrying the live gold particle
 * wave and floating interface chips. A notch in the white sheet holds the location
 * pill; the strip beneath is the disciplines marquee.
 */
export default function Hero() {
  const [l1, l2, l3] = HERO.headline;
  const chips = [
    { text: INTERFACES.assistant.steps[0], style: { top: "22%", right: "9%" }, d: "0s" },
    { text: INTERFACES.followUp.stages[1], style: { top: "38%", left: "12%" }, d: "-2s", hide: true },
    { text: INTERFACES.followUp.stages[2], style: { top: "52%", right: "14%" }, d: "-4s" },
    { text: INTERFACES.assistant.steps[1], style: { top: "12%", left: "34%" }, d: "-1s", hide: true },
  ];
  const marquee = [...DISCIPLINES, ...DISCIPLINES];

  return (
    <>
      <section className="hero" data-hero aria-label="Introduction">
        <div className="hero__main">
          <div className="hero__top">
            <a href="#top" aria-label="Sonder Digital Co., back to top">
              <Logo />
            </a>
            <nav className="hero__links" aria-label="Page sections">
              {NAV.map((n) => (
                <a key={n.href} href={n.href}>
                  {n.label}
                </a>
              ))}
            </nav>
            <MenuButton />
          </div>

          <div className="hero__content">
            <Eyebrow label={HERO.label} />
            <Rise as="h1" className="hero__title" accent={l3}>
              {`${l1} ${l2}`}
            </Rise>
            <p className="lede hero__lede" data-reveal style={{ ["--d" as string]: "250ms" }}>
              {HERO.lede}
            </p>
            <p className="hero__support" data-reveal style={{ ["--d" as string]: "350ms" }}>
              {HERO.support}
            </p>
            <div className="hero__actions" data-reveal style={{ ["--d" as string]: "450ms" }}>
              <BookButton placement="hero" />
              <a href="#perspective" className="round-btn">
                <span className="round-btn__circle">
                  <ArrowDown />
                </span>
                <span className="round-btn__text mono">
                  <span>{HERO.scroll}</span>
                  <span>(SD — 01)</span>
                </span>
              </a>
            </div>
          </div>

          <div className="hero__ticker marquee mono" aria-hidden="true">
            <div className="marquee__track">
              {[0, 1].map((g) => (
                <div key={g} className="marquee__group">
                  {marquee.map((d, i) => (
                    <span key={`${g}${i}`} className="marquee__item">
                      {d}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="notch">
            <span className="notch__pill">
              <span className="notch__mark" aria-hidden="true">
                <span />
              </span>
              <span className="mono">{HERO.location}</span>
            </span>
          </div>
        </div>

        <div className="hero__side">
          <div className="hero__bar">
            <a className="pill-btn pill-btn--ghost" href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL}
            </a>
            <BookPill placement="nav" />
          </div>
          <div className="hero__visual">
            <Loop src="/video/hero-loop.mp4" srcSmall="/video/hero-loop-720.mp4" poster="/video/hero-loop.jpg" />
            <span className="glass glass--fig float">
              <span className="dot" />
              Fig. 01 — {HERO.figure}
            </span>
            {chips.map((c) => (
              <span
                key={c.text}
                className={`glass float ${c.hide ? "glass--hide-sm" : ""}`}
                style={{ ...c.style, ["--fd" as string]: c.d }}
                aria-hidden="true"
              >
                <span className="dot" />
                {c.text}
              </span>
            ))}
            <span className="glass glass--card mono" aria-hidden="true">
              <span>{DISCIPLINES.join(" · ")}</span>
            </span>
          </div>
        </div>
      </section>

      <div className="marquee mono" aria-hidden="true">
        <div className="marquee__track">
          {[0, 1].map((g) => (
            <div key={g} className="marquee__group">
              {[...DISCIPLINES, ...DISCIPLINES, ...DISCIPLINES].map((d, i) => (
                <span key={`${g}${i}`} style={{ display: "contents" }}>
                  <span className="marquee__item">{d}</span>
                  <span className="marquee__sep" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
