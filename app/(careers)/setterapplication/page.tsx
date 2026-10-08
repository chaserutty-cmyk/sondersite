import type { Metadata } from "next";
import ApplicationForm from "@/components/careers/ApplicationForm";
import StickyApply from "@/components/careers/StickyApply";
import { Footer, Masthead } from "@/components/careers/Chrome";
import { countryOptions } from "@/lib/careers/application";
import { openingStatus } from "@/lib/careers/opening";
import {
  APPLY,
  BONUS,
  CLOSED,
  COMPENSATION,
  CONTACT_EMAIL,
  FAQ,
  HERO,
  OPPORTUNITY,
  PAY,
  PRIVACY_PATH,
  PROCESS,
  REQUIREMENT,
  ROLE_PATH,
  WHAT_YOU_GET,
  WHO_FITS,
} from "@/lib/careers/copy";

/**
 * /setterapplication — the recruiting page for one open role.
 *
 *   01 Hero          role, base pay, bonuses, hours, the one requirement, Apply
 *   02 Opportunity   what the setter sells and does
 *   03 What you get
 *   04 Who fits      the requirement, set apart from the description  + Apply
 *   05 Compensation  guaranteed base and variable bonus, stated apart  + Apply
 *   06 Process
 *   07 Application   the form, on the charcoal inversion (as CONNECT is on the homepage)
 *   08 Questions     + footer
 *
 * Server-rendered and static apart from the form. Copy is in lib/careers/copy.ts.
 * Whether the role is open comes from the CRM database (lib/careers/opening.ts);
 * when it is closed every Apply button and the form give way to a notice.
 */

const SHARE_LINE = PAY.line.replaceAll(" | ", " · ");

export const metadata: Metadata = {
  title: `${HERO.headline.join(" ")} — Remote, Part-Time`,
  description: `Remote, part-time outbound appointment setter for Sonder Digital. ${PAY.base} base plus ${BONUS.show.amount} ${BONUS.show.per} and ${BONUS.close.amount} ${BONUS.close.per}, approximately 16 hours a week. Requires at least one year of calling US businesses.`,
  alternates: { canonical: ROLE_PATH },
  openGraph: {
    title: `${HERO.headline.join(" ")} — Sonder Digital`,
    description: SHARE_LINE,
    url: ROLE_PATH,
  },
  twitter: {
    card: "summary_large_image",
    title: `${HERO.headline.join(" ")} — Sonder Digital`,
    description: SHARE_LINE,
  },
};

function Label({ n, children }: { n: string; children: React.ReactNode }) {
  return (
    <p className="cr-label">
      <span className="cr-label__n">{n}</span>
      <span className="cr-label__tick" aria-hidden="true" />
      {children}
    </p>
  );
}

function Apply({ open }: { open: boolean }) {
  if (!open) return <p className="cr-closed">{CLOSED.title}</p>;
  return (
    <a className="cr-btn" href="#apply" data-apply-cta>
      <span className="cr-btn__node" aria-hidden="true" />
      {HERO.cta}
    </a>
  );
}

/**
 * The house orbit, as a corner mark: two hairline arcs centred on the page's
 * top-right corner and one gold node. Decoration only. It is sized (in
 * careers.css) to end above the pay ledger, so no line ever crosses small type.
 */
function Orbit() {
  return (
    <svg className="cr-orbit" viewBox="0 0 400 400" aria-hidden="true" focusable="false">
      <circle cx="400" cy="0" r="250" />
      <circle cx="400" cy="0" r="395" />
      <circle className="cr-orbit__node" cx="48" cy="181" r="7" />
    </svg>
  );
}

const two = (i: number) => String(i + 1).padStart(2, "0");

