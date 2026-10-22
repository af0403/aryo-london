import { defaultWagmiConfig } from "@web3modal/wagmi/react";
import { mainnet } from "wagmi/chains";

import { walletConnectProjectId } from "./payment-config";
export {
  walletConnectProjectId,
  isWalletConnectConfigured,
} from "./payment-config";

const chains = [mainnet] as const;

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
