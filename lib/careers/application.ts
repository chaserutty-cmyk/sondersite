/**
 * The setter application: its fields, its choices and its rules.
 *
 * One definition, used twice. The form runs validateApplication() before it
 * posts, so a candidate sees what to fix without a round trip, and
 * /api/careers/apply runs the same function again, because a browser check is
 * a courtesy and not a guard. The database repeats the rules a third time
 * (public.hiring_api in sonder-crm); keep the three in step.
 *
 * The résumé is a file, so it is checked beside the answers, not among them:
 * checkResumeFile() for what both sides can see (name, size), and
 * looksLikeResume() for the first bytes, which only the server reads.
 *
 * No dependencies and no browser or Node APIs beyond Intl, so it runs in both.
 */

export const EXPERIENCE_BANDS = [
  { value: "lt1", label: "Less than 1 year" },
  { value: "1-2", label: "1–2 years" },
  { value: "3-4", label: "3–4 years" },
  { value: "5plus", label: "5+ years" },
] as const;

export const US_B2B_CHOICES = [
  { value: "regularly", label: "Yes, regularly" },
  { value: "sometimes", label: "Sometimes" },
  { value: "no", label: "No" },
] as const;

/** ISO 3166-1 alpha-2. Asked for shift coordination, never used to score. */
const COUNTRY_CODES =
  "AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH CI CK CL CM CN CO CR CU CV CW CX CY CZ DE DJ DK DM DO DZ EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU ID IE IL IM IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ VA VC VE VG VI VN VU WF WS YE YT ZA ZM ZW".split(
    " "
  );
const COUNTRY_SET = new Set(COUNTRY_CODES);

/** Countries by English name, for the select. Rendered on the server. */
export function countryOptions(): { value: string; label: string }[] {
  const names = new Intl.DisplayNames(["en"], { type: "region" });
  return COUNTRY_CODES.map((value) => ({ value, label: names.of(value) ?? value })).sort((a, b) =>
    a.label.localeCompare(b.label, "en")
  );
}

export type Application = {
  name: string;
  email: string;
  country: string;
  time_zone: string;
  experience_band: (typeof EXPERIENCE_BANDS)[number]["value"];
  us_b2b_experience: (typeof US_B2B_CHOICES)[number]["value"];
  employment_history: string;
  industries: string;
  performance_claims: string;
  tools: string;
  schedule_ack: true;
  pay_ack: true;
  profile_url: string;
  consent: true;
};

/** Every input on the form: the typed answers plus the résumé file. */
export type FieldName = keyof Application | "resume";
export type FieldErrors = Partial<Record<FieldName, string>>;

/** Top to bottom, as the form shows them. The first one with an error gets focus. */
export const FIELD_ORDER: readonly FieldName[] = [
  "name",
  "email",
  "country",
  "time_zone",
  "experience_band",
  "us_b2b_experience",
  "employment_history",
  "industries",
  "performance_claims",
  "tools",
  "resume",
  "profile_url",
  "schedule_ack",
  "pay_ack",
  "consent",
];

