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
};

export default nextConfig;
