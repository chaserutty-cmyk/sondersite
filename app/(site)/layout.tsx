import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import { preload } from "react-dom";
import { Analytics } from "@vercel/analytics/next";
import "./site.css";
import { SEO } from "@/lib/copy";
import { BOOKING_URL, COMPANY, CONTACT_EMAIL, SITE_ORIGIN } from "@/lib/site";

/**
 * Homepage root layout.
 *
 * Geist and Geist Mono carry the SynthCoder-style structure; Cormorant Garamond is kept
 * for the one gold italic accent phrase per headline, which is Sonder's signature.
 * Reveal states are gated on CSS `@media (scripting: enabled)`, so with JavaScript
 * off everything renders visible and nothing touches <html> before hydration.
 *
 * SEO lives here: metadata, Search Console verification (paste the token into
 * NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION on Vercel), and the structured data that names
 * every service Sonder sells. See SEO-PROMPT.md and SEO-REPORT.md.
 */
const geist = Geist({ variable: "--font-geist", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });
const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["500"],
  style: ["italic"],
  display: "swap",
});

const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: SEO.title,
  description: SEO.description,
  keywords: [...SEO.keywords],
  alternates: { canonical: "/" },
  openGraph: {
    title: SEO.ogTitle,
    description: SEO.description,
    url: "/",
    siteName: COMPANY.name,
    type: "website",
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title: SEO.ogTitle, description: SEO.description },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
  verification: GOOGLE_VERIFICATION ? { google: GOOGLE_VERIFICATION } : undefined,
  category: "technology",
};

export const viewport: Viewport = {
  themeColor: "#f4f0e7",
  colorScheme: "light",
};

/** Every service Sonder sells, as schema.org Services under one ProfessionalService. */
const SERVICES = [
  {
    name: "Lead reactivation and quote follow-up",
    description:
      "Revives estimates that went quiet and clients who stopped booking with automatic, personal follow-up written from each quote; every reply is routed to the right person.",
    audience: "Established, owner-operated businesses that sell by quote or estimate: commercial sign companies, trade-show exhibit houses, hardscape and outdoor-living contractors, pool and deck builders, generator dealers.",
  },
  {
    name: "AI agents and intelligent systems",
    description:
      "AI receptionists, virtual assistants, customer support agents and intelligent systems that answer questions, qualify leads, book appointments and support operations.",
  },
  {
    name: "Voice AI receptionist",
    description: "A branded phone agent that answers every call 24/7, routes it where it belongs and books appointments.",
    audience: "Private medical practices, clinics and service businesses.",
  },
  {
    name: "Workflow automation and integrations",
    description: "Connects the tools a business already runs so information moves on its own and repetitive tasks run without manual work.",
  },
  {
    name: "Custom software and development",
    description: "Custom CRMs, internal dashboards, client portals, business applications, websites and web applications built around how a business actually works.",
  },
  {
    name: "Sales and customer systems",
    description: "Systems that respond to new inquiries, follow up on open quotes, reconnect with past leads and help a team turn more conversations into customers.",
  },
  {
    name: "HOTMA policy updates for public housing authorities",
    description: "A gap check and board-ready rewrite of a housing authority's ACOP or HCV Administrative Plan for HUD's HOTMA income and asset rules.",
    url: `${SITE_ORIGIN}/housing-policy`,
    audience: "Executive directors of small public housing authorities.",
  },
  {
    name: "HOTMA policy updates for HUD multifamily owners and management agents",
    description:
      "A policy review and rewrite of a property's Tenant Selection Plan and EIV policies and procedures for HUD's multifamily HOTMA guidance.",
    url: `${SITE_ORIGIN}/multifamily-policy`,
    audience: "Owners and management agents of HUD-assisted multifamily properties.",
  },
];

const ORG_ID = `${SITE_ORIGIN}/#organization`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": ["Organization", "ProfessionalService"],
      "@id": ORG_ID,
      name: COMPANY.name,
      alternateName: "Sonder Digital",
      url: SITE_ORIGIN,
      logo: `${SITE_ORIGIN}/og.png`,
      image: `${SITE_ORIGIN}/og.png`,
      email: CONTACT_EMAIL,
      telephone: "+1-908-601-0864",
      description: SEO.description,
      slogan: SEO.ogTitle,
      foundingDate: "2026-03",
      founder: { "@type": "Person", name: "Chase Rutty", jobTitle: "Founder" },
      address: { "@type": "PostalAddress", addressLocality: "Atlanta", addressRegion: "GA", addressCountry: "US" },
      areaServed: { "@type": "Country", name: "United States" },
      knowsAbout: [
        "AI implementation",
        "AI agents",
        "Voice AI receptionists",
        "Lead reactivation",
        "Quote follow-up automation",
        "Workflow automation",
        "Systems integration",
        "Custom CRM development",
        "Custom software development",
        "Web development",
        "HOTMA compliance for public housing authorities",
      ],
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Services",
        itemListElement: SERVICES.map((s) => ({
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: s.name,
            description: s.description,
            provider: { "@id": ORG_ID },
            areaServed: "US",
            ...(s.url ? { url: s.url } : {}),
            ...(s.audience ? { audience: { "@type": "BusinessAudience", name: s.audience } } : {}),
          },
        })),
      },
      potentialAction: {
        "@type": "ReserveAction",
        name: "Book a Discovery Call",
        target: BOOKING_URL,
      },
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_ORIGIN}/#website`,
      url: SITE_ORIGIN,
      name: COMPANY.name,
      publisher: { "@id": ORG_ID },
      inLanguage: "en-US",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_ORIGIN}/#webpage`,
      url: SITE_ORIGIN,
      name: SEO.title,
      description: SEO.description,
      isPartOf: { "@id": `${SITE_ORIGIN}/#website` },
      about: { "@id": ORG_ID },
      inLanguage: "en-US",
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  // The hero poster is the largest thing above the fold on wide screens.
  preload("/video/hero-loop.jpg", { as: "image", fetchPriority: "high" });
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${serif.variable}`} suppressHydrationWarning>
      <body id="top">
        <a href="#main" className="skip">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
