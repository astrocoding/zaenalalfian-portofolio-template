import type { NextConfig } from "next";
import { verifyServerAttributionIntegrity } from "./lib/integrity.server";

// Execute build-time & server startup integrity verification
verifyServerAttributionIntegrity();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? { exclude: ["error", "warn"] } : false,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "framer-motion",
      "date-fns",
      "@prisma/client",
    ],
  },
};

export default nextConfig;
