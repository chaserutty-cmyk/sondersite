# Prompt: make sonderdigitalco.com rank for the services Sonder sells

Paste everything below the line into a fresh agent session opened at
`~/Desktop/sonder /sonderv3` (note the space in "sonder "). It is written to be run as-is
and re-run whenever the services, lanes or copy change. First run: October 25, 2026
(`SEO-REPORT.md` records what it did).

---

You are optimizing a live single-page marketing site for **search (SEO)** and for
**answer engines (AEO)**: being quoted accurately by Google's AI Overviews, ChatGPT,
Claude and Perplexity when an owner asks a question Sonder answers. Nobody can guarantee a
ranking. Your job is to remove every technical reason not to rank, make each service Sonder
sells explicit to machines, and set up measurement so the owner can see what works.

## The business, stated precisely

**Sonder Digital Co.**, Atlanta, Georgia (New Jersey LLC, founder Chase Rutty). A software
and automation studio: the founder designs and builds the systems himself. Buyers are
**owners and operators of established, high-ticket, quote-based businesses** and a few
named sectors. Not consumers.

Services, in priority order (from the founder's operating brief, Oct 23, 2026):

| Lane | What it is | Who buys it | Where it lives |
|---|---|---|---|
| **Lead reactivation / quote follow-up** (primary) | Revives unclosed estimates and dormant clients, installs automatic personal follow-up, routes every reply to the right person | Commercial sign companies, trade-show exhibit houses, hardscape and outdoor living, pool and deck builders, generator dealers | Homepage: Sales & Customer Systems, "Lead Reactivation" |
| **AI implementation and custom systems** | Custom CRM, dashboards, integrations, data migration, follow-up flows, chatbots | Same owners, plus nonprofits | Homepage: all four capabilities |
| **Voice AI / AI receptionist** | Branded phone agent that answers, routes and books 24/7 | Clinics and private practices; the plumbing and garage-door versions are built but no longer actively sold | Homepage: "Voice AI & AI Receptionist"; `/voice`, `/garage-doors` |
| **Websites and web applications** | Premium sites and funnels, the door-opener | Coaches, sports orgs, nonprofits, creatives | Homepage: Custom Software & Development |
| **HOTMA policy updates** (proven revenue) | Gap check and rewrite of a housing authority's ACOP / Admin Plan for HUD's HOTMA rules | Executive directors of small public housing authorities | `/housing-policy` |

Do **not** write for: consumers, HVAC/plumbing/roofing/solar lead-gen buyers (dropped as
saturated), or anything that reads like a generic "AI agency".

## Target queries

Write metadata, structured data and `llms.txt` so the site is a plausible answer for:

- custom AI automation for small business · AI implementation consultant Atlanta
- quote follow-up automation · estimate follow-up software · reactivate old quotes
- lead reactivation service · dormant customer reactivation · win-back campaigns for contractors
- sign company CRM · follow-up system for commercial sign companies
- AI receptionist for medical practice · voice AI receptionist · 24/7 AI phone answering
- custom CRM development · custom software for small business · business workflow automation
- HOTMA ACOP update · HOTMA admin plan rewrite · HOTMA gap check small housing authority
- website design for coaches / nonprofits Atlanta

The test for every phrase: would an owner type it, and would Sonder want that call?

## Repo and stack

| | |
|---|---|
| Path | `~/Desktop/sonder /sonderv3` |
| Stack | Next.js 16 App Router, TypeScript, plain CSS (`app/(site)/site.css`), Tailwind only for the careers pages |
| Host | Vercel project `sondersite`, team `sonder3`; a push to `main` deploys |
| Canonical host | `https://www.sonderdigitalco.com` (apex 308s to www) |
| Routes | `/` (the homepage), `/setterapplication`, `/careers/privacy`, static landers in `public/`: `/housing-policy`, `/voice`, `/garage-doors`; `/weddingdesk` proxies the Sonder Concierge app |
| Copy | `lib/copy.ts` only. The visible homepage copy is approved and must not be reworded for SEO. Metadata, structured data, alt text, footer navigation and `llms.txt` are yours. |
| Config | `lib/site.ts` (origin, booking URL, email, nav) |

## Hard constraints

1. **Never invent proof.** No testimonials, ratings, review counts, client logos, client
   names, awards or statistics, in copy or in structured data (`aggregateRating`, `review`
   and the like are forbidden). The founder's proof rules are strict.
2. **Do not reword the approved homepage copy** (headline, paragraphs, capability text,
   build descriptions, process, closing). Add; do not edit.
3. **Keep it one page.** No new marketing routes without the owner's say-so; propose them in
   the report instead.
4. **Keep NAP consistent.** Name, phone and locality must match across the site and the
   Google Business Profile (category: Software company). If you are unsure of the street
   address, give locality only.
5. **Performance is SEO.** Core Web Vitals must stay green: LCP under 2.5 s on a mobile
   emulation, CLS 0, no media downloaded before it is needed.

## Do, in this order

1. **Audit** the live site: title, description, canonical, OG, headings (exactly one `h1`),
   JSON-LD, sitemap, robots, every lander's head, redirects for every domain variant,
   transfer size and LCP at 1440 and 390 wide. Write the findings down before changing anything.
2. **Metadata**: a title under 62 characters that names the services and the city; a
   description under 160 that names the primary lanes; OG and Twitter consistent; Google
   Search Console verification wired to `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` so the owner
   can paste a token without a code change.
3. **Structured data** on the homepage: `Organization` + `ProfessionalService` (founder,
   email, telephone, locality, `areaServed`, `knowsAbout`) with a `hasOfferCatalog` listing
   every service above as a `Service`, plus `WebSite`. Validate it parses.
4. **`public/llms.txt`**: who Sonder is, who it is for, who it is not for, every service in
   plain words, how to start (the booking link and email). Written to be quoted.
5. **Sitemap and robots**: every indexable route including the landers, with `lastmod`;
   `/api/` disallowed; AI crawlers allowed.
6. **Landers**: canonical on the www host, `og:image`, JSON-LD (`Service` under the same
   `ProfessionalService`), and a link back to the homepage so link equity flows both ways.
7. **Internal links**: footer navigation to each lander from the homepage.
8. **Performance**: background video only loads when near the viewport, a smaller encode on
   phones, posters preloaded for LCP, images sized and lazy where appropriate.
9. **Measurement**: Vercel Web Analytics installed (enable it in the project dashboard).
10. **Build, deploy, verify on the live domain**, then write `SEO-REPORT.md`: what changed,
    what the owner must do by hand (Search Console, Business Profile, the old Squarespace
    domain `sonderdigital-co.com` which still serves a "Coming Soon" page and must 301 to
    the new domain), and the pages worth adding next with their target queries.

## What good looks like

An owner searching "quote follow-up automation" or an assistant asked "who builds custom
CRMs and AI receptionists for small businesses in Atlanta" lands on a page that says exactly
that in its title, description, schema and `llms.txt`, loads in under two seconds on a
phone, and has one clear action: Book a Discovery Call.
