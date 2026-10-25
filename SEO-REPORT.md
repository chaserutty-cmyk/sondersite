# SEO report — October 25, 2026

First run of `SEO-PROMPT.md`. What the site looked like before, what changed, what only
the owner can do, and what to build next.

## Before

- Title and description were generic ("Custom AI, automation, software and websites") with
  no city and none of the lanes an owner would search for.
- Structured data was a thin `ProfessionalService` with four `knowsAbout` strings and no
  services, founder, phone or catalog.
- No `llms.txt`, no Search Console verification, no analytics of any kind.
- Sitemap listed only `/` and the careers page; the three landers were missing.
- `/housing-policy` declared a canonical on the apex host (`sonderdigitalco.com`) while
  the site serves on `www`, a duplicate-content signal. The landers had no `og:image`, two
  had no structured data, and none linked back to the homepage.
- The old Squarespace domain `sonderdigital-co.com` still serves a "Coming Soon" page.
- Both background videos (8.7 MB) downloaded in full on every visit, including phones.

## Changed

| Area | What |
|---|---|
| Title | `Sonder Digital Co. \| Custom AI, Automation & Software, Atlanta` (62 chars) |
| Description | Names the lanes: AI agents, quote follow-up and lead reactivation, workflow automation, custom CRMs, websites; Atlanta (148 chars) |
| Structured data | One `@graph`: `Organization` + `ProfessionalService` (founder, email, phone, Atlanta, US) with a `hasOfferCatalog` of seven `Service`s, each with the audience it is for; `WebSite`; `WebPage`; a `ReserveAction` pointing at the booking link. No ratings or reviews, by rule. |
| `llms.txt` | Who Sonder is, who it is for and not for, every service in plain words, how an engagement runs, the other pages |
| Sitemap | All five indexable routes with `lastmod` |
| Robots | AI crawlers listed explicitly as allowed; `/api/` disallowed |
| Search Console | `verification.google` reads `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` |
| Analytics | Vercel Web Analytics installed (`@vercel/analytics`) |
| Landers | Canonicals on `www`; `og:image` (`/og.png`), `og:site_name`, Twitter card; `Service` + `WebPage` JSON-LD on `/voice` and `/garage-doors`; a sentence linking back to the homepage in each footer |
| Internal links | Footer column "Also by Sonder" linking all three landers and Sonder Concierge |
| Performance | Videos load only when within a viewport of the screen (`preload="none"`), a 720p encode on phones and slow connections, the desktop closing loop re-encoded 20 % smaller, posters compressed, the hero poster preloaded with high priority |

Measured on the production build (headless Chromium, no cache):

| | Desktop 1440 | Phone 390 |
|---|---|---|
| LCP | 0.19 s (hero poster) | 0.13 s (headline) |
| CLS | 0 | 0 |
| Transfer at load | 3.4 MB (was 9.0) | 1.6 MB (was 9.0) |
| Closing loop | loads only when scrolled to | 720p, loads only when scrolled to |

## Only the owner can do these

1. **Google Search Console.** Add `https://www.sonderdigitalco.com` as a URL-prefix
   property, choose the HTML-tag method, copy the `content` value, and on Vercel set
   `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` to it (Production), then redeploy. Then submit
   `https://www.sonderdigitalco.com/sitemap.xml` and request indexing for `/`.
2. **Google Business Profile.** Make sure the website field is `https://www.sonderdigitalco.com`,
   the name is exactly "Sonder Digital Co.", the phone is +1 908-601-0864 and the category
   is Software company. The site's structured data uses Atlanta, GA with no street address;
   if the profile shows a street address, add the same one to `jsonLd.address` in
   `app/(site)/layout.tsx` so name, address and phone match everywhere.
3. **The old domain.** `sonderdigital-co.com` is a Squarespace "Coming Soon" page. In
   Squarespace (Settings → Domains) forward it, with the www variant, to
   `https://www.sonderdigitalco.com` as a permanent (301) redirect, or point its DNS at
   Vercel and add it to the `sondersite` project. Until then any old links and the
   `chase@sonderdigital-co.com` email domain point at an empty page.
4. **Vercel Web Analytics.** In the Vercel dashboard, project `sondersite` → Analytics →
   Enable. The script is already in the page.
5. **Bing.** Import the Search Console property into Bing Webmaster Tools (one click once
   step 1 is done). Bing feeds ChatGPT and Copilot answers.

## Build next, in this order

The homepage can rank for the brand and for broad phrases, but a single page cannot rank
for seven services at once. Each lane needs its own page, written for the owner who
searches it. Target queries are listed so the page can be judged against them.

| Page | Target queries | Notes |
|---|---|---|
| `/lead-reactivation` | quote follow-up automation · estimate follow-up software · reactivate old quotes · dormant customer reactivation · win-back campaign for contractors | The primary lane. Reuse the quote demonstration. A short FAQ (`FAQPage` schema) answering how it works, what systems it syncs with, what it costs |
| `/ai-receptionist` | AI receptionist for medical practice · voice AI receptionist · 24/7 AI phone answering for clinics | Consolidates the plumbing and garage-door landers, which target a lane that was dropped; keep those pages but point them here |
| `/custom-crm` | custom CRM development · custom CRM for sign companies · CRM built around my workflow | |
| `/websites` | website design for coaches · nonprofit website design Atlanta · website for youth sports organization | Show the three live sites with the owners' permission and names; named work ranks and converts better than withheld work |
| `/housing-policy` (exists) | HOTMA ACOP update · HOTMA admin plan rewrite · HOTMA gap check | Already the best-structured page on the site; add an FAQ and a dated "what changed in HOTMA" note to earn freshness |

Two things would move rankings more than any code change: a handful of named client
case studies with the client's sign-off, and three or four links from relevant sites
(the client sites Sonder built, a Georgia State entrepreneurship page, the AI Frontrunners
community). Both are relationship work, not engineering.
