"use client";

import { useState, type CSSProperties } from "react";
import Magnetic from "@/components/Magnetic";
import ScrambleText from "@/components/ScrambleText";
import LiveCoord from "@/components/LiveCoord";

/**
 * sections/ConnectHero.tsx
 *
 * Reference: /_refs/IMG_4948.png
 * Chapter:   06 — CONNECT (id="connect")
 *
 * Functional intake. The four bracketed rows are controlled inputs (3× text,
 * 1× select) submitted to POST /api/contact, which relays the lead via Resend.
 * The editorial visual is preserved exactly — bracketed [ ENTRY_0n ] labels,
 * hairline-on-dark inputs, mono type, no boxes. Focus brightens the hairline,
 * reveals a gold node beside the active field, and nudges the label. The submit
 * reads as a technical command (INITIATE GRAVITY BUILD) and cycles through
 * idle → sending → success/error. On success the form collapses to a single
 * ledger confirmation line.
 *
 *   Phase 4 — top metadata band (brand, coordinates, chapter stamp)
 *   Phase 5 — bottom footer rule (codename + tagline)
 *   Phase 6 — ghost machinery PNG behind the type (CSS mask, z=1)
 */

type FormRow = {
  id: string;
  label: string;
  name: string;
  inputType: "text" | "tel" | "email" | "select";
  autoComplete?: string;
  options?: string[];
  inputColor?: string;
  labelColor?: string;
};

const formRows: ReadonlyArray<FormRow> = [
  { id: "01", label: "FULL NAME",     name: "fullName",    inputType: "text",   autoComplete: "name", inputColor: "var(--soft-gold)", labelColor: "var(--soft-gold)" },
  { id: "02", label: "COMPANY",       name: "company",     inputType: "text",   autoComplete: "organization" },
  {
    id: "03", label: "PROJECT TYPE",  name: "projectType", inputType: "select",
    options: [
      "Website Design",
      "Brand Strategy",
      "Digital Experience",
      "Campaign",
      "AI Systems",
      "Conversion Architecture",
      "Other",
    ],
  },
  { id: "04", label: "PHONE & EMAIL", name: "contact",     inputType: "text",   autoComplete: "email" },
];

type FormValues = Record<string, string>;

const initialValues: FormValues = { fullName: "", company: "", projectType: "", contact: "", orbit: "" };

/* Shared mono base — row labels and input text. */
const monoBase: CSSProperties = {
  fontFamily: "var(--font-mono), 'IBM Plex Mono', Menlo, monospace",
  fontSize: 11,
  fontWeight: 400,
  letterSpacing: "0.24em",
  textTransform: "uppercase",
};

/* Bracketed label above each input. */
const formLabelStyle: CSSProperties = {
  ...monoBase,
  color: "var(--ivory-on-dark)",
  opacity: 0.88,
  whiteSpace: "nowrap",
  display: "block",
  marginBottom: 6,
};

/* Shared base for <input> and <select>. The hairline comes from
   borderBottom only — no box or background. */
const inputBase: CSSProperties = {
  ...monoBase,
  width: "100%",
  background: "transparent",
  border: "none",
  borderBottom: "1px solid var(--hairline-on-dark-strong)",
  outline: "none",
  color: "var(--ivory-on-dark)",
  opacity: 1,
  padding: "4px 0 6px",
  appearance: "none",
  WebkitAppearance: "none",
  transition: "border-color 320ms ease",
  /* cursor: none is set globally in globals.css — do not override */
};

type Status = "idle" | "sending" | "success" | "error";

