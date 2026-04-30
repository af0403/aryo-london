"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useAccount, useSendTransaction } from "wagmi";
import { parseEther } from "viem";
import { createClient, isSupabaseConfigured } from "../lib/supabase/client";

type OrderItem = {
  slug: string;
  size: string;
  quantity: number;
  name: string;
  color: string;
  price: number;
  fulfillment: string;
};

type CryptoPaymentProps = {
  orderTotal: number;
  firstName: string;
  lastName: string;
  email: string;
  items: OrderItem[];
  onClearCart: () => void;
};

export function CryptoPaymentSection({
  orderTotal,
  firstName,
  lastName,
  email,
  items,
  onClearCart,
}: CryptoPaymentProps) {
  const router = useRouter();
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const {
    sendTransaction,
    data: txHash,
    isPending,
    isError,
    error,
    reset,
  } = useSendTransaction();

  const [ethPriceGbp, setEthPriceGbp] = useState<number | null>(null);
  const [priceLoading, setPriceLoading] = useState(false);
  const [priceFailed, setPriceFailed] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  const aryoWallet = process.env.NEXT_PUBLIC_ARYO_WALLET_ADDRESS;

  const fetchEthPrice = () => {
    setPriceLoading(true);
    setPriceFailed(false);
    fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=gbp")
      .then((r) => r.json())
      .then((data) => {
        const rate = (data as { ethereum?: { gbp?: number } })?.ethereum?.gbp;
        if (rate) {
          setEthPriceGbp(rate);
        } else {
          setPriceFailed(true);
        }
      })
      .catch(() => setPriceFailed(true))
      .finally(() => setPriceLoading(false));
  };

  // Fetch price immediately on mount and again whenever wallet connects
  useEffect(() => { fetchEthPrice(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (isConnected && !ethPriceGbp) fetchEthPrice(); }, [isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  // On transaction hash received, save order and redirect
  useEffect(() => {
    if (!txHash || redirecting) return;
    setRedirecting(true);

    const finish = async () => {
      if (isSupabaseConfigured) {
        try {
          const supabase = createClient();
          await supabase.from("customer_orders").insert({
            customer_email: email,
            customer_name: `${firstName} ${lastName}`.trim(),
            items: items.map((i) => ({
              name: i.name,
              color: i.color,
              size: i.size,
              quantity: i.quantity,
              price: i.price,
            })),
            total_pence: Math.round(orderTotal * 100),
            stripe_payment_intent_id: txHash,
            payment_method: "crypto",
            status: "pending_confirmation",
          });
        } catch {
          // non-fatal — still redirect
        }
      }

      onClearCart();
      router.push(
        `/order-confirmed?name=${encodeURIComponent(firstName)}&email=${encodeURIComponent(email)}&total=${orderTotal}`
      );
    };

    void finish();
  }, [txHash]); // eslint-disable-line react-hooks/exhaustive-deps

  const ethAmount = ethPriceGbp ? orderTotal / ethPriceGbp : null;

  const handlePay = () => {
    if (!aryoWallet || !ethAmount) return;
    reset();
    sendTransaction({
      to: aryoWallet as `0x${string}`,
      value: parseEther(ethAmount.toFixed(8)),
    });
  };

  if (!aryoWallet) {
    return (
      <div className="checkout-notice">
        <p>
          Crypto payments are not yet configured. Please pay by card or email{" "}
          <a href="mailto:support@aryo.london">support@aryo.london</a>.
        </p>
      </div>
    );
  }

  if (redirecting) {
    return (
      <div className="crypto-confirming">
        <p className="eyebrow">Transaction submitted</p>
        <p className="crypto-tx-note">
          Transaction hash:{" "}
          <a
            href={`https://etherscan.io/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
            className="inline-link"
          >
            {txHash ? `${txHash.slice(0, 10)}…${txHash.slice(-8)}` : ""}
          </a>
        </p>
        <p className="crypto-confirming-note">Confirming your order…</p>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <>
        {priceLoading && (
          <p className="crypto-price-loading">Fetching live ETH price…</p>
        )}
        {ethPriceGbp && !priceLoading && (
          <div className="crypto-amount-display">
            <span className="crypto-amount-gbp">£{orderTotal.toFixed(2)}</span>
            <span className="crypto-amount-sep"> ≈ </span>
            <span className="crypto-amount-eth">{(orderTotal / ethPriceGbp).toFixed(6)} ETH</span>
          </div>
        )}
        {priceFailed && !priceLoading && (
          <p className="crypto-price-error">
            Could not fetch ETH price.{" "}
            <button type="button" className="crypto-retry-btn" onClick={fetchEthPrice}>Retry</button>
          </p>
        )}
        <p className="crypto-connect-hint">
          Connect your wallet to pay in ETH. MetaMask, Coinbase Wallet,
          Rainbow, and 300+ wallets supported.
        </p>
        <button
          className="checkout-submit"
          type="button"
          onClick={() => void open()}
        >
          Connect Wallet
        </button>
      </>
    );
  }

  return (
    <div className="crypto-payment-wrap">
      <div className="crypto-wallet-row">
        <span className="crypto-wallet-label">Connected</span>
        <span className="crypto-wallet-address">
          {address
            ? `${address.slice(0, 6)}…${address.slice(-4)}`
            : ""}
        </span>
        <button
          className="crypto-change-wallet"
          type="button"
          onClick={() => void open()}
        >
          Change
        </button>
      </div>

      {priceLoading && (
        <p className="crypto-price-loading">Fetching live ETH price…</p>
      )}

      {ethAmount && !priceLoading && (
        <div className="crypto-amount-display">
          <span className="crypto-amount-gbp">£{orderTotal.toFixed(2)}</span>
          <span className="crypto-amount-sep"> ≈ </span>
          <span className="crypto-amount-eth">{ethAmount.toFixed(6)} ETH</span>
        </div>
      )}

      {!priceLoading && !ethAmount && (
        <p className="crypto-price-error">
          Could not fetch ETH price.{" "}
          <button type="button" className="crypto-retry-btn" onClick={fetchEthPrice}>Retry</button>
          {" "}or use card payment.
        </p>
      )}

      {isError && (
        <p className="checkout-error">
          {error?.message ?? "Transaction failed. Please try again."}
        </p>
      )}

      <button
        className="checkout-submit"
        type="button"
        onClick={handlePay}
        disabled={!ethAmount || isPending || !aryoWallet}
      >
        {isPending ? "Confirm in your wallet…" : "Pay with Crypto"}
      </button>
    </div>
  );
}
