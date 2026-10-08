/**
 * Careers — appointment setter. Every word on the page lives here.
 *
 * Source: "Sonder Setter Hiring Plan" v1.0 (Oct 2026), section 03, approved
 * draft copy. Edit pay, hours or wording here and nowhere else: the page, the
 * form, the share card and the applicant notice all read from this file.
 *
 * The brief's rule stands: nothing here is invented. No client names, no
 * testimonials, no earnings figures, no promise beyond the agreed base pay.
 */

export const SITE_URL = "https://www.sonderdigitalco.com";
/** The page's public address: sonderdigitalco.com/setterapplication. */
export const ROLE_PATH = "/setterapplication";
export const PRIVACY_PATH = "/careers/privacy";
/** The row in hiring.openings this page belongs to. */
export const OPENING = "appointment-setter";

/* ---------------------------------------------------------------------------
   CONFIRM BEFORE PUBLISH. The contact address and the retention period are
   defaults Chase has not confirmed; the bonus amounts are his.
   --------------------------------------------------------------------------- */

/** Shown in the FAQ, the footer, the applicant notice and every error state. */
export const CONTACT_EMAIL = "chase@sonderdigital-co.com";

/**
 * The bonus plan: two amounts, both on top of base pay. Set by Chase on
 * 8 Oct 2026. Change them here and every mention on the site follows.
 *
 * Still open, and so not stated on the page: when bonuses are paid, and the
 * written definition of a "qualified" appointment. The page says bonuses are
 * paid "under a written plan", so that plan has to exist before a setter starts.
 */
export const BONUS = {
  /** Chase's word for the structure: heavy. */
  name: "Heavy bonus structure",
  show: {
    amount: "$25",
    per: "per qualified show",
    detail: "For each qualified appointment you book that shows up.",
  },
  close: {
    amount: "$75",
    per: "per close",
    detail: "For each of your appointments that becomes a client.",
  },
  terms: "Both are on top of base pay, and paid for verified outcomes under a written plan.",
} as const;

/** How long an application is kept. Stated in the applicant notice. */
export const RETENTION = "six months after the role is filled";

/* ------------------------------------------------------------------- pay */

export const PAY = {
  base: "$5–$6/hour",
  /** Abbreviated so the hero ledger keeps it on one line on a phone. */
  hours: "Approx. 16 hours/week",
  location: "Remote",
  /** The pay line, for metadata and link previews. */
  line: `$5–$6/hour base + ${BONUS.show.amount} ${BONUS.show.per} + ${BONUS.close.amount} ${BONUS.close.per} | Part-time, approximately 16 hours/week | Remote`,
} as const;

/* ----------------------------------------------------------- requirement */

/**
 * The one hard requirement. It is a minimum, not a preference, and it is said
 * four times so nobody can miss it: the hero, Who fits, the FAQ and the form.
 */
export const REQUIREMENT = {
  short: "1+ year",
  of: "calling US businesses",
  sentence: "At least one year of calling US businesses.",
  note: "This is a minimum, not a preference.",
} as const;

/* ------------------------------------------------------------------ hero */

export const HERO = {
  eyebrow: "Open role",
  headline: ["Experienced B2B", "Appointment Setter"],
  sub: "Join Sonder Digital and book qualified conversations with US business owners. We supply the leads, offer, tools, and process. You bring proven phone skills and the drive to perform.",
  ledger: [
    { label: "Base pay", value: PAY.base, note: null, key: false },
    {
      label: "Bonuses",
      value: `${BONUS.show.amount} ${BONUS.show.per}`,
      note: `+ ${BONUS.close.amount} ${BONUS.close.per}, on top of base pay`,
      key: false,
    },
    { label: "Hours", value: PAY.hours, note: `Part-time · ${PAY.location}`, key: false },
    { label: "Required", value: REQUIREMENT.short, note: REQUIREMENT.of, key: true },
  ],
  cta: "Apply for the Setter Role",
  ctaNote: "About 5 minutes. Have your résumé ready as a PDF or Word file.",
} as const;

export const CLOSED = {
  title: "Applications are closed.",
  body: "This role is not taking new applications right now. Thank you for your interest in Sonder Digital.",
} as const;

/* -------------------------------------------------------------- sections */

export const OPPORTUNITY = {
  label: "The opportunity",
  heading: "What you will sell",
  body: "We build follow-up systems for experience-based businesses. Our initial campaign focuses on indoor golf facilities, helping owners turn more first-time visitors into repeat bookings, league sign-ups, and members. Your job is to open real conversations, qualify the opportunity, and book the right owners onto our calendar.",
  doHeading: "What you will do",
  doList: [
    "Call US businesses from provided prospect lists during agreed shifts.",
    "Start natural conversations with owners and managers rather than reading a rigid pitch.",
    "Qualify interest and schedule sales appointments.",
    "Log every outcome and follow-up accurately in the CRM.",
    "Submit end-of-shift activity reports and review coaching feedback.",
  ],
} as const;

export const WHAT_YOU_GET = {
  label: "What you get",
  heading: "Why this role",
  items: [
    "Defined offer",
    "Provided lead lists",
    "Clear qualification criteria",
    "Coaching and call review",
    "Heavy, transparent performance bonuses",
    "Direct communication with the founder",
  ],
  note: "There is an opportunity to take on more responsibility as the team grows. A promotion is not promised.",
} as const;

