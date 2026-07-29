import type { NextConfig } from "next";
import { verifyServerAttributionIntegrity } from "./lib/integrity.server";

// Execute build-time & server startup integrity verification
verifyServerAttributionIntegrity();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "zaenalalfian.cloud",
      },
      {
        protocol: "http",
        hostname: "localhost",
      },
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
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
  },
  turbopack: {},
};

export default nextConfig;
