import { DISCIPLINES, FOOTER } from "@/lib/copy";
import { NAV, CONTACT_EMAIL, COMPANY } from "@/lib/site";
import { Logo, ArrowUpRight } from "@/components/ui";

/**
 * Footer on the canvas, SynthCoder-style: brand and disciplines, the anchors and the
 * email, a giant faded wordmark, then the legal row.
 */
/** The other pages on this domain. Internal links help each of them rank. */
const MORE = [
  { label: "HOTMA policy updates for housing authorities", href: "/housing-policy" },
  { label: "HOTMA policy updates for HUD multifamily owners", href: "/multifamily-policy" },
  { label: "AI receptionist for plumbers", href: "/voice" },
  { label: "AI receptionist for garage door companies", href: "/garage-doors" },
  { label: "Sonder Concierge for wedding venues", href: "/weddingdesk" },
] as const;

export default function Footer() {
  return (
    <footer className="foot" aria-label="Site footer">
      <div className="foot__top">
        <div className="foot__brand">
          <Logo />
        </div>
        <ul className="foot__list" aria-label="What we do">
          {DISCIPLINES.map((d) => (
            <li key={d}>
              <span>{d}</span>
            </li>
          ))}
        </ul>
        <ul className="foot__list" aria-label="Also by Sonder">
          {MORE.map((m) => (
            <li key={m.href}>
              <a href={m.href}>{m.label}</a>
            </li>
          ))}
        </ul>
        <ul className="foot__list" aria-label="On this page">
          {NAV.map((n) => (
            <li key={n.href}>
              <a href={n.href}>{n.label}</a>
            </li>
          ))}
          <li>
            <a href={`mailto:${CONTACT_EMAIL}`}>
              {CONTACT_EMAIL} <ArrowUpRight className="inline-arrow" />
            </a>
          </li>
        </ul>
      </div>
      <div className="foot__word" aria-hidden="true">
        sonder.
      </div>
      <div className="foot__bottom mono">
        <span>
          © {new Date().getFullYear()} {COMPANY.name}
        </span>
        <a href="#top">{FOOTER.backToTop} ↑</a>
      </div>
    </footer>
  );
}
