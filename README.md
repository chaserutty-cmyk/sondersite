# Sonder Digital Co. — website

The public site at `sonderdigitalco.com`. One anchored homepage plus the careers pages
(`/setterapplication`, `/careers/privacy`) and three static landers served from `public/`
(`/housing-policy`, `/voice`, `/garage-doors`). `/weddingdesk` is proxied to the separate
Sonder Concierge project (see `next.config.ts`).

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
```

## The homepage (October 2026 rebuild)

Plan and reference breakdown: `DESIGN-PLAN.md`. Layout follows SynthCoder (rounded sheets,
split hero, sticky art cards), motion and 3D follow Lonestone, imagery follows Lazarev, all
in Sonder's ivory, charcoal and gold. Copy is the approved copy only.

| What | Where |
|---|---|
| Every word on the page | `lib/copy.ts` |
| Booking link, contact email, nav anchors | `lib/site.ts` |
| Styles (tokens shared with the careers pages) | `app/(site)/site.css`, `app/tokens.css` |
| Page composition | `app/(site)/page.tsx` → `sections/*.tsx` |
| Buttons, labels, word-rise headings | `components/ui.tsx` |
| Menu and floating dock | `components/Chrome.tsx` |
| Smooth scroll, reveals, parallax | `components/Motion.tsx` (Lenis) |
| Render tiles with glass interface panels (capabilities) | `components/Tile.tsx` |
| Quote follow-up demonstration | `components/QuoteDemo.tsx` |
| Background video loops | `components/Loop.tsx`, `public/video/` |
| Licensed renders, graded to gold (sources in `ASSETS.md`) | `public/art/` |
| Client site captures (names blurred or cropped out) | `public/work/` |

**The booking link.** Every "Book a Discovery Call" goes to `BOOKING_URL` in `lib/site.ts`.

**Motion.** Everything respects `prefers-reduced-motion`: smooth scroll turns off, reveals
show immediately, and the video loops stay on their poster frame. Loops pause when off-screen.

**Imagery.** Every render and loop is licensed stock (Unsplash and Pexels), graded to the
brand. `ASSETS.md` lists each file, its source and what was changed.

## The previous homepage

The chapter-based "Gravity System" homepage (May–October 2026) is kept two ways:

- a full copy of the project as it was, without `node_modules`, at
  `../sonderv3-backup-2026-10-23/`
- the git branch `pre-redesign-2026-10-23`, pinned at the last commit before the redesign

## Careers pages

See `CAREERS.md`. They have their own root layout and stylesheet and share only
`app/tokens.css` with the homepage.
