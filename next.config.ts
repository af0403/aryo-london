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
console.log(
  `[ARYO build] STRIPE KEY SET: ${!!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY}`,
);

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      "@react-native-async-storage/async-storage": "./lib/empty-module.ts",
      "pino-pretty": "./lib/empty-module.ts",
    },
  },
  async redirects() {
    return [
      {
        source: "/campaign",
        destination: "/campaigns/pennicella",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    const origin =
      process.env.NODE_ENV === "development"
        ? process.env.ARYO_ASSET_ORIGIN
        : undefined;
    return origin
      ? [
          { source: "/assets/:path*", destination: `${origin}/assets/:path*` },
          { source: "/favicon:ext", destination: `${origin}/favicon:ext` },
        ]
      : [];
  },
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
