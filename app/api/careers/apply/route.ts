import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import {
  checkResumeFile,
  cleanAttribution,
  FIELD_MESSAGES,
  looksLikeResume,
  validateApplication,
  type FieldErrors,
  type FieldName,
} from "@/lib/careers/application";
import { ERRORS, OPENING } from "@/lib/careers/copy";

/**
 * POST /api/careers/apply — the setter application.
 *
 * Takes the form as multipart: `payload` (JSON: the answers, where the
 * candidate came from, the honeypot) and `resume` (the file).
 *
 * Validates on the server (the form already did, but a browser check is a
 * courtesy), then hands both to the `hiring` function in the CRM's Supabase
 * project. That function stores the application, flags a repeat email, slows
 * a flood, refuses a closed opening, and then puts the résumé in private
 * storage. This route holds one secret that opens that function and nothing
 * else; it never holds a database or storage key.
 *
 * An application is only ever acknowledged after the database has it:
 *   - honeypot ("company_website") filled → 200 ok (drop the bot, teach it nothing)
 *   - validation failure, résumé included → 400 with a message per field
 *   - opening closed                      → 409
 *   - too many from one network           → 429
 *   - not configured, timeout, any 5xx    → 502/503; the form keeps the answers
 *
 * The résumé is stored after the application. If only the file fails, the
 * answer is still 200, with resume: "failed", and the receipt asks the
 * candidate to email it. A lost file must never cost an application.
 *
 * A repeat email gets the same 200 as a first application. Saying "we already
 * have that address" would tell anyone who typed it that this person applied.
 *
 * Env:
 *   HIRING_API_URL      https://<ref>.supabase.co/functions/v1/hiring
 *   HIRING_API_SECRET   the same value as HIRING_SECRET in the CRM's function secrets
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_PAYLOAD_BYTES = 32_000;
// A phone on a slow connection is sending a file of up to 4 MB through here.
const TIMEOUT_MS = 25_000;

const unavailable = (status: 502 | 503) =>
  NextResponse.json({ ok: false, code: "unavailable", error: ERRORS.unavailable }, { status });

const invalid = (fieldErrors: FieldErrors) =>
  NextResponse.json({ ok: false, error: ERRORS.fix, fieldErrors }, { status: 400 });

/** The address is hashed with the secret before it leaves this server. The raw IP is never stored. */
function ipHash(request: Request, secret: string): string | undefined {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "";
  return ip ? createHash("sha256").update(`${secret}:${ip}`).digest("hex") : undefined;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  let resume: File | null = null;
  try {
    const form = await request.formData();
    const raw = form.get("payload");
    if (typeof raw !== "string" || raw.length > MAX_PAYLOAD_BYTES) throw new Error("bad payload");
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("not an object");
    body = parsed as Record<string, unknown>;
    const sent = form.get("resume");
    if (sent instanceof File) resume = sent;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — pretend success so bots don't learn anything.
  if (typeof body.company_website === "string" && body.company_website.trim()) {
    return NextResponse.json({ ok: true });
  }

  // Answers and file are checked together, so one round trip reports everything.
  const checked = validateApplication(body.application);
  const errors: FieldErrors = checked.ok ? {} : { ...checked.errors };
  const resumeProblem = checkResumeFile(resume);
  if (resumeProblem) {
    errors.resume = resumeProblem;
  } else if (!looksLikeResume(resume!.name, new Uint8Array(await resume!.slice(0, 8).arrayBuffer()))) {
    errors.resume = "That file does not open as a PDF or Word document. Export your résumé again and attach it.";
  }
  if (!checked.ok || errors.resume) return invalid(errors);

  const url = process.env.HIRING_API_URL;
  const secret = process.env.HIRING_API_SECRET;
  if (!url || !secret) {
    console.error("careers/apply: HIRING_API_URL or HIRING_API_SECRET is not set; the application was not stored");
    return unavailable(503);
  }

  const forward = new FormData();
  forward.set(
    "payload",
    JSON.stringify({
      opening: OPENING,
      application: checked.value,
      meta: { ...cleanAttribution(body.meta), ip_hash: ipHash(request, secret) },
    })
  );
  forward.set("resume", resume!, resume!.name);

  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "x-hiring-secret": secret },
      body: forward,
      cache: "no-store",
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (e) {
    console.error("careers/apply: the hiring function did not answer", (e as Error).name);
    return unavailable(502);
  }

  if (res.ok) {
    const stored = (await res.json().catch(() => ({}))) as { resume?: string };
    if (stored.resume === "failed") console.error("careers/apply: application stored, résumé upload failed");
    return NextResponse.json({ ok: true, resume: stored.resume === "failed" ? "failed" : "ok" });
  }

  const refusal = (await res.json().catch(() => ({}))) as { error?: string; field?: string };
  if (res.status === 409) {
    return NextResponse.json({ ok: false, code: "closed", error: ERRORS.closed }, { status: 409 });
  }
  if (res.status === 429) {
    return NextResponse.json({ ok: false, code: "rate_limited", error: ERRORS.rate_limited }, { status: 429 });
  }
  if (res.status === 400 && refusal.error === "invalid" && refusal.field && refusal.field in FIELD_MESSAGES) {
    const field = refusal.field as FieldName;
    return invalid({ [field]: FIELD_MESSAGES[field] });
  }
  console.error("careers/apply: the hiring function refused", res.status, refusal.error);
  return unavailable(502);
}
