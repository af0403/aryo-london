import { defaultWagmiConfig } from "@web3modal/wagmi/react";
import { mainnet, polygon, base } from "wagmi/chains";

export const walletConnectProjectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "";

export const isWalletConnectConfigured = walletConnectProjectId !== "";

const chains = [mainnet, polygon, base] as const;

export const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId: walletConnectProjectId || "placeholder",
  metadata: {
    name: "ARYO London",
    description: "ARYO – Pennicella Collection",
    url: "https://aryo.london",
    icons: [],
  },
  ssr: true,
});
