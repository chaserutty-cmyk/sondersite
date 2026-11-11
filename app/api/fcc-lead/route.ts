import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * POST /api/fcc-lead — the two forms on /fcc-filing (free filing check, quote request).
 *
 * Takes JSON: { kind: "check" | "quote", company, site?, name, email, filings?: string[], notes?, company_website? }
 * and emails the lead to CONTACT_TO through Resend, with the submitter as reply-to.
 *
 *   - honeypot ("company_website") filled → 200 ok (drop the bot, teach it nothing)
 *   - missing or malformed fields        → 400 with a message per field
 *   - no key, or Resend refused          → 502; the page falls back to a mail-app draft
 *
 * Env:
 *   RESEND_API_KEY (or the older `resendapi`)   send-only key is enough
 *   CONTACT_TO     where leads go      default chase@sonderdigital-co.com
 *   RESEND_FROM    verified sender     default Resend's test sender, which only delivers
 *                                      to the Resend account's own address (that is CONTACT_TO today)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = 16_000;
const KINDS = { check: "Free filing check request", quote: "Quote request: FCC filing preparation" } as const;
type Kind = keyof typeof KINDS;

const str = (v: unknown, max = 300) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    const raw = await request.text();
    if (raw.length > MAX_BYTES) throw new Error("too large");
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  if (str(body.company_website)) return NextResponse.json({ ok: true });

  const kind = (typeof body.kind === "string" && body.kind in KINDS ? body.kind : "check") as Kind;
  const company = str(body.company);
  const name = str(body.name);
  const email = str(body.email);
  const site = str(body.site);
  const notes = str(body.notes, 4000);
  const filings = Array.isArray(body.filings) ? body.filings.map((f) => str(f, 120)).filter(Boolean).slice(0, 8) : [];

  const fieldErrors: Record<string, string> = {};
  if (!company) fieldErrors.company = "Enter your company name.";
  if (!name) fieldErrors.name = "Enter your name.";
  if (!EMAIL.test(email)) fieldErrors.email = "Enter a work email we can reply to.";
  if (Object.keys(fieldErrors).length) {
    return NextResponse.json({ ok: false, error: "Check the highlighted fields.", fieldErrors }, { status: 400 });
  }

  const key = process.env.RESEND_API_KEY || process.env.resendapi;
  const to = process.env.CONTACT_TO || "chase@sonderdigital-co.com";
  const from = process.env.RESEND_FROM || "Sonder Digital Co. <onboarding@resend.dev>";
  if (!key) {
    console.error("fcc-lead: RESEND_API_KEY is not set; the lead was not sent");
    return NextResponse.json({ ok: false, code: "unavailable" }, { status: 502 });
  }

  const lines = [
    `${KINDS[kind]}`,
    "",
    `Company: ${company}`,
    site ? `Website: ${site}` : "",
    `Name: ${name}`,
    `Email: ${email}`,
    kind === "quote" ? "" : "",
    kind === "quote" ? `Filings:\n${filings.length ? filings.map((f) => `  - ${f}`).join("\n") : "  - (not specified)"}` : "",
    notes ? `\nNotes:\n${notes}` : "",
    "",
    `Source: www.sonderdigitalco.com/fcc-filing · ${new Date().toISOString()}`,
  ].filter((l) => l !== "");

  try {
    const { error } = await new Resend(key).emails.send({
      from,
      to,
      replyTo: email,
      subject: `[FCC lander] ${KINDS[kind]} · ${company}`,
      text: lines.join("\n"),
    });
    if (error) throw new Error(error.message);
  } catch (e) {
    console.error("fcc-lead: Resend refused", (e as Error).message);
    return NextResponse.json({ ok: false, code: "unavailable" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
