# Careers — the appointment setter page

`sonderdigitalco.com/setterapplication` is the recruiting page for one open role, with an application (answers plus a résumé file) that is stored in the CRM's Supabase project. `/careers/privacy` is the applicant data notice the form links to.

Built from the "Sonder Setter Hiring Plan" v1.0 (Oct 2026). This covers stage 1 only: the page and the application. The audio audition is not built yet (see the end).

## Where things are

| What | Where |
|---|---|
| Every word on the page, pay and hours included | `lib/careers/copy.ts` |
| The form's fields and rules (used by the browser and the server) | `lib/careers/application.ts` |
| The page and its share card | `app/(careers)/setterapplication/` |
| The applicant data notice (`/careers/privacy`) | `app/(careers)/careers/privacy/` |
| Styles (tokens come from `app/tokens.css`) | `app/(careers)/careers.css` |
| The endpoint the form posts to | `app/api/careers/apply/route.ts` |
| The database: tables, the one function, the rules | `~/sonder/sonder-crm/supabase/migrations/20260930120000_hiring_core.sql` |
| The edge function the endpoint calls | `~/sonder/sonder-crm/supabase/functions/hiring/index.ts` |
| Résumé files | Supabase Storage, private bucket `resumes`, one file per applicant |

The site never holds a database or storage key. It holds one secret that opens the `hiring` function, and that function can do two things: say whether the opening is open, and take an application with its résumé.

## Before this goes live

These are the hiring plan's open decisions. All three are constants at the top of `lib/careers/copy.ts`.

- **Bonus amounts are set**: $25 per qualified show and $75 per close (`BONUS`). Two parts of the plan are still open and are not stated on the page: **when bonuses are paid**, and the **written definition of a "qualified" appointment**. The page says bonuses are paid "under a written plan", so write that plan before a setter starts.
- **`CONTACT_EMAIL`** is `chase@sonderdigital-co.com`. Confirm it is the address applicants should write to.
- **`RETENTION`** says applications are kept until six months after the role is filled. Nothing deletes them automatically, so this is a promise you keep by hand. Change it if you want a different period.

Also read `/careers/privacy` once. It describes what this build does; it is not legal advice. The engagement model (contractor or otherwise) is still yours to decide and is not stated on the page.

## Deploying

### The database side is live (8 Oct 2026)

The `hiring` schema, the private `resumes` bucket, the `HIRING_SECRET` secret and the `hiring` function are deployed to the Sonder CRM Supabase project. Two marked test applications went through it, one straight to the live function and one through the form itself. Read back from the live table, every answer, the source link, the landing time, the score and the résumé's path, name and size were there; a repeat was flagged and an invalid one refused. Both rows are still there, named "TEST APPLICATION (delete me)" and "TEST APPLICATION 2 (delete me)"; delete them in the table editor, and their two files in Storage → `resumes`.

Only the hiring migration was applied. On that day five older migrations in `sonder-crm` had never been applied to the live database: `plays_and_replies` and the four HQ ones. They were left alone. **A plain `supabase db push` in `sonder-crm` will apply all five.** That is fine when you mean to ship them, and a surprise if you only wanted something else.

To redeploy the function after changing it:

```bash
cd ~/sonder/sonder-crm && supabase functions deploy hiring --no-verify-jwt
```

### The page is not published yet

In the Vercel project for this site, add two environment variables, then deploy:

- `HIRING_API_URL` = `https://ivarkkgkrcdqoivoqlkh.supabase.co/functions/v1/hiring`
- `HIRING_API_SECRET` = the value of `HIRING_SECRET` in `~/sonder/sonder-crm/supabase/functions/.env`

Without them the page still renders, but an application gets "We could not save your application" and nothing is stored. Submit one real application from the published page, with a real PDF, and find both the row and the file before sharing the link.

The phone alert for a new application uses the Telegram bot the CRM already has. It carries experience, score and source, never a name or address. If Telegram is not configured, applications are stored just the same.

## Reading applications

Supabase dashboard → Table Editor → schema `hiring` → `applicants`.

