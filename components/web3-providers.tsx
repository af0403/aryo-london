"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createWeb3Modal } from "@web3modal/wagmi/react";
import { useState } from "react";
import { WagmiProvider } from "wagmi";
import {
  isWalletConnectConfigured,
  wagmiConfig,
  walletConnectProjectId,
} from "../lib/walletconnect";

let modalInitialized = false;

function ensureModal() {
  if (modalInitialized || !isWalletConnectConfigured) return;
  createWeb3Modal({
    wagmiConfig,
    projectId: walletConnectProjectId,
    enableAnalytics: false,
    themeVariables: {
      "--w3m-font-family": "var(--font-body, sans-serif)",
      "--w3m-accent": "#111111",
      "--w3m-border-radius-master": "0px",
    },
  });
  modalInitialized = true;
}

export function Web3Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  useState(() => { ensureModal(); return null; });

  if (!isWalletConnectConfigured) {
    return <>{children}</>;
  }

  return (
    <WagmiProvider config={wagmiConfig} reconnectOnMount={false}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
