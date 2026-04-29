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
console.log(`[ARYO build] STRIPE KEY SET: ${!!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`);
console.log(`[ARYO build] GETADDRESS KEY SET: ${!!process.env.NEXT_PUBLIC_GETADDRESS_API_KEY}`);

const nextConfig: NextConfig = {
  webpack(config) {
    // Optional deps from MetaMask SDK and WalletConnect's pino logger
    config.resolve.alias = {
      ...config.resolve.alias,
      "@react-native-async-storage/async-storage": false,
      "pino-pretty": false,
    };
    return config;
  },
};

export default nextConfig;