export default function ConnectHero() {
  const [values, setValues] = useState<FormValues>(initialValues);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeField, setActiveField] = useState<string | null>(null);

  const update = (name: string, value: string) =>
    setValues((prev) => ({ ...prev, [name]: value }));

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) {
        setStatus("success");
        return;
      }
      setErrorMsg(data.error || "We couldn't transmit that. Please try again.");
      setStatus("error");
    } catch {
      setErrorMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  return (
    <section
      id="connect"
      aria-label="Connect"
      data-nav-dark
      className="connect-section relative w-full overflow-hidden"
      style={{
        background: "var(--charcoal)",
        color: "var(--ivory-on-dark)",
        minHeight: "100svh",
        height: "100svh",
        paddingLeft: "var(--gutter)",
        paddingRight: "var(--gutter)",
        /* Top clearance for the persistent fixed nav (ivory over this chapter). */
        paddingTop: "clamp(56px, 7vh, 84px)",
        paddingBottom: "clamp(28px, 3.5vh, 52px)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Slim chapter strip — left-anchored (the brand lockup + MENU live in the
          persistent nav above, so this carries only chapter + coordinate and
          stays clear of the nav). */}
      <div
        data-zone="connect-header"
        style={{
          position: "relative",
          width: "100%",
          minHeight: "clamp(28px, 4vh, 44px)",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 14,
          zIndex: 5,
        }}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            fontFamily: "var(--font-mono), 'IBM Plex Mono', Menlo, monospace",
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: "var(--ivory-on-dark)",
            opacity: 0.68,
          }}
        >
          06&#8201;&mdash;&#8201;CONNECT
          <span
            aria-hidden
            className="live-dot"
            style={{
              display: "inline-block",
              width: 5,
              height: 5,
              borderRadius: "50%",
              background: "var(--soft-gold)",
              flexShrink: 0,
            }}
          />
        </span>
        <span
          className="connect-coord"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontFamily: "var(--font-mono), 'IBM Plex Mono', Menlo, monospace",
            fontSize: 11,
            fontWeight: 400,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--ivory-on-dark)",
            opacity: 0.6,
          }}
        >
          <svg aria-hidden width={10} height={10} viewBox="0 0 10 10">
            <line x1="5" y1="0" x2="5" y2="10" stroke="currentColor" strokeWidth="0.7" />
            <line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="0.7" />
          </svg>
          <LiveCoord base="34.052° N, 118.245° W" />
        </span>
      </div>

      {/* Main body zone — Phase 2 (headline), Phase 7 (form), Phase 6 (orbit ghost). */}
      <div
        data-zone="connect-body"
        className="connect-body"
        style={{
          position: "relative",
          width: "100%",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Phase 6 ghost machinery. CSS mask: PNG stencils an ivory-on-dark
            filled box. maskMode: luminance makes bright wireframe pixels
            opaque, black background transparent. zIndex 1. */}
        <div
          aria-hidden
          className="connect-ghost"
          style={{
            position: "absolute",
            top: "55%",
            left: "50%",
            width: "min(92vw, 1500px)",
            aspectRatio: "1672 / 941",
            transform: "translate(-50%, -50%)",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 1,
            opacity: 0.32,
            filter: "blur(0.4px)",
            backgroundColor: "var(--ivory-on-dark)",
            maskImage: "url('/assets/connect/gyroscope.png')",
            WebkitMaskImage: "url('/assets/connect/gyroscope.png')",
            maskMode: "luminance",
            maskRepeat: "no-repeat",
            WebkitMaskRepeat: "no-repeat",
            maskPosition: "center",
            WebkitMaskPosition: "center",
            maskSize: "contain",
            WebkitMaskSize: "contain",
          }}
        />

        {/* Phase 2 headline — vertically centered compact block, z=2. */}
        <h1
          aria-label="Let's create something that pulls."
          className="connect-headline"
          style={{
            position: "absolute",
            top: "calc(50% + 3vh)",
            left: 0,
            right: 0,
            transform: "translateY(-50%)",
            margin: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            fontFamily: "var(--font-serif), 'Times New Roman', serif",
            fontWeight: 500,
            fontSize: "clamp(112px, 15.5vw, 250px)",
            lineHeight: 0.86,
            letterSpacing: "-0.018em",
            textTransform: "uppercase",
            color: "transparent",
            fontFeatureSettings: '"liga", "kern"',
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 2,
          }}
        >
          <span aria-hidden style={{ display: "block", whiteSpace: "nowrap", color: "var(--ivory-on-dark)", opacity: 0.93 }}>
            LET&rsquo;S CREATE
          </span>
          <span aria-hidden style={{ display: "block", whiteSpace: "nowrap", fontStyle: "italic", color: "var(--soft-gold)", opacity: 0.52 }}>
            SOMETHING
          </span>
          <span aria-hidden style={{ display: "block", whiteSpace: "nowrap" }}>
            <span style={{ color: "var(--soft-gold)", opacity: 0.52 }}>THAT </span>
            <span style={{ color: "var(--ivory-on-dark)", opacity: 0.72 }}>PULLS.</span>
          </span>
        </h1>

        {/* Form readability scrim — two-element structure to work around
            the Chrome/Safari bug where backdrop-filter and mask-image on
            the SAME element cancel each other out. */}
        <div
          aria-hidden
          className="connect-scrim"
          style={{
            position: "absolute",
            top: "calc(50% + 3vh)",
            left: "calc(clamp(48px, 6vw, 96px) - 52px)",
            transform: "translateY(-50%)",
            width: "calc(clamp(560px, 54vw, 820px) + 104px)",
            height: "clamp(300px, 52vh, 480px)",
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 3,
            maskImage: "radial-gradient(ellipse at 38% 50%, black 25%, transparent 72%)",
            WebkitMaskImage: "radial-gradient(ellipse at 38% 50%, black 25%, transparent 72%)",
          }}
        >
          {/* Inner — backdrop blur + dark scrim. No mask here. */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(6px)",
              WebkitBackdropFilter: "blur(6px)",
              background: "radial-gradient(ellipse at 38% 50%, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.22) 50%, rgba(0,0,0,0) 100%)",
            }}
          />
        </div>

        {/* Phase 7 interactive form — four rows + technical submit.
            z=4 sits above the headline (z=2) and machinery (z=1). */}
        {status === "success" ? (
          <div
            role="status"
            className="connect-form"
            style={{
              position: "absolute",
              top: "calc(50% + 3vh)",
              left: "clamp(48px, 6vw, 96px)",
              transform: "translateY(-50%)",
              width: "clamp(560px, 54vw, 820px)",
              zIndex: 4,
              display: "flex",
              flexDirection: "column",
              gap: 18,
            }}
          >
            <span style={{ ...monoBase, color: "var(--soft-gold)", fontSize: 12 }}>
              ◆ SIGNAL RECEIVED
            </span>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--font-serif), 'Times New Roman', serif",
                fontSize: "clamp(28px, 3.4vw, 48px)",
                lineHeight: 1.08,
                color: "var(--ivory-on-dark)",
                letterSpacing: "-0.01em",
              }}
            >
              Thank you, {values.fullName.split(" ")[0] || "friend"}.
              <br />
              We&rsquo;ll reply within 48 hours.
            </p>
            <span style={{ ...monoBase, color: "var(--ivory-on-dark)", opacity: 0.6, fontSize: 10 }}>
              TRANSMISSION COMPLETE — 06 / CONNECT
            </span>
          </div>
        ) : (
          <form
            data-zone="connect-form"
            className="connect-form"
            onSubmit={handleSubmit}
            noValidate
            style={{
              position: "absolute",
              top: "calc(50% + 3vh)",
              left: "clamp(48px, 6vw, 96px)",
              transform: "translateY(-50%)",
              width: "clamp(560px, 54vw, 820px)",
              display: "flex",
              flexDirection: "column",
              gap: "clamp(20px, 2.6vh, 34px)",
              zIndex: 4,
            }}
          >
            {/* Honeypot — visually hidden, off to bots only. */}
            <input
              type="text"
              name="orbit"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden
              value={values.orbit}
              onChange={(e) => update("orbit", e.target.value)}
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />

            {formRows.map((row) => {
              const isActive = activeField === row.name;
              return (
                <label
                  key={row.id}
                  htmlFor={`connect-${row.name}`}
                  style={{ display: "block", cursor: "none" }}
                >
                  {/* Bracketed mono label + active gold node */}
                  <span
                    style={{
                      ...(row.labelColor ? { ...formLabelStyle, color: row.labelColor } : formLabelStyle),
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transform: isActive ? "translateX(6px)" : "translateX(0)",
                      transition: "transform 280ms cubic-bezier(0.2,0.6,0.16,1)",
                    }}
                  >
                    <span
                      aria-hidden
                      style={{
                        width: 5,
                        height: 5,
                        borderRadius: "50%",
                        background: "var(--soft-gold)",
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? "scale(1)" : "scale(0.4)",
                        transition: "opacity 280ms ease, transform 280ms ease",
                        flexShrink: 0,
                      }}
                    />
                    [ ENTRY_{row.id}: {row.label} ]
                  </span>

                  {row.inputType === "select" ? (
                    <select
                      id={`connect-${row.name}`}
                      name={row.name}
                      value={values[row.name]}
                      onChange={(e) => update(row.name, e.target.value)}
                      onFocus={() => setActiveField(row.name)}
                      onBlur={() => setActiveField(null)}
                      style={{
                        ...inputBase,
                        color: "var(--soft-gold)",
                        opacity: 0.78,
                        borderBottomColor: isActive ? "rgba(241, 233, 220, 0.82)" : "var(--hairline-on-dark-strong)",
                      }}
                    >
                      <option value="" disabled style={{ background: "var(--charcoal)" }}>
                        SELECT
                      </option>
                      {row.options?.map((opt) => (
                        <option key={opt} value={opt} style={{ background: "var(--charcoal)" }}>
                          {opt.toUpperCase()}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={`connect-${row.name}`}
                      type={row.inputType}
                      name={row.name}
                      autoComplete={row.autoComplete}
                      value={values[row.name]}
                      onChange={(e) => update(row.name, e.target.value)}
                      onFocus={() => setActiveField(row.name)}
                      onBlur={() => setActiveField(null)}
                      style={{
                        ...(row.inputColor ? { ...inputBase, color: row.inputColor } : inputBase),
                        borderBottomColor: isActive ? "rgba(241, 233, 220, 0.82)" : "var(--hairline-on-dark-strong)",
                      }}
                    />
                  )}
                </label>
              );
            })}

            {/* Error line */}
            {status === "error" && errorMsg && (
              <span role="alert" style={{ ...monoBase, fontSize: 10, letterSpacing: "0.16em", color: "#D98B6B" }}>
                ✕ {errorMsg}
              </span>
            )}

            {/* Submit — technical command */}
            <Magnetic strength={0.3} style={{ alignSelf: "flex-start", marginTop: 6 }}>
              <button
                type="submit"
                disabled={status === "sending"}
                data-cursor-label="TRANSMIT"
                style={{
                  ...monoBase,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 12,
                  background: "transparent",
                  border: "none",
                  borderBottom: "1px solid var(--soft-gold)",
                  color: "var(--soft-gold)",
                  padding: "0 0 8px",
                  fontSize: 12,
                  cursor: "none",
                  opacity: status === "sending" ? 0.6 : 1,
                  transition: "letter-spacing 320ms ease, opacity 240ms ease",
                  letterSpacing: status === "sending" ? "0.34em" : "0.24em",
                }}
              >
                {status === "sending" ? "TRANSMITTING…" : "INITIATE GRAVITY BUILD"}
                <span
                  aria-hidden
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "var(--soft-gold)",
                    flexShrink: 0,
                  }}
                />
              </button>
            </Magnetic>
          </form>
        )}
      </div>

      {/* Phase 5 bottom footer — hairline rule + two-zone metadata. */}
      <div
        data-zone="connect-footer"
        style={{
          position: "relative",
          width: "100%",
          minHeight: "clamp(40px, 6vh, 72px)",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          zIndex: 5,
        }}
      >
        <div
          aria-hidden
          style={{
            width: "100%",
            height: 1,
            background: "var(--hairline-on-dark)",
            marginBottom: 14,
          }}
        />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-mono), 'IBM Plex Mono', Menlo, monospace",
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--ivory-on-dark)",
              opacity: 0.65,
            }}
          >
            <ScrambleText text="06 — SOMNAMBULIST" />
          </span>
          <span
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontFamily: "var(--font-mono), 'IBM Plex Mono', Menlo, monospace",
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "var(--ivory-on-dark)",
              opacity: 0.65,
            }}
          >
            <ScrambleText text="BUILT FOR IMPACT" />
            <svg
              aria-hidden
              width={12}
              height={12}
              viewBox="0 0 16 16"
              style={{ color: "var(--soft-gold)", opacity: 0.82, flexShrink: 0 }}
            >
              <path
                d="M 8 0 L 9.4 6.6 L 16 8 L 9.4 9.4 L 8 16 L 6.6 9.4 L 0 8 L 6.6 6.6 Z"
                fill="currentColor"
              />
            </svg>
          </span>
        </div>
      </div>
    </section>
  );
}
