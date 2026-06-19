/**
 * Sonder Gravity System v2 — design tokens (TypeScript mirror of globals.css).
 *
 * Use these inside R3F materials, GSAP timelines, and any TS context where CSS
 * variables aren't available. Keep these in lockstep with /app/globals.css.
 */

export const palette = {
  ivory: "#F4F0E7",
  paper: "#EEE8DC",
  warmPaper: "#E8DFD1",
  ink: "#111111",
  mutedInk: "#4B4944",
  softInk: "rgba(17, 17, 17, 0.68)",
  gold: "#9A7A3D",
  softGold: "#C1A56B",
  deepGold: "#6F5528",
  hairline: "rgba(17, 17, 17, 0.16)",
  hairlineStrong: "rgba(17, 17, 17, 0.28)",
  hairlineGold: "rgba(154, 122, 61, 0.34)",
  charcoal: "#10100E",
  charcoalSoft: "#171612",
  ivoryOnDark: "#F1E9DC",
} as const;

export const motionTiming = {
  // Headline mask reveal — line-by-line, 80ms stagger, ~900ms ease-out.
  maskReveal: { duration: 0.9, stagger: 0.08, ease: "expo.out" as const },
  // Orbital line-draw across SVG strokes.
  lineDraw: { duration: 1.2, ease: "power2.out" as const },
  // Gold node pulse — kept very gentle.
  pulse: { duration: 2.5, ease: "sine.inOut" as const, yoyo: true, repeat: -1 },
  // Service row stagger reveals.
  staggerRow: { stagger: 0.08, duration: 0.7, ease: "power3.out" as const },
  // Cursor drift on the R3F gravity core — max rotation amplitude.
  drift: { maxYawDeg: 6, maxPitchDeg: 4, lerp: 0.06 },
  // Armillary slow rotation — almost imperceptible.
  armillary: { rotationSeconds: 110 },
} as const;

/**
 * Site chapters. Non-sequential by design — the missing 04 is editorial signal.
 */
export const chapters = [
  { id: "01", label: "SIGNAL", href: "#signal" },
  { id: "02", label: "SYSTEM", href: "#system" },
  { id: "03", label: "WORLD", href: "#world" },
  { id: "05", label: "SERVICES", href: "#services" },
  { id: "06", label: "CONNECT", href: "#connect" },
] as const;

export type Chapter = (typeof chapters)[number];

export const navLinks = [
  { label: "SYSTEMS", href: "#system" },
  { label: "WORK WITH US", href: "#connect" },
] as const;

/**
 * SystemHero (02) path index — the five fanned entries that radiate around
 * the sun dot. Coordinates are diegetic; they suggest a coordinate system
 * without indexing anything real.
 */
export const systemPaths = [
  { id: "01", coord: "34.052", label: "Positioning" },
  { id: "02", coord: "118.243", label: "Narrative" },
  { id: "03", coord: "118.243", label: "Motion" },
  { id: "04", coord: "118.053", label: "Interface" },
  { id: "05", coord: "118.243", label: "Motion" },
] as const;

export type SystemPath = (typeof systemPaths)[number];