- **Sort** by `score_total`, highest first. The database fills `score_auto` (up to 65: experience 30, US B2B calling 20, availability 15). You add `score_performance` (0–25) and `score_tools` (0–10) after reading. The score only sorts; nothing is rejected automatically.
- **Status**: edit the `status` cell. Allowed values: `applied`, `review`, `shortlisted`, `audio_invited`, `audio_submitted`, `interview`, `paid_trial`, `offered`, `rejected`, `withdrawn`. Each change is logged in `status_history` with the time.
- **Notes**: `reviewer_notes`.
- **Employment history**: `employment_history`, as the candidate typed it.
- **Résumé**: Storage → `resumes` → `appointment-setter/`. Each file is named with the applicant's `id`, and the row holds `resume_path` and `resume_filename` (what the candidate called it). If `resume_path` is empty, the application was saved but the file did not upload; the candidate was told to email it, and the phone alert says "Résumé did not upload." Open résumés as you would any attachment from a stranger: preview PDFs in the browser, and do not enable macros in a Word file.
- **Repeat submissions**: a second application from the same email does not create a second row. `resubmissions` counts them and `last_resubmission` holds what the repeat said. The original answers are never overwritten.
- **Source**: `utm_source`, `utm_medium`, `utm_campaign`, and `landed_at`.
- **Export**: the table editor's Export to CSV.
- **Deletion request**: delete the row (its history goes with it), then delete the applicant's file in Storage → `resumes`. The file is not removed automatically.

`performance_claims` is what the candidate says about themselves. Treat it as unverified until the interview and trial.

## Closing the opening

Table Editor → `hiring` → `openings` → set `status` to `closed`. Within a minute the page replaces every Apply button and the form with "Applications are closed", and the endpoint refuses new applications. Set it back to `open` to reopen. No redeploy.

## Tracking links

Give each place its own link, for example:

```
https://www.sonderdigitalco.com/setterapplication?utm_source=facebook&utm_medium=group&utm_campaign=<group-name>
https://www.sonderdigitalco.com/setterapplication?utm_source=upwork&utm_medium=job-post
```

The first link a candidate arrives on is the one recorded, even if they come back later without it.

## Changing pay, hours or wording

The one-year requirement is `REQUIREMENT` and the bonus amounts and wording are `BONUS`, both in `lib/careers/copy.ts`. The requirement is stated in the hero, Who fits, the FAQ, the form and the share card; it does not block the form, so someone under a year can still apply and will sort to the bottom.

A résumé can be a PDF or Word file up to 4 MB. The limit is there because Vercel refuses request bodies over 4.5 MB; the bucket enforces the same size and types.

Edit `lib/careers/copy.ts` and deploy. The hero, the Compensation section, the form's pay checkbox, the share card and the notice all read from it. If the pay or hours change, also update the comments beside `schedule_ack` and `pay_ack` in the migration.

## Running it locally

`.env.development.local` currently points local dev at the **live** function, so an application submitted in the local preview is a real row in the real table.

To test without touching the live data, run the stand-in and point local dev at it instead:

```bash
node scripts/hiring-stub.mjs        # a stand-in for the hiring function, on :8787
```

```
HIRING_API_URL=http://127.0.0.1:8787
HIRING_API_SECRET=local-test-secret
```

The stand-in runs the real migration in an in-memory Postgres, so duplicates, the flood guard and the closed state behave as they do live. `curl http://127.0.0.1:8787/_rows` shows what was stored, résumé paths included (the stand-in keeps files in memory, not in Supabase Storage). The database rules have their own tests: `cd ~/sonder/hq/tests/db && npm test -- hiring`.

## What changed for the rest of the site

The careers pages have their own root layout so they load none of the homepage's intro, smooth-scroll, cursor or animation code. That needed three small moves:

- The homepage, its layout, `/sandbox` and the share image now live in `app/(site)/`. URLs are unchanged.
- The design tokens moved from the top of `app/globals.css` to `app/tokens.css`, which `globals.css` imports. Both layouts read the same tokens.
- The homepage share image's URL gained a suffix (`/opengraph-image-12o0cb`). The page's meta tag points at the new URL; the image is the same.

An unmatched URL now shows Next's plain 404 page rather than the same text inside the homepage shell.

## Not built yet

- Stage 2: the audio audition page, invite tokens, and private audio storage.
- A "Hiring" page in the CRM app. Until then, the Supabase table editor is the workspace.
- A confirmation email to the applicant. The on-page receipt is the only acknowledgment.
