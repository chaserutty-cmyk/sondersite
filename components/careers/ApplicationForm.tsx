"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import {
  checkResumeFile,
  EXPERIENCE_BANDS,
  FIELD_ORDER,
  RESUME_ACCEPT,
  US_B2B_CHOICES,
  validateApplication,
  type Attribution,
  type FieldErrors,
  type FieldName,
} from "@/lib/careers/application";
import { APPLY, CLOSED, ERRORS, FIELDS, PRIVACY_PATH } from "@/lib/careers/copy";

/**
 * ApplicationForm — stage 1 of the setter hiring flow.
 *
 * One screen: the answers and a résumé file. No account and no recording.
 * Posts to /api/careers/apply as multipart and shows one of: the form, the
 * form with fixes marked, the form with a "could not save" notice (answers
 * kept), or the receipt.
 *
 * Three things it does quietly so an application is never lost:
 *   - the first visit's utm_source / utm_medium / utm_campaign and landing time
 *     are kept for the tab's session and sent with the form;
 *   - answers are saved to the tab's session as they are typed, so a reload,
 *     an accidental back, or a failed send does not empty the form (a browser
 *     cannot save a chosen file, so after a reload the résumé is picked again);
 *   - a second press of Submit while the first is in flight does nothing.
 */

type Values = {
  name: string;
  email: string;
  country: string;
  time_zone: string;
  experience_band: string;
  us_b2b_experience: string;
  employment_history: string;
  industries: string;
  performance_claims: string;
  tools: string;
  profile_url: string;
  schedule_ack: boolean;
  pay_ack: boolean;
  consent: boolean;
};

const EMPTY: Values = {
  name: "",
  email: "",
  country: "",
  time_zone: "",
  experience_band: "",
  us_b2b_experience: "",
  employment_history: "",
  industries: "",
  performance_claims: "",
  tools: "",
  profile_url: "",
  schedule_ack: false,
  pay_ack: false,
  consent: false,
};

const DRAFT_KEY = "sonder.setter.draft";
const LANDING_KEY = "sonder.setter.landing";

/* Session storage can be blocked (private mode, in-app browsers). Nothing
   here may throw: the form has to work without it. */
function load<T>(key: string): T | null {
  try {
    const raw = window.sessionStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}
function save(key: string, value: unknown) {
  try {
    window.sessionStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* no storage: the form still submits, it just cannot survive a reload */
  }
}
function drop(key: string) {
  try {
    window.sessionStorage.removeItem(key);
  } catch {
    /* nothing to clear */
  }
}

/** First touch wins: the link they arrived on is the source, whatever they click after. */
function captureLanding(): Attribution {
  const kept = load<Attribution>(LANDING_KEY);
  if (kept) return kept;
  const q = new URLSearchParams(window.location.search);
  const landing: Attribution = { landed_at: new Date().toISOString() };
  for (const key of ["utm_source", "utm_medium", "utm_campaign"] as const) {
    const v = q.get(key)?.trim();
    if (v) landing[key] = v;
  }
  save(LANDING_KEY, landing);
  return landing;
}

function deviceZone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "";
  } catch {
    return "";
  }
}

/* The zone list comes from the browser, so it only exists after hydration.
   useSyncExternalStore gives the server an empty list and the client the real
   one without a mismatch. */
const NO_ZONES: string[] = [];
let zoneCache: string[] | null = null;
function browserZones(): string[] {
  if (zoneCache) return zoneCache;
  let zones: string[] = [];
  try {
    zones = Intl.supportedValuesOf("timeZone");
  } catch {
    /* older browser: fall through to the device's own zone */
  }
  const mine = deviceZone();
  if (mine && !zones.includes(mine)) zones = [mine, ...zones];
  if (zones.length === 0) zones = ["UTC"];
  zoneCache = zones;
  return zones;
}
const subscribeNever = () => () => {};

function Field({
  name,
  label,
  hint,
  error,
  optional,
  children,
}: {
  name: FieldName;
  label: string;
  hint?: string;
  error?: string;
  optional?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="cr-field">
      <label className="cr-field__label" htmlFor={`cr-${name}`}>
        {label}
        {optional && <span className="cr-field__optional"> (optional)</span>}
      </label>
      {hint && (
        <p className="cr-field__hint" id={`cr-${name}-hint`}>
          {hint}
        </p>
      )}
      {children}
      <FieldError name={name} error={error} />
    </div>
  );
}

function FieldError({ name, error }: { name: FieldName; error?: string }) {
  if (!error) return null;
  return (
    <p className="cr-field__error" id={`cr-${name}-error`}>
      <span aria-hidden="true">!</span>
      {error}
    </p>
  );
}

