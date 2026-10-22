"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import {
  useAccount,
  useDisconnect,
  useSendTransaction,
  useSwitchChain,
  useSignMessage,
} from "wagmi";
import { formatEther } from "viem";
import { cryptoAuthorisationMessage } from "../lib/commerce/crypto-message";
import type { CustomerDetails } from "../lib/commerce/security";
export type CryptoPaymentProps = {
  orderTotal: number;
  firstName: string;
  lastName: string;
  email: string;
  items: Array<{
    slug: string;
    size: string;
    quantity: number;
    name: string;
    color: string;
    price: number;
    fulfillment: string;
  }>;
  customerDetails: CustomerDetails;
  onClearCart: () => void;
};
type PendingPayment = { hash: string; quoteToken: string };
export function CryptoPaymentSection({
  orderTotal,
  items,
  customerDetails,
  onClearCart,
}: CryptoPaymentProps) {
  const { signMessageAsync } = useSignMessage();
  const attemptRef = useRef<string>("");
  const router = useRouter(),
    { open } = useWeb3Modal(),
    { address, isConnected, chainId } = useAccount(),
    { disconnect } = useDisconnect(),
    { sendTransactionAsync } = useSendTransaction(),
    { switchChainAsync } = useSwitchChain();
  const [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [status, setStatus] = useState(""),
    [pending, setPending] = useState<PendingPayment | null>(null),
    [quotedEth, setQuotedEth] = useState("");
  useEffect(() => {
    try {
      const value = sessionStorage.getItem("aryo-pending-crypto");
      if (value) {
        const data = JSON.parse(value);
        if (data.hash && data.quoteToken) setPending(data);
      }
    } catch {}
  }, []);
  async function verify(payment: PendingPayment) {
    const response = await fetch("/api/crypto/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        transactionHash: payment.hash,
        quoteToken: payment.quoteToken,
      }),
    });
    const data = await response.json();
    if (response.status === 202) {
      setStatus(
        data.message || "Waiting for confirmation. Check again shortly.",
      );
      return;
    }
    if (!response.ok)
      throw new Error(
        data.message ||
          "Verification is unavailable. Keep your transaction hash and try again.",
      );
    sessionStorage.removeItem("aryo-pending-crypto");
    onClearCart();
    router.push(
      `/order-confirmed?receipt=${encodeURIComponent(data.receiptToken)}`,
    );
  }
  useEffect(() => {
    if (!pending) return;
    let active = true;
    const timer = setInterval(() => {
      void verify(pending).catch((e) => {
        if (active)
          setError(
            e instanceof Error
              ? e.message
              : "Verification is pending. Keep your transaction reference.",
          );
      });
    }, 15000);
    return () => {
      active = false;
      clearInterval(timer);
    };
  }, [pending]);
  async function pay() {
    if (
      !pending &&
      !document
        .querySelector<HTMLFormElement>(".checkout-layout")
        ?.reportValidity()
    )
      return;
    setBusy(true);
    setError("");
    setStatus("");
    try {
      if (pending) {
        await verify(pending);
        return;
      }
      if (!address) throw new Error("Please connect your wallet.");
      if (chainId !== 1) await switchChainAsync({ chainId: 1 });
      if (!attemptRef.current) attemptRef.current = crypto.randomUUID();
      const timestamp = Math.floor(Date.now() / 1000);
      setStatus(
        "Approve the checkout request in your wallet. This signature does not transfer funds.",
      );
      const signature = await signMessageAsync({
        message: cryptoAuthorisationMessage({
          payer: address,
          attemptId: attemptRef.current,
          email: customerDetails.email,
          items,
          timestamp,
        }),
      });
      const response = await fetch("/api/crypto/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customerDetails,
          payer: address,
          attemptId: attemptRef.current,
          timestamp,
          signature,
        }),
      });
      const quote = await response.json();
      if (!response.ok) throw new Error(quote.message);
      setQuotedEth(formatEther(BigInt(quote.wei)));
      setStatus("Review the ETH amount and network fee in your wallet.");
      const hash = await sendTransactionAsync({
        to: quote.wallet,
        value: BigInt(quote.wei),
        chainId: 1,
      });
      const payment = { hash, quoteToken: quote.quoteToken };
      setPending(payment);
      sessionStorage.setItem("aryo-pending-crypto", JSON.stringify(payment));
      setStatus(
        "Transaction submitted. Your order is not confirmed until Ethereum verification completes.",
      );
      await verify(payment);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Payment could not be completed.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (!process.env.NEXT_PUBLIC_ARYO_WALLET_ADDRESS)
    return (
      <p>Crypto payment is temporarily unavailable. Please pay by card.</p>
    );
  return (
    <div className="crypto-payment-wrap">
      <p>
        Pay £{orderTotal.toFixed(2)} in ETH on Ethereum mainnet. Your wallet
        will display the exact amount and network fee before you approve. The
        quote is valid for 30 minutes.
      </p>
      {isConnected && (
        <div className="crypto-wallet-row">
          <span>
            {address?.slice(0, 6)}…{address?.slice(-4)}
          </span>
          <button
            type="button"
            className="crypto-change-wallet"
            disabled={busy || !!pending}
            onClick={() => disconnect()}
          >
            Disconnect
          </button>
        </div>
      )}
      {quotedEth && <p>{quotedEth} ETH · Ethereum mainnet</p>}
      {pending && (
        <p>
          Transaction submitted:{" "}
          <a
            className="inline-link"
            href={`https://etherscan.io/tx/${pending.hash}`}
            target="_blank"
            rel="noreferrer"
          >
            View transaction
          </a>
          . Keep this reference. Do not send another payment.
        </p>
      )}
      {status && <p role="status">{status}</p>}
      {error && (
        <p className="checkout-error" role="alert">
          {error}
        </p>
      )}
      {!isConnected && !pending ? (
        <button
          type="button"
          className="checkout-submit"
          onClick={() => void open()}
        >
          Connect wallet
        </button>
      ) : (
        <button
          type="button"
          className="checkout-submit"
          disabled={busy}
          onClick={() => void pay()}
        >
          {busy
            ? "Checking payment…"
            : pending
              ? "Check payment confirmation"
              : "Continue with ETH"}
        </button>
      )}
    </div>
  );
}
