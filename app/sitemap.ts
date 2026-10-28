import type { MetadataRoute } from "next";
import { SITE_ORIGIN } from "@/lib/site";

/**
 * Every indexable route. The four landers are static HTML in public/, served by
 * vercel.json rewrites, so they are listed here by hand. /weddingdesk is a proxied
 * app with its own sitemap and is left out. /careers/privacy is a notice, not a
 * landing page.
 */
const HOME_UPDATED = new Date("2026-10-25");

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_ORIGIN}/`, lastModified: HOME_UPDATED, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_ORIGIN}/housing-policy`, lastModified: new Date("2026-10-20"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_ORIGIN}/multifamily-policy`, lastModified: new Date("2026-10-28"), changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_ORIGIN}/voice`, lastModified: new Date("2026-10-20"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_ORIGIN}/garage-doors`, lastModified: new Date("2026-10-20"), changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_ORIGIN}/setterapplication`, lastModified: new Date("2026-10-08"), changeFrequency: "monthly", priority: 0.3 },
  ];
}
