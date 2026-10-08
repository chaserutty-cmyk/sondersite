import type { Metadata, Viewport } from "next";
import { preload } from "react-dom";
import "./careers.css";
import { SITE_URL } from "@/lib/careers/copy";

/**
 * Root layout for /careers/*.
 *
 * A second root layout, beside app/(site)/layout.tsx, so these pages share the
 * house tokens (app/tokens.css, via careers.css) and the three house typefaces
 * but none of the homepage's machinery: no intro loader, no smooth-scroll, no
 * custom cursor, no GSAP, and not globals.css either. A candidate opening this
 * from a Facebook group on a phone should see the role and the pay before any
 * of that would have finished loading.
 *
 * Fonts are declared in careers.css from public/fonts/careers, not through
 * next/font. The build puts every next/font face in one stylesheet shared by
 * both layouts, which made these pages preload all twelve of the homepage's
 * font files (241 KB). Here it is five files, 146 KB, and only the two serif
 * files that draw the headline are preloaded.
 */

const PRELOAD = ["/fonts/careers/cormorant-garamond.woff2", "/fonts/careers/cormorant-garamond-italic.woff2"];

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "Careers | Sonder Digital Co.", template: "%s | Sonder Digital Co." },
  openGraph: { siteName: "Sonder Digital Co.", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#f4f0e7",
};

export default function CareersLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  for (const href of PRELOAD) preload(href, { as: "font", type: "font/woff2", crossOrigin: "anonymous" });
  return (
    <html lang="en">
      <body className="cr">{children}</body>
    </html>
  );
}