export const WHO_FITS = {
  label: "Who fits",
  heading: "Who we want",
  requiredLabel: "Required",
  body: "You can speak confidently with decision makers, explain your own results clearly, handle rejection professionally, and follow an organized calling process.",
} as const;

export const COMPENSATION = {
  label: "Compensation",
  heading: "Base pay plus heavy bonuses",
  base: {
    label: "Guaranteed base",
    value: PAY.base,
    note: "Depending on experience and the final agreement.",
  },
  bonus: {
    label: "Variable",
    value: BONUS.name,
    figures: [BONUS.show, BONUS.close],
    note: BONUS.terms,
  },
  disclaimer: "No earnings are guaranteed beyond agreed base pay.",
} as const;

export const PROCESS = {
  label: "Hiring process",
  heading: "How hiring works",
  steps: [
    { title: "Apply", body: "Apply in a few minutes." },
    { title: "Audio audition", body: "Strong matches are invited to submit a short audio audition." },
    { title: "Interview", body: "Selected candidates are invited to a live interview and roleplay." },
    { title: "Paid trial", body: "Finalists complete a paid practical trial." },
  ],
} as const;

export const FAQ = {
  label: "Questions",
  heading: "Before you apply",
  items: [
    { q: "Are the leads provided?", a: "Yes. You call from prospect lists we provide." },
    {
      q: "Is prior US calling experience required?",
      a: "Yes. You need at least one year of calling US businesses. This is a minimum, not a preference.",
    },
    {
      q: "How do the bonuses work?",
      a: `${BONUS.show.amount} for each qualified appointment you book that shows up, and ${BONUS.close.amount} for each one that becomes a client. ${BONUS.terms}`,
    },
    { q: "Is the trial paid?", a: "Yes." },
    { q: "Is this remote?", a: "Yes, subject to agreed hours and work setup." },
    {
      q: "What are the hours?",
      a: "Approximately 16 hours a week, typically four 4-hour shifts, aligned to US business hours.",
    },
    {
      q: "Do I need to send a résumé or a recording to apply?",
      a: "A résumé, yes: you attach it to the application as a PDF or Word file. A recording, no: only candidates whose experience is a strong match are asked for a short audio audition.",
    },
    { q: "Is there training?", a: "Yes. We supply the offer, scripts, coaching, and call review." },
  ],
} as const;

/* ----------------------------------------------------------- application */

export const APPLY = {
  label: "Application",
  heading: "Submit your application",
  intro: "About 5 minutes. You will need your résumé as a PDF or Word file. No recording at this stage.",
  submit: "Submit Your Application",
  submitting: "Submitting…",
  success: {
    title: "Application received.",
    body: "If your experience is a strong match, we will email you the next step, a short audio audition.",
    /** Added to the receipt when the application was stored but the file was not. */
    resumeFailed: `Your answers are saved, but your résumé file did not upload. Please email it to ${CONTACT_EMAIL} so we can read it with your application.`,
  },
} as const;

export const FIELDS = {
  name: { label: "Full name" },
  email: { label: "Email", hint: "We reply to this address." },
  country: { label: "Country", placeholder: "Select your country" },
  time_zone: { label: "Time zone", hint: "For scheduling shifts. Set from your device; change it if it is wrong." },
  experience_band: {
    label: "How long have you been calling US businesses?",
    hint: "This role requires at least 1 year.",
  },
  us_b2b_experience: { label: "Did that include B2B cold calling?" },
  employment_history: {
    label: "Employment history",
    hint: "Your recent jobs, most recent first. For each: company, your role, and the dates. A short list is fine; your résumé carries the detail.",
  },
  resume: {
    label: "Résumé",
    hint: "PDF or Word file, up to 4 MB.",
    choose: "Choose file",
    change: "Choose a different file",
  },
  industries: { label: "Industries you have called", placeholder: "e.g. home services, local business, SaaS" },
  performance_claims: {
    label: "Your recent results",
    hint: "Dials, conversations, booked and attended meetings. If you did not track them, write “not tracked”.",
  },
  tools: {
    label: "Dialers and CRMs you have used",
    hint: "Tools you have used yourself. Write “none” if none.",
  },
  schedule_ack: { label: "I can work approximately 16 hours a week, aligned to US business hours." },
  pay_ack: { label: "I understand the base pay is $5–$6/hour, plus outcome-based bonuses." },
  profile_url: { label: "Profile link", hint: "LinkedIn or portfolio." },
  consent: {
    before: "I agree to Sonder Digital storing this application and contacting me about it, as described in the ",
    link: "applicant data notice",
    after: ".",
  },
} as const;

/** What the form says when the server cannot save. The answers stay on the page. */
export const ERRORS = {
  fix: "Some answers need a fix. Each one is marked.",
  unavailable: `We could not save your application just now. Your answers are still on this page. Try again in a minute, or email ${CONTACT_EMAIL}.`,
  rate_limited: "Too many applications came from this network in a short time. Wait ten minutes and try again.",
  closed: CLOSED.title,
} as const;
