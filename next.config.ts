import type { NextConfig } from "next";
import { verifyServerAttributionIntegrity } from "./lib/integrity.server";

// Execute build-time & server startup integrity verification
verifyServerAttributionIntegrity();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "date-fns",
      "@prisma/client",
      "clsx",
      "tailwind-merge",
      "embla-carousel-react",
    ],
    // Inline critical CSS into HTML to eliminate render-blocking CSS chunk
    // (was causing 190ms FCP penalty per Lighthouse audit)
    inlineCss: true,
  },
  turbopack: {},
};

export default nextConfig;