/** Each message says what to do, not what went wrong. */
export const FIELD_MESSAGES: Record<FieldName, string> = {
  name: "Enter your full name (2 to 100 characters).",
  email: "Enter an email address we can reply to, like name@example.com.",
  country: "Select the country you work from.",
  time_zone: "Select your time zone.",
  experience_band: "Choose how long you have been calling US businesses.",
  us_b2b_experience: "Choose whether that included B2B cold calling.",
  employment_history: "List your recent jobs: company, role and dates (up to 3,000 characters).",
  industries: "List the industries you have called (up to 1,000 characters).",
  performance_claims: "Describe your recent results, or write “not tracked” (up to 2,000 characters).",
  tools: "List the dialers and CRMs you have used, or write “none” (up to 300 characters).",
  schedule_ack: "Confirm you can work the hours to apply.",
  pay_ack: "Confirm you understand the pay to apply.",
  resume: "Attach your résumé as a PDF or Word file.",
  profile_url: "Enter a full link starting with https://, or leave this empty.",
  consent: "Agree to the applicant data notice to apply.",
};

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function isTimeZone(tz: string): boolean {
  if (!tz || tz.length > 64 || !/^[A-Za-z0-9_+/-]+$/.test(tz)) return false;
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

function isHttpUrl(s: string): boolean {
  if (s.length > 300 || /\s/.test(s)) return false;
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

export function validateApplication(
  raw: unknown
): { ok: true; value: Application } | { ok: false; errors: FieldErrors } {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const errors: FieldErrors = {};
  const bad = (field: FieldName) => {
    errors[field] = FIELD_MESSAGES[field];
  };

  const name = text(r.name);
  const email = text(r.email).toLowerCase();
  const country = text(r.country).toUpperCase();
  const time_zone = text(r.time_zone);
  const experience_band = text(r.experience_band);
  const us_b2b_experience = text(r.us_b2b_experience);
  const employment_history = text(r.employment_history);
  const industries = text(r.industries);
  const performance_claims = text(r.performance_claims);
  const tools = text(r.tools);
  const profile_url = text(r.profile_url);

  if (name.length < 2 || name.length > 100) bad("name");
  if (email.length > 254 || !EMAIL.test(email)) bad("email");
  if (!COUNTRY_SET.has(country)) bad("country");
  if (!isTimeZone(time_zone)) bad("time_zone");
  if (!EXPERIENCE_BANDS.some((b) => b.value === experience_band)) bad("experience_band");
  if (!US_B2B_CHOICES.some((c) => c.value === us_b2b_experience)) bad("us_b2b_experience");
  if (employment_history.length < 10 || employment_history.length > 3000) bad("employment_history");
  if (industries.length < 2 || industries.length > 1000) bad("industries");
  if (performance_claims.length < 2 || performance_claims.length > 2000) bad("performance_claims");
  if (tools.length < 1 || tools.length > 300) bad("tools");
  if (profile_url && !isHttpUrl(profile_url)) bad("profile_url");
  if (r.schedule_ack !== true) bad("schedule_ack");
  if (r.pay_ack !== true) bad("pay_ack");
  if (r.consent !== true) bad("consent");

  if (Object.keys(errors).length > 0) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name,
      email,
      country,
      time_zone,
      experience_band: experience_band as Application["experience_band"],
      us_b2b_experience: us_b2b_experience as Application["us_b2b_experience"],
      employment_history,
      industries,
      performance_claims,
      tools,
      schedule_ack: true,
      pay_ack: true,
      profile_url,
      consent: true,
    },
  };
}

/* ------------------------------------------------------------------ résumé */

export const RESUME_MAX_BYTES = 4 * 1024 * 1024;
export const RESUME_EXTENSIONS = ["pdf", "doc", "docx"] as const;
/** For the file input, so a phone's picker offers documents first. */
export const RESUME_ACCEPT =
  ".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

/** What is wrong with this file, in words that say what to do; null if nothing is. */
export function checkResumeFile(file: { name: string; size: number } | null | undefined): string | null {
  if (!file || file.size === 0) return FIELD_MESSAGES.resume;
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!(RESUME_EXTENSIONS as readonly string[]).includes(ext)) {
    return "That file type cannot be read. Attach a PDF or Word file (.pdf, .doc or .docx).";
  }
  if (file.size > RESUME_MAX_BYTES) return "That file is over 4 MB. Attach a smaller PDF or Word file.";
  return null;
}

/**
 * Do the first bytes match the extension? A PDF starts "%PDF-", a .docx is a
 * zip ("PK"), an old .doc is an OLE file. Stops a renamed something-else from
 * being stored as a résumé; it does not vouch for what is inside.
 */
export function looksLikeResume(name: string, head: Uint8Array): boolean {
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  const starts = (...bytes: number[]) => bytes.every((b, i) => head[i] === b);
  if (ext === "pdf") return starts(0x25, 0x50, 0x44, 0x46, 0x2d);
  if (ext === "docx") return starts(0x50, 0x4b, 0x03, 0x04);
  if (ext === "doc") return starts(0xd0, 0xcf, 0x11, 0xe0);
  return false;
}

/** Where the candidate came from. Captured on landing, sent with the form. */
export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  landed_at?: string;
};

export function cleanAttribution(raw: unknown): Attribution {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const out: Attribution = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
    const v = text(r[key]).slice(0, 120);
    if (v) out[key] = v;
  }
  const landed = text(r.landed_at);
  if (landed && !Number.isNaN(Date.parse(landed))) out.landed_at = new Date(landed).toISOString();
  return out;
}