/** aria-describedby for a control: its hint and, when present, its error. */
const describedBy = (name: FieldName, hint: boolean, error?: string) =>
  [hint ? `cr-${name}-hint` : "", error ? `cr-${name}-error` : ""].filter(Boolean).join(" ") || undefined;

export default function ApplicationForm({ countries }: { countries: { value: string; label: string }[] }) {
  const [values, setValues] = useState<Values>(EMPTY);
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "closed">("idle");
  const [resumeFailed, setResumeFailed] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const zones = useSyncExternalStore(subscribeNever, browserZones, () => NO_ZONES);

  const formRef = useRef<HTMLFormElement | null>(null);
  const receiptRef = useRef<HTMLDivElement | null>(null);
  const restored = useRef(false);

  // After hydration: note where they came from, bring back a saved draft, and
  // pre-select the device's time zone. Reading the tab's storage is the reason
  // this is an effect and not initial state (the server has no storage).
  useEffect(() => {
    captureLanding();
    const draft = load<Partial<Values>>(DRAFT_KEY);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring from sessionStorage after hydration
    setValues((v) => {
      const next = { ...v, ...(draft ?? {}) };
      return next.time_zone ? next : { ...next, time_zone: deviceZone() };
    });
    restored.current = true;
  }, []);

  useEffect(() => {
    if (restored.current && status !== "success") save(DRAFT_KEY, values);
  }, [values, status]);

  useEffect(() => {
    if (status === "success" || status === "closed") receiptRef.current?.focus();
  }, [status]);

  /** Change one answer. If that field was marked, re-check it so the mark clears as soon as it is fixed. */
  function set<K extends keyof Values>(field: K, value: Values[K]) {
    const next = { ...values, [field]: value };
    setValues(next);
    if (errors[field]) recheck(next, field);
  }

  /** Pick a résumé. A wrong file is flagged the moment it is chosen, not at Submit. */
  function chooseResume(file: File | null) {
    setResume(file);
    mark("resume", file ? (checkResumeFile(file) ?? undefined) : undefined);
  }

  function recheck(next: Values, field: keyof Values) {
    const checked = validateApplication(next);
    mark(field, checked.ok ? undefined : checked.errors[field]);
  }

  function mark(field: FieldName, message: string | undefined) {
    setErrors((prev) => {
      if (prev[field] === message) return prev;
      const copy = { ...prev };
      if (message) copy[field] = message;
      else delete copy[field];
      return copy;
    });
  }

  /** On leaving a field: flag a wrong answer now, but never nag about one not yet given. */
  function blur(field: keyof Values) {
    const v = values[field];
    if (typeof v === "string" && v.trim()) recheck(values, field);
  }

  function focusFirst(errs: FieldErrors) {
    const first = FIELD_ORDER.find((f) => errs[f]);
    if (!first) return;
    const el = formRef.current?.querySelector<HTMLElement>(`#cr-${first}, [name="${first}"]`);
    el?.focus();
    el?.scrollIntoView({ block: "center" });
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    const checked = validateApplication(values);
    const resumeProblem = checkResumeFile(resume);
    if (!checked.ok || resumeProblem) {
      const found: FieldErrors = { ...(checked.ok ? {} : checked.errors), ...(resumeProblem ? { resume: resumeProblem } : {}) };
      setErrors(found);
      setNotice(ERRORS.fix);
      focusFirst(found);
      return;
    }

    setStatus("submitting");
    setErrors({});
    setNotice(null);
    const honeypot = new FormData(e.currentTarget).get("company_website");
    const body = new FormData();
    body.set("payload", JSON.stringify({ application: checked.value, meta: captureLanding(), company_website: honeypot }));
    body.set("resume", resume!, resume!.name);

    try {
      // No content-type header: the browser writes the multipart boundary itself.
      const res = await fetch("/api/careers/apply", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        error?: string;
        resume?: string;
        fieldErrors?: FieldErrors;
      };

      if (res.ok && data.ok) {
        drop(DRAFT_KEY);
        setResumeFailed(data.resume === "failed");
        setStatus("success");
        return;
      }
      if (data.code === "closed") {
        setStatus("closed");
        return;
      }
      if (data.fieldErrors && Object.keys(data.fieldErrors).length > 0) {
        setErrors(data.fieldErrors);
        setNotice(data.error ?? ERRORS.fix);
        setStatus("idle");
        focusFirst(data.fieldErrors);
        return;
      }
      setNotice(data.error ?? ERRORS.unavailable);
    } catch {
      setNotice(ERRORS.unavailable);
    }
    setStatus("idle");
  }

  if (status === "success" || status === "closed") {
    const copy = status === "success" ? APPLY.success : CLOSED;
    return (
      <div className="cr-receipt" role="status" tabIndex={-1} ref={receiptRef}>
        <span className="cr-receipt__node" aria-hidden="true" />
        <h3 className="cr-receipt__title">{copy.title}</h3>
        <p className="cr-receipt__body">{copy.body}</p>
        {status === "success" && resumeFailed && (
          <p className="cr-receipt__body cr-receipt__body--flag">{APPLY.success.resumeFailed}</p>
        )}
      </div>
    );
  }

  const sending = status === "submitting";

  return (
    <form ref={formRef} className="cr-form" onSubmit={submit} noValidate aria-busy={sending}>
      {/* Honeypot — off-screen, skipped by keyboards and screen readers. Must stay empty. */}
      <div className="cr-form__trap" aria-hidden="true">
        <label htmlFor="cr-company-website">Company website</label>
        <input id="cr-company-website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <Field name="name" label={FIELDS.name.label} error={errors.name}>
        <input
          id="cr-name"
          name="name"
          className="cr-input"
          type="text"
          autoComplete="name"
          required
          maxLength={100}
          value={values.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => blur("name")}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy("name", false, errors.name)}
        />
      </Field>

      <Field name="email" label={FIELDS.email.label} hint={FIELDS.email.hint} error={errors.email}>
        <input
          id="cr-email"
          name="email"
          className="cr-input"
          type="email"
          inputMode="email"
          autoComplete="email"
          autoCapitalize="none"
          spellCheck={false}
          required
          maxLength={254}
          value={values.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={() => blur("email")}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy("email", true, errors.email)}
        />
      </Field>

      <div className="cr-form__pair">
        <Field name="country" label={FIELDS.country.label} error={errors.country}>
          <select
            id="cr-country"
            name="country"
            className="cr-input cr-select"
            autoComplete="country"
            required
            value={values.country}
            onChange={(e) => set("country", e.target.value)}
            aria-invalid={errors.country ? true : undefined}
            aria-describedby={describedBy("country", false, errors.country)}
          >
            <option value="">{FIELDS.country.placeholder}</option>
            {countries.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>

        <Field name="time_zone" label={FIELDS.time_zone.label} error={errors.time_zone}>
          <select
            id="cr-time_zone"
            name="time_zone"
            className="cr-input cr-select"
            required
            value={values.time_zone}
            onChange={(e) => set("time_zone", e.target.value)}
            aria-invalid={errors.time_zone ? true : undefined}
            aria-describedby={describedBy("time_zone", true, errors.time_zone)}
          >
            <option value="">Select your time zone</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </Field>
        <p className="cr-field__hint cr-form__pair-hint" id="cr-time_zone-hint">
          {FIELDS.time_zone.hint}
        </p>
      </div>

      <Choice
        name="experience_band"
        legend={FIELDS.experience_band.label}
        options={EXPERIENCE_BANDS}
        value={values.experience_band}
        hint={FIELDS.experience_band.hint}
        error={errors.experience_band}
        onChange={(v) => set("experience_band", v)}
        columns
      />

      <Choice
        name="us_b2b_experience"
        legend={FIELDS.us_b2b_experience.label}
        options={US_B2B_CHOICES}
        value={values.us_b2b_experience}
        error={errors.us_b2b_experience}
        onChange={(v) => set("us_b2b_experience", v)}
      />

      <Field
        name="employment_history"
        label={FIELDS.employment_history.label}
        hint={FIELDS.employment_history.hint}
        error={errors.employment_history}
      >
        <textarea
          id="cr-employment_history"
          name="employment_history"
          className="cr-input cr-textarea"
          rows={5}
          required
          maxLength={3000}
          value={values.employment_history}
          onChange={(e) => set("employment_history", e.target.value)}
          onBlur={() => blur("employment_history")}
          aria-invalid={errors.employment_history ? true : undefined}
          aria-describedby={describedBy("employment_history", true, errors.employment_history)}
        />
      </Field>

      <Field name="industries" label={FIELDS.industries.label} error={errors.industries}>
        <textarea
          id="cr-industries"
          name="industries"
          className="cr-input cr-textarea"
          rows={2}
          required
          maxLength={1000}
          placeholder={FIELDS.industries.placeholder}
          value={values.industries}
          onChange={(e) => set("industries", e.target.value)}
          onBlur={() => blur("industries")}
          aria-invalid={errors.industries ? true : undefined}
          aria-describedby={describedBy("industries", false, errors.industries)}
        />
      </Field>

      <Field
        name="performance_claims"
        label={FIELDS.performance_claims.label}
        hint={FIELDS.performance_claims.hint}
        error={errors.performance_claims}
      >
        <textarea
          id="cr-performance_claims"
          name="performance_claims"
          className="cr-input cr-textarea"
          rows={4}
          required
          maxLength={2000}
          value={values.performance_claims}
          onChange={(e) => set("performance_claims", e.target.value)}
          onBlur={() => blur("performance_claims")}
          aria-invalid={errors.performance_claims ? true : undefined}
          aria-describedby={describedBy("performance_claims", true, errors.performance_claims)}
        />
      </Field>

      <Field name="tools" label={FIELDS.tools.label} hint={FIELDS.tools.hint} error={errors.tools}>
        <input
          id="cr-tools"
          name="tools"
          className="cr-input"
          type="text"
          required
          maxLength={300}
          value={values.tools}
          onChange={(e) => set("tools", e.target.value)}
          onBlur={() => blur("tools")}
          aria-invalid={errors.tools ? true : undefined}
          aria-describedby={describedBy("tools", true, errors.tools)}
        />
      </Field>

      <Field name="resume" label={FIELDS.resume.label} hint={FIELDS.resume.hint} error={errors.resume}>
        {/* The native control, restyled: it keeps the phone's own file picker and names the chosen file. */}
        <input
          id="cr-resume"
          name="resume"
          className="cr-input cr-file"
          type="file"
          accept={RESUME_ACCEPT}
          required
          onChange={(e) => chooseResume(e.target.files?.[0] ?? null)}
          aria-invalid={errors.resume ? true : undefined}
          aria-describedby={describedBy("resume", true, errors.resume)}
        />
      </Field>

      <Field
        name="profile_url"
        label={FIELDS.profile_url.label}
        hint={FIELDS.profile_url.hint}
        error={errors.profile_url}
        optional
      >
        <input
          id="cr-profile_url"
          name="profile_url"
          className="cr-input"
          type="url"
          inputMode="url"
          autoCapitalize="none"
          spellCheck={false}
          maxLength={300}
          placeholder="https://"
          value={values.profile_url}
          onChange={(e) => set("profile_url", e.target.value)}
          onBlur={() => blur("profile_url")}
          aria-invalid={errors.profile_url ? true : undefined}
          aria-describedby={describedBy("profile_url", true, errors.profile_url)}
        />
      </Field>

      <div className="cr-form__checks">
        <Check
          name="schedule_ack"
          checked={values.schedule_ack}
          error={errors.schedule_ack}
          onChange={(v) => set("schedule_ack", v)}
        >
          {FIELDS.schedule_ack.label}
        </Check>
        <Check name="pay_ack" checked={values.pay_ack} error={errors.pay_ack} onChange={(v) => set("pay_ack", v)}>
          {FIELDS.pay_ack.label}
        </Check>
        <Check name="consent" checked={values.consent} error={errors.consent} onChange={(v) => set("consent", v)}>
          {FIELDS.consent.before}
          <a href={PRIVACY_PATH} target="_blank" rel="noopener">
            {FIELDS.consent.link}
          </a>
          {FIELDS.consent.after}
        </Check>
      </div>

      {notice && (
        <p className="cr-form__notice" role="alert">
          {notice}
        </p>
      )}

      <button type="submit" className="cr-btn cr-btn--light cr-form__submit" disabled={sending}>
        <span className="cr-btn__node" aria-hidden="true" />
        {sending ? APPLY.submitting : APPLY.submit}
      </button>
    </form>
  );
}

