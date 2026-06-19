import { NextResponse } from "next/server";
import { Resend } from "resend";

/**
 * POST /api/contact — Connect chapter intake.
 *
 * Receives the four-field Connect form, validates server-side, and relays the
 * lead to CONTACT_TO via Resend. Degrades gracefully:
 *   - missing RESEND_API_KEY        → 503 "not configured" (UI shows error)
 *   - honeypot ("orbit") filled     → 200 ok (silently drop the bot)
 *   - validation failure            → 400 with a human message
 *
 * Env:
 *   RESEND_API_KEY   required to actually send
 *   CONTACT_TO       destination inbox (default chase@sonderdigital-co.com)
 *   RESEND_FROM      verified sender (default Resend test sender)
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Payload = {
  fullName?: unknown;
  company?: unknown;
  projectType?: unknown;
  contact?: unknown;
  /** Honeypot — must stay empty. */
  orbit?: unknown;
};

const CONTACT_TO = process.env.CONTACT_TO ?? "chase@sonderdigital-co.com";
const CONTACT_FROM = process.env.RESEND_FROM ?? "Sonder Digital Co. <onboarding@resend.dev>";

const str = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!
  );

// Tiny in-memory rate limit (best-effort; per server instance).
const HITS = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const rec = HITS.get(ip);
  if (!rec || now - rec.ts > WINDOW_MS) {
    HITS.set(ip, { count: 1, ts: now });
    return false;
  }
  rec.count += 1;
  return rec.count > MAX_PER_WINDOW;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again shortly." },
      { status: 429 }
    );
  }

  let body: Payload;
  try {
    body = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — pretend success so bots don't learn anything.
  if (str(body.orbit)) {
    return NextResponse.json({ ok: true });
  }

  const fullName = str(body.fullName);
  const company = str(body.company);
  const projectType = str(body.projectType);
  const contact = str(body.contact);

  if (!fullName) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!contact) {
    return NextResponse.json(
      { ok: false, error: "Please share a phone or email so we can reply." },
      { status: 400 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { ok: false, error: "The intake channel isn't configured yet. Email chase@sonderdigital-co.com directly." },
      { status: 503 }
    );
  }

  const resend = new Resend(apiKey);

  const rows: [string, string][] = [
    ["Name", fullName],
    ["Company", company || "—"],
    ["Project type", projectType || "—"],
    ["Phone / email", contact],
  ];

  const html = `
    <div style="font-family:ui-monospace,Menlo,monospace;color:#111;background:#f4f0e7;padding:32px;">
      <p style="letter-spacing:0.24em;font-size:11px;color:#9a7a3d;margin:0 0 16px;">06 — CONNECT · NEW SIGNAL</p>
      <table style="border-collapse:collapse;font-size:14px;">
        ${rows
          .map(
            ([k, v]) =>
              `<tr><td style="padding:6px 24px 6px 0;color:#4b4944;vertical-align:top;">${k}</td><td style="padding:6px 0;">${escapeHtml(v)}</td></tr>`
          )
          .join("")}
      </table>
    </div>`;

  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  try {
    const looksLikeEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact);
    const { error } = await resend.emails.send({
      from: CONTACT_FROM,
      to: CONTACT_TO,
      replyTo: looksLikeEmail ? contact : undefined,
      subject: `New signal — ${fullName}${company ? ` · ${company}` : ""}`,
      html,
      text,
    });

    if (error) {
      return NextResponse.json(
        { ok: false, error: "We couldn't transmit that. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "We couldn't transmit that. Please try again." },
      { status: 502 }
    );
  }
}
