import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Allow the dev server to serve /_next/* resources to these origins.
  // Without this, accessing the app via 127.0.0.1 (vs localhost) makes
  // Next.js block cross-origin dev resources, which breaks client-side
  // hydration — leaving interactive features (like the custom cursor) dead.
  allowedDevOrigins: ["localhost", "127.0.0.1"],

  /**
   * /weddingdesk -> the Sonder Concierge app.
   *
   * A multi-zone proxy, not a redirect: the URL stays on this domain while the
   * response is served by a separate Vercel project (`sonder-concierge-site`),
   * which deploys on its own schedule and does not touch this site's build.
   *
   * That app sets `basePath: "/weddingdesk"`, so its own routes already carry the
   * prefix and the paths map one to one. Both rules are needed — `:path*` does not
   * match the bare `/weddingdesk`.
   *
   * Changing the target: it points at the project's stable production alias, so a
   * deploy there goes live here with no change to this repo.
   */
  async rewrites() {
    const WEDDING_DESK = "https://sonder-concierge-site.vercel.app";
    return [
      { source: "/weddingdesk", destination: `${WEDDING_DESK}/weddingdesk` },
      { source: "/weddingdesk/:path*", destination: `${WEDDING_DESK}/weddingdesk/:path*` },
    ];
  },
};

export default nextConfig;
