"use client";
import dynamic from "next/dynamic";
import type { CryptoPaymentProps } from "./crypto-payment";
const Web3Providers = dynamic(
  () => import("./web3-providers").then((m) => m.Web3Providers),
  { ssr: false },
);
const CryptoPaymentSection = dynamic(
  () => import("./crypto-payment").then((m) => m.CryptoPaymentSection),
  { ssr: false, loading: () => <p role="status">Loading wallet payment…</p> },
);
export function CryptoCheckout(props: CryptoPaymentProps) {
  return (
    <Web3Providers>
      <CryptoPaymentSection {...props} />
    </Web3Providers>
  );
}