export default async function AppointmentSetterPage() {
  const open = (await openingStatus()) === "open";

  return (
    <>
      <Masthead meta="Careers" />

      <main>
        {/* 01 — Hero. On a phone the order is: role, pay ledger, Apply, then the pitch. */}
        <section className="cr-hero">
          <Orbit />
          <div className="cr-wrap cr-hero__grid">
            <div className="cr-hero__head">
              <Label n="01">{open ? HERO.eyebrow : "Role closed"}</Label>
              <h1 className="cr-h1">
                <span>{HERO.headline[0]}</span> <em>{HERO.headline[1]}</em>
              </h1>
            </div>

            <div className="cr-hero__side">
              <dl className="cr-ledger">
                {HERO.ledger.map((row) => (
                  <div className={`cr-ledger__row${row.key ? " cr-ledger__row--key" : ""}`} key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>
                      {row.value}
                      {row.note && <small>{row.note}</small>}
                    </dd>
                  </div>
                ))}
              </dl>
              <div className="cr-hero__action">
                <Apply open={open} />
                <p className="cr-hero__note">{open ? HERO.ctaNote : CLOSED.body}</p>
              </div>
            </div>

            <p className="cr-lede">{HERO.sub}</p>
          </div>
        </section>

        {/* 02 — The opportunity */}
        <section className="cr-section" aria-labelledby="cr-opportunity">
          <div className="cr-wrap cr-split">
            <header>
              <Label n="02">{OPPORTUNITY.label}</Label>
              <h2 className="cr-h2" id="cr-opportunity">
                {OPPORTUNITY.heading}
              </h2>
            </header>
            <div>
              <p className="cr-body cr-body--lead">{OPPORTUNITY.body}</p>
              <h3 className="cr-h3">{OPPORTUNITY.doHeading}</h3>
              <ol className="cr-rows">
                {OPPORTUNITY.doList.map((item, i) => (
                  <li key={item}>
                    <span className="cr-rows__n" aria-hidden="true">
                      {two(i)}
                    </span>
                    {item}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        {/* 03 — What you get */}
        <section className="cr-section" aria-labelledby="cr-get">
          <div className="cr-wrap cr-split">
            <header>
              <Label n="03">{WHAT_YOU_GET.label}</Label>
              <h2 className="cr-h2" id="cr-get">
                {WHAT_YOU_GET.heading}
              </h2>
            </header>
            <div>
              <ul className="cr-gets">
                {WHAT_YOU_GET.items.map((item, i) => (
                  <li key={item}>
                    <span className="cr-gets__n" aria-hidden="true">
                      {two(i)}
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <p className="cr-body cr-body--note">{WHAT_YOU_GET.note}</p>
            </div>
          </div>
        </section>

        {/* 04 — Who fits */}
        <section className="cr-section" aria-labelledby="cr-fit">
          <div className="cr-wrap cr-split">
            <header>
              <Label n="04">{WHO_FITS.label}</Label>
              <h2 className="cr-h2" id="cr-fit">
                {WHO_FITS.heading}
              </h2>
            </header>
            <div>
              <div className="cr-req">
                <p className="cr-req__label">{WHO_FITS.requiredLabel}</p>
                <p className="cr-req__text">{REQUIREMENT.sentence}</p>
                <p className="cr-req__note">{REQUIREMENT.note}</p>
              </div>
              <p className="cr-body cr-body--lead">{WHO_FITS.body}</p>
              <div className="cr-section__action">
                <Apply open={open} />
              </div>
            </div>
          </div>
        </section>

        {/* 05 — Compensation. Base and bonus are two separate statements, never one number.
            The bonus card is the dark one: it is the heavier half of the offer. */}
        <section className="cr-section" aria-labelledby="cr-comp">
          <div className="cr-wrap cr-split">
            <header>
              <Label n="05">{COMPENSATION.label}</Label>
              <h2 className="cr-h2" id="cr-comp">
                {COMPENSATION.heading}
              </h2>
            </header>
            <div>
              <div className="cr-comp">
                <div className="cr-comp__card">
                  <p className="cr-comp__label">{COMPENSATION.base.label}</p>
                  <p className="cr-comp__value">{COMPENSATION.base.value}</p>
                  <p className="cr-comp__note">{COMPENSATION.base.note}</p>
                </div>
                <div className="cr-comp__card cr-comp__card--bonus">
                  <p className="cr-comp__label">{COMPENSATION.bonus.label}</p>
                  <p className="cr-comp__value">{COMPENSATION.bonus.value}</p>
                  <dl className="cr-bonus">
                    {COMPENSATION.bonus.figures.map((figure) => (
                      <div className="cr-bonus__row" key={figure.per}>
                        <dt>
                          <span className="cr-bonus__amount">{figure.amount}</span>
                          <span className="cr-bonus__per">{figure.per}</span>
                        </dt>
                        <dd>{figure.detail}</dd>
                      </div>
                    ))}
                  </dl>
                  <p className="cr-comp__note">{COMPENSATION.bonus.note}</p>
                </div>
              </div>
              <p className="cr-body cr-body--note">{COMPENSATION.disclaimer}</p>
              <div className="cr-section__action">
                <Apply open={open} />
              </div>
            </div>
          </div>
        </section>

        {/* 06 — Hiring process */}
        <section className="cr-section" aria-labelledby="cr-process">
          <div className="cr-wrap">
            <header>
              <Label n="06">{PROCESS.label}</Label>
              <h2 className="cr-h2" id="cr-process">
                {PROCESS.heading}
              </h2>
            </header>
            <ol className="cr-steps">
              {PROCESS.steps.map((step, i) => (
                <li key={step.title}>
                  <span className="cr-steps__n" aria-hidden="true">
                    {two(i)}
                  </span>
                  <h3 className="cr-steps__title">{step.title}</h3>
                  <p className="cr-steps__body">{step.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 07 — Application */}
        <section className="cr-apply" id="apply" aria-labelledby="cr-apply-h">
          <div className="cr-wrap cr-split">
            <header className="cr-apply__head">
              <Label n="07">{APPLY.label}</Label>
              <h2 className="cr-h2" id="cr-apply-h">
                {APPLY.heading}
              </h2>
              {open && <p className="cr-apply__intro">{APPLY.intro}</p>}
            </header>
            {open ? (
              <ApplicationForm countries={countryOptions()} />
            ) : (
              <div className="cr-receipt">
                <span className="cr-receipt__node" aria-hidden="true" />
                <h3 className="cr-receipt__title">{CLOSED.title}</h3>
                <p className="cr-receipt__body">{CLOSED.body}</p>
              </div>
            )}
          </div>
        </section>

        {/* 08 — Questions */}
        <section className="cr-section cr-section--last" aria-labelledby="cr-faq">
          <div className="cr-wrap cr-split">
            <header>
              <Label n="08">{FAQ.label}</Label>
              <h2 className="cr-h2" id="cr-faq">
                {FAQ.heading}
              </h2>
            </header>
            <div>
              <div className="cr-faqs">
                {FAQ.items.map((item) => (
                  <details className="cr-faq" key={item.q}>
                    <summary>{item.q}</summary>
                    <p>{item.a}</p>
                  </details>
                ))}
              </div>
              <p className="cr-body cr-body--note">
                Another question? Email <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. How we handle
                what you send us is in the <a href={PRIVACY_PATH}>applicant data notice</a>.
              </p>
              <div className="cr-section__action">
                <Apply open={open} />
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
      {open && (
        <StickyApply
          label="Apply now"
          pay={`${PAY.base} + ${BONUS.show.amount} per show`}
          terms={`+ ${BONUS.close.amount} per close · 1+ yr required`}
        />
      )}
    </>
  );
}
