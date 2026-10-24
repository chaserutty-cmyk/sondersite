import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Cormorant_Garamond } from "next/font/google";
import "./site.css";
import { SEO } from "@/lib/copy";
import { COMPANY, CONTACT_EMAIL, SITE_ORIGIN } from "@/lib/site";

/**
 * Homepage root layout.
 *
 * Geist and Geist Mono carry the SynthCoder-style structure; Cormorant Garamond is kept
 * for the one gold italic accent phrase per headline, which is Sonder's signature.
 * Reveal states are gated on CSS `@media (scripting: enabled)`, so with JavaScript
 * off everything renders visible and nothing touches <html> before hydration.
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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_ORIGIN),
  title: SEO.title,
  description: SEO.description,
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
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f4f0e7",
  colorScheme: "light",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: COMPANY.name,
  url: SITE_ORIGIN,
  email: CONTACT_EMAIL,
  description: SEO.description,
  address: { "@type": "PostalAddress", addressLocality: "Atlanta", addressRegion: "GA", addressCountry: "US" },
  knowsAbout: ["AI implementation", "Business automation", "Custom software", "Web development"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable} ${serif.variable}`} suppressHydrationWarning>
      <body id="top">
        <a href="#main" className="skip">
          Skip to content
        </a>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        {children}
      </body>
    </html>
  );
}