/** One question, a few answers, one tap. A radio group, so a phone needs no picker. */
function Choice({
  name,
  legend,
  options,
  value,
  hint,
  error,
  onChange,
  columns = false,
}: {
  name: FieldName;
  legend: string;
  options: readonly { value: string; label: string }[];
  value: string;
  hint?: string;
  error?: string;
  onChange: (value: string) => void;
  columns?: boolean;
}) {
  return (
    <fieldset className="cr-field cr-choice" aria-describedby={describedBy(name, Boolean(hint), error)}>
      <legend className="cr-field__label">{legend}</legend>
      {hint && (
        <p className="cr-field__hint cr-field__hint--key" id={`cr-${name}-hint`}>
          {hint}
        </p>
      )}
      <div className={`cr-choice__options${columns ? " cr-choice__options--columns" : ""}`}>
        {options.map((o) => (
          <label key={o.value} className="cr-option">
            <input
              type="radio"
              name={name}
              value={o.value}
              required
              checked={value === o.value}
              onChange={() => onChange(o.value)}
            />
            <span>{o.label}</span>
          </label>
        ))}
      </div>
      <FieldError name={name} error={error} />
    </fieldset>
  );
}

function Check({
  name,
  checked,
  error,
  onChange,
  children,
}: {
  name: FieldName;
  checked: boolean;
  error?: string;
  onChange: (checked: boolean) => void;
  children: ReactNode;
}) {
  return (
    <div className="cr-field">
      <label className="cr-option cr-option--check">
        <input
          id={`cr-${name}`}
          type="checkbox"
          name={name}
          required
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `cr-${name}-error` : undefined}
        />
        <span>{children}</span>
      </label>
      <FieldError name={name} error={error} />
    </div>
  );
}
