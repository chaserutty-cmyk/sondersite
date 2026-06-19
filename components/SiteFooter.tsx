import type { CSSProperties } from "react";

/**
 * SiteFooter
 *
 * Global editorial footer closing the page after the CONNECT chapter. Carries
 * the same charcoal tone as Connect so the page resolves on one continuous
 * dark field. Mono caps + hairline rhythm consistent with the rest of the
 * system; no cards, no chrome.
 *
 *   Row 1  — oversized SONDER serif sign-off + a short manifesto line
 *   Row 2  — three quiet index columns (navigate / reach / elsewhere)
 *   Row 3  — hairline, then © + codename + back-to-top
 */

const mono: CSSProperties = {
  fontFamily: "var(--font-mono), 'IBM Plex Mono', Menlo, monospace",
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: "0.22em",
  textTransform: "uppercase",
};

const linkStyle: CSSProperties = {
  ...mono,
  color: "var(--ivory-on-dark)",
  opacity: 0.7,
  textDecoration: "none",
  transition: "opacity 240ms ease",
  display: "inline-block",
};

const colLabel: CSSProperties = {
  ...mono,
  fontSize: 10,
  letterSpacing: "0.26em",
  color: "var(--soft-gold)",
  marginBottom: 16,
  display: "block",
};

function Column({ label, links }: { label: string; links: { text: string; href: string }[] }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <span style={colLabel}>{label}</span>
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 12 }}>
        {links.map((l) => (
          <li key={l.text}>
            <a href={l.href} style={linkStyle} className="footer-link">
              {l.text}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SiteFooter() {
  return (
    <footer
      aria-label="Site footer"
      data-nav-dark
      style={{
        background: "var(--charcoal)",
        color: "var(--ivory-on-dark)",
        paddingLeft: "var(--gutter)",
        paddingRight: "var(--gutter)",
        paddingTop: "clamp(64px, 9vh, 120px)",
        paddingBottom: "clamp(28px, 4vh, 48px)",
        borderTop: "1px solid var(--hairline-on-dark)",
      }}
    >
      {/* Thesis ticker — slow editorial marquee. */}
      <div
        className="ticker"
        aria-hidden
        style={{
          marginBottom: "clamp(40px, 6vh, 80px)",
          borderTop: "1px solid var(--hairline-on-dark)",
          borderBottom: "1px solid var(--hairline-on-dark)",
          padding: "16px 0",
        }}
      >
        <div className="ticker__track">
          {[0, 1].map((half) => (
            <div className="ticker__item" key={half}>
              {["GRAVITY", "PULL", "TRUST", "MOMENTUM", "PERCEPTION", "MOTION"].map((w) => (
                <span key={w} style={{ display: "inline-flex", alignItems: "center", gap: "clamp(28px, 4vw, 56px)" }}>
                  <span
                    style={{
                      fontFamily: "var(--font-serif), serif",
                      fontStyle: "italic",
                      fontSize: "clamp(20px, 2.4vw, 34px)",
                      color: "var(--ivory-on-dark)",
                      opacity: 0.5,
                    }}
                  >
                    {w}
                  </span>
                  <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--soft-gold)", opacity: 0.7 }} />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Row 1 — sign-off */}
      <div
        className="footer-signoff"
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          gap: "var(--gutter)",
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-serif), 'Times New Roman', serif",
            fontWeight: 500,
            fontSize: "clamp(44px, 7vw, 104px)",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
            color: "var(--ivory-on-dark)",
          }}
        >
          SONDER
          <span style={{ color: "var(--soft-gold)" }}>.</span>
        </span>
        <p
          style={{
            ...mono,
            maxWidth: "34ch",
            lineHeight: 1.8,
            color: "var(--ivory-on-dark)",
            opacity: 0.62,
            margin: 0,
            letterSpacing: "0.12em",
          }}
        >
          We engineer digital presence systems that build trust, create pull,
          and turn perception into momentum.
        </p>
      </div>

      {/* Row 2 — index columns */}
      <div
        className="footer-columns"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: "var(--gutter)",
          marginTop: "clamp(48px, 7vh, 96px)",
          marginBottom: "clamp(48px, 7vh, 96px)",
        }}
      >
        <Column
          label="NAVIGATE"
          links={[
            { text: "01 — Signal", href: "#signal" },
            { text: "02 — System", href: "#system" },
            { text: "03 — World", href: "#world" },
            { text: "05 — Services", href: "#services" },
            { text: "06 — Connect", href: "#connect" },
          ]}
        />
        <Column
          label="REACH"
          links={[
            { text: "chase@sonderdigital-co.com", href: "mailto:chase@sonderdigital-co.com" },
            { text: "Start a project", href: "#connect" },
          ]}
        />
        <Column
          label="ELSEWHERE"
          links={[
            { text: "Instagram", href: "#" },
            { text: "LinkedIn", href: "#" },
            { text: "Behance", href: "#" },
          ]}
        />
      </div>

      {/* Row 3 — hairline + baseline */}
      <div aria-hidden style={{ width: "100%", height: 1, background: "var(--hairline-on-dark)", marginBottom: 18 }} />
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <span style={{ ...mono, color: "var(--ivory-on-dark)", opacity: 0.55, letterSpacing: "0.2em" }}>
          &copy; 2026 SONDER DIGITAL CO. — ALL RIGHTS RESERVED
        </span>
        <a href="#signal" style={{ ...linkStyle, display: "inline-flex", alignItems: "center", gap: 10 }} className="footer-link">
          BACK TO TOP
          <svg aria-hidden width={12} height={12} viewBox="0 0 12 12" style={{ color: "var(--soft-gold)" }}>
            <path d="M6 1 L6 11 M2.5 4.5 L6 1 L9.5 4.5" stroke="currentColor" strokeWidth="1" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </footer>
  );
}
