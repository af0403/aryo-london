import type { NextConfig } from "next";

const pk = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";
const pkStatus = pk.startsWith("pk_live_")
  ? "live key set"
  : pk.startsWith("pk_test_")
  ? "test key set"
  : pk
  ? "set but unrecognised format"
  : "NOT SET — checkout will show contact fallback";
console.log(`[ARYO build] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${pkStatus}`);

const nextConfig: NextConfig = {};

export default nextConfig;
