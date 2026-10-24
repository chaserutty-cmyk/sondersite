/**
 * Site configuration that is not prose.
 *
 * BOOKING_URL is the "Strategy Call — Sonder Digital Co." event on the Calendly account
 * Sonder already uses (calendly.com/chase-sonderdigital-co). Every "Book a Discovery
 * Call" on the page points here.
 */
export const SITE_ORIGIN = (
  process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "https://www.sonderdigitalco.com"
).replace(/\/$/, "");

export const BOOKING_URL = "https://calendly.com/chase-sonderdigital-co/30min";

export const CONTACT_EMAIL = "chase@sonderdigital-co.com";

export const COMPANY = {
  name: "Sonder Digital Co.",
  location: "Atlanta, Georgia",
} as const;

/** Anchored navigation, labelled as in the approved copy. */
export const NAV = [
  { label: "Solutions", href: "#solutions" },
  { label: "In practice", href: "#work" },
  { label: "Our approach", href: "#approach" },
] as const;
