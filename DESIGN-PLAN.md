# Sonder Digital Co. — homepage rebuild plan (v2)

October 23, 2026. Replaces the first redesign entirely. Direction from Chase:
**70 % SynthCoder** (layout and graphics), **Lonestone** for 3D, interactivity and how things
move, **Lazarev** for the imagery. Sonder's colour scheme throughout. Copy is the approved
copy only (`~/Downloads/sonder-redesign/index.html`), with no added case studies.

## 1. What each reference contributes

**SynthCoder (the skeleton).** The page is a stack of rounded *sheets* (≈30 px radius,
≈10 px gaps) on a light canvas, alternating white and near-black. Signature pieces:
split hero (white type sheet + dark animated-visual sheet with floating glass chips), a
marquee strip, a dark "statement" sheet pairing a console graphic with big quote type, a
**sticky dark art card on the left with a scrolling column on the right** (used for
services and process), numbered `001.` labels, workflow pill bars, tag pills, paired
dark device renders, typed "Output:" lines with a cursor, a dark CTA sheet over a particle
wave, and a footer on the canvas with a giant faded wordmark. Type: Geist + Geist Mono,
heavy tight-tracked headlines, mono micro-labels in brackets `(SC® — 01)`.

**Lonestone (motion and 3D).** Cinematic 3D objects (a refractive crystal, dark hardware)
looping on black, set directly behind or beside type; marquees; everything eases rather
than snaps. We render ours live in WebGL so it responds to the pointer and to scroll.

**Lazarev (imagery).** Glossy, chrome and glass 3D renders framed in rounded panels,
dramatic light on dark. Sonder already owns gold 3D renders in this family (the faceted
polyhedron, the gold sphere); they become the photographic moments.

## 2. Sonder translation

| SynthCoder | Sonder |
|---|---|
| light grey canvas | warm ivory canvas `#f4f0e7` |
| white sheets | white `#ffffff` |
| coal sheets `#141417` | charcoal `#10100e` / `#171612` |
| indigo glow `#4f46e5` | Sonder gold `#9a7a3d` → highlight `#e2c281` |
| Geist / Geist Mono | Geist / Geist Mono, plus Cormorant italic in gold for the one accent phrase per headline (the Sonder signature) |
| `(SC® — 01)` | `(SD — 01)` |

## 3. Page, section by section (all copy verbatim from the approved file)

1. **Hero** — white sheet: logo, anchors, menu; `(SD — 01) Independent technology studio`;
   the H1 with *work better.* in gold italic; both approved paragraphs; **Book a
   Discovery Call** (with blinking cursor) and a round "Scroll to explore" control. Dark
   sheet: live **gold particle wave** (WebGL, pointer-reactive) with floating chips
   using the approved interface labels. Notch pill: *Atlanta, GA · Working everywhere*.
   Marquee: the four capability names.
2. **Our perspective** (dark statement sheet) — left: an animated operations console
   (workflow *New inquiry → Qualification → CRM + follow-up*, no invented numbers);
   right: gold quote mark, the H2, both paragraphs, the *More than the tools* sign-off.
3. **Our expertise / Solutions** (white sheet) — sticky dark art card holding an
   **interactive 3D gold-and-glass crystal** (drag to turn, scroll to rotate) with the
   H2, subline and a live `01/04` counter. Right column: four capability blocks, each
   with `00n.` label, title, approved lead line, approved description, a workflow pill
   bar, tag pills drawn from the description, **two dark device renders** built in code
   using the approved illustrative-interface text, and a typed Output line.
4. **Selected work** (dark sheet) — H2 + subline, then three SynthCoder case cards
   (white info panel / dark visual panel). Title and approved one-line description only:
   no metrics, no client names, no case-study narrative. Visuals: conceptual UI for the
   CRM card (labelled), real live client sites in device frames for the websites card,
   an interactive quote follow-up demonstration for the third.
5. **Our approach** (white sheet) — sticky dark art card with Sonder's gold polyhedron
   render and a flowing gold ribbon; H2, subline, and a **Book a Discovery Call** link.
   Right: Discover → Design → Build → Refine with the approved step text.
6. **Let's talk** (dark CTA sheet over the particle wave) — kicker, H2, both paragraphs,
   **Book a Discovery Call**, email.
7. **Footer** on the canvas — capability list, anchors, email, back to top, giant faded
   SONDER wordmark.

## 3b. Imagery (revised Oct 23, evening)

The WebGL scenes built for the first pass were replaced with licensed 3D renders and
video loops from Unsplash and Pexels, chosen to match the reference art and graded to
gold (see `ASSETS.md`). Capability and case visuals are those renders with glass
interface panels over them carrying the approved interface text.

## 4. Motion

Lenis smooth scroll (off under reduced motion). Sheets lift and settle as they enter.
Headlines rise by line. Pills, chips and device renders drift on scroll (parallax ≤ 30 px).
WebGL scenes pause when off-screen and render one still frame under reduced motion.
Marquees, typed Output lines and the workflow pulses run on CSS.

## 5. Build

Next 16 app in this repo. New `app/(site)/site.css`, `sections/*`, `components/*`,
`components/three/*` (Three.js, client-only, lazy-loaded). Copy in `lib/copy.ts`, booking
link in `lib/site.ts`. Check at 1440, 1024 and 390 wide; production build must pass.
