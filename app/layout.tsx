import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter, IBM_Plex_Mono, Libre_Franklin } from "next/font/google";
import "./globals.css";
import GoldCursor from "@/components/GoldCursor";
import SmoothScroll from "@/components/SmoothScroll";
import Intro from "@/components/Intro";

const serif = Cormorant_Garamond({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

/* Display grotesque for SystemHero (STRATEGY. / GRAVITY.).
   Libre Franklin is a high-contrast grotesque (Franklin Gothic lineage) with
   a curved R leg, G spur, and editorial stroke variation that matches the
   reference letterforms much more closely than geometric UI sans fonts. */
const sansDisplay = Libre_Franklin({
  variable: "--font-sans-display",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://sonderdigital-co.com"),
  title: "Sonder Digital Co. — Most brands chase attention. Few create gravity.",
  description:
    "Sonder Digital Co. engineers digital presence systems that build trust, create pull, and turn perception into momentum.",
  keywords: [
    "digital experience architecture",
    "brand strategy",
    "web design",
    "conversion architecture",
    "motion design",
    "Sonder Digital Co.",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    title: "Sonder Digital Co. — Most brands chase attention. Few create gravity.",
    description:
      "We engineer digital presence systems that build trust, create pull, and turn perception into momentum.",
    url: "/",
    siteName: "Sonder Digital Co.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sonder Digital Co. — Few create gravity.",
    description:
      "We engineer digital presence systems that build trust, create pull, and turn perception into momentum.",
  },
};

export const viewport: Viewport = {
  themeColor: "#f4f0e7",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${serif.variable} ${sans.variable} ${sansDisplay.variable} ${mono.variable} antialiased`}
    >
      <body className="min-h-screen bg-[var(--ivory)] text-[var(--ink)]">
        {/* Start reloads at the top so the pinned card scroll + loader behave. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "try{history.scrollRestoration='manual'}catch(e){}",
          }}
        />
        <Intro />
        <SmoothScroll />
        <GoldCursor />
        {children}
      </body>
    </html>
  );
}
