import type { CSSProperties, ReactNode } from "react";
import { BOOKING_URL } from "@/lib/site";
import { CTA } from "@/lib/copy";

/* Shared glyphs. */
export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 14 14" width="14" height="14" aria-hidden="true">
      <path d="M3 11 11 3M5 3h6v6" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
export function ArrowDown({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M8 2v12M3 9l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}
export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
      <path d="M1 6h9M7 2.5 10.5 6 7 9.5" fill="none" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  );
}

/** The primary action. Same destination everywhere: the Calendly event in lib/site. */
export function BookButton({ tone = "ink", placement }: { tone?: "ink" | "light"; placement: string }) {
  return (
    <a
      href={BOOKING_URL}
      target="_blank"
      rel="noopener"
      className={`btn ${tone === "light" ? "btn--light" : ""}`}
      data-placement={placement}
    >
      <span className="btn__label">
        {CTA}
        <span className="btn__cursor" aria-hidden="true" />
      </span>
      <ArrowUpRight className="btn__arrow" />
    </a>
  );
}

export function BookPill({ className = "", placement }: { className?: string; placement: string }) {
  return (
    <a href={BOOKING_URL} target="_blank" rel="noopener" className={`pill-btn ${className}`} data-placement={placement}>
      <span>{CTA}</span>
      <ArrowUpRight />
    </a>
  );
}

/** SynthCoder-style bracketed section marker: (SD — 02) / LABEL. */
export function Eyebrow({ n, label, className = "" }: { n?: string; label: string; className?: string }) {
  return (
    <div className={`eyebrow ${className}`}>
      <span className="eyebrow__glyph" aria-hidden="true">
        <i />
        <b />
      </span>
      <span className="eyebrow__text mono">
        <span>{n ? `(SD — ${n})` : "Sonder /"}</span>
        <span>{label}</span>
      </span>
    </div>
  );
}

/**
 * Words that rise into place when their block scrolls in. Server-rendered and fully
 * readable without JavaScript; Motion.tsx adds .is-in.
 */
export function Rise({
  as: Tag = "span",
  className = "",
  children,
  accent,
  start = 0,
  id,
}: {
  as?: "h1" | "h2" | "h3" | "span" | "p";
  className?: string;
  children: string;
  accent?: string;
  start?: number;
  id?: string;
}) {
  const words = children.split(" ");
  const accentWords = accent ? accent.split(" ") : [];
  let i = start;
  return (
    <Tag id={id} className={`rise ${className}`} data-rise>
      {words.map((w, k) => (
        <span key={`w${k}`}>
          <span className="w" style={{ "--i": i++ } as CSSProperties}>
            <span>{w}</span>
          </span>{" "}
        </span>
      ))}
      {accentWords.length ? (
        <span className="accent accent--words">
          {accentWords.map((w, k) => (
            <span key={`a${k}`}>
              <span className="w" style={{ "--i": i++ } as CSSProperties}>
                <span>{w}</span>
              </span>
              {k < accentWords.length - 1 ? " " : ""}
            </span>
          ))}
        </span>
      ) : null}
    </Tag>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      <span className="logo__word">
        sonder<span className="logo__dot">.</span>
      </span>
      <span className="logo__co">Digital Co.</span>
    </span>
  );
}

/** Typed "Output:" line under each capability. */
export function Output({ text }: { text: string }) {
  return (
    <div className="output" data-reveal>
      <span className="output__key" aria-hidden="true">
        <ArrowRight />
      </span>
      <span className="output__text">
        <span className="output__type" style={{ "--n": text.length } as CSSProperties}>
          {text}
        </span>
        <span className="output__cursor" aria-hidden="true" />
      </span>
      <span className="output__ticks" aria-hidden="true" />
    </div>
  );
}

export function Pill({ children }: { children: ReactNode }) {
  return <span className="tag">{children}</span>;
}
