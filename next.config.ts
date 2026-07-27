import type { NextConfig } from "next";
import { verifyServerAttributionIntegrity } from "./lib/integrity.server";

// Execute build-time & server startup integrity verification
verifyServerAttributionIntegrity();

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
