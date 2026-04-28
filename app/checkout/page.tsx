"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Stripe, StripeCardElement } from "@stripe/stripe-js";

import { formatPrice } from "../../lib/format";
import { getProduct } from "../../lib/products";
import { getStripe } from "../../lib/stripe-client";
import { createClient, isSupabaseConfigured } from "../../lib/supabase/client";
import { useCart } from "../../components/cart-provider";
import { CryptoPaymentSection } from "../../components/crypto-payment";
import { isWalletConnectConfigured } from "../../lib/walletconnect";

const COUNTRIES = [
  "United Kingdom", "United States", "Australia", "Canada", "France",
  "Germany", "Ireland", "Italy", "Netherlands", "New Zealand",
  "Spain", "Sweden", "Switzerland", "United Arab Emirates", "Other",
];

const FULL_POSTCODE_RE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

type PostcodeLookupStatus = "idle" | "loading" | "found" | "not-found";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);

  const stripeRef = useRef<Stripe | null>(null);
  const cardRef = useRef<StripeCardElement | null>(null);
  const cardMountRef = useRef<HTMLDivElement>(null);

  const [stripeReady, setStripeReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<"card" | "crypto">("card");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [city, setCity] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("United Kingdom");

  // Postcode lookup
  const [postcodeSuggestions, setPostcodeSuggestions] = useState<string[]>([]);
  const [postcodeStatus, setPostcodeStatus] = useState<PostcodeLookupStatus>("idle");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const postcodeDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const postcodeLookupWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Pre-fill email from Supabase session
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      const u = data.session?.user;
      if (!u) return;
      setEmail(u.email ?? "");
      const fn = u.user_metadata?.first_name as string | undefined;
      if (fn) setFirstName(fn);
    }).catch(() => null);
  }, []);

  // Mount Stripe card element
  useEffect(() => {
    if (!mounted || !cardMountRef.current) return;

    let card: StripeCardElement | null = null;

    getStripe().then((stripe) => {
      if (!stripe || !cardMountRef.current) return;
      stripeRef.current = stripe;

      const elements = stripe.elements();
      card = elements.create("card", {
        style: {
          base: {
            fontFamily: "sans-serif",
            fontSize: "14px",
            color: "#111111",
            "::placeholder": { color: "#aaaaaa" },
          },
        },
      });
      card.mount(cardMountRef.current);
      cardRef.current = card;
      setStripeReady(true);
    });

    return () => {
      card?.destroy();
      cardRef.current = null;
    };
  }, [mounted]);

  // Close suggestions on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (
        postcodeLookupWrapRef.current &&
        !postcodeLookupWrapRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const lookupPostcode = useCallback(async (value: string) => {
    const v = value.trim();
    if (v.length < 2) {
      setPostcodeSuggestions([]);
      setShowSuggestions(false);
      setPostcodeStatus("idle");
      return;
    }

    if (FULL_POSTCODE_RE.test(v)) {
      // Full lookup
      setPostcodeStatus("loading");
      setShowSuggestions(false);
      try {
        const res = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(v)}`
        );
        const data = (await res.json()) as {
          status: number;
          result: { postcode: string; post_town: string } | null;
        };
        if (data.status === 200 && data.result) {
          const town = data.result.post_town
            .split(" ")
            .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
            .join(" ");
          setCity(town);
          setCountry("United Kingdom");
          setPostcode(data.result.postcode);
          setPostcodeStatus("found");
        } else {
          setPostcodeStatus("not-found");
        }
      } catch {
        setPostcodeStatus("not-found");
      }
    } else {
      // Autocomplete
      try {
        const res = await fetch(
          `https://api.postcodes.io/postcodes/${encodeURIComponent(v)}/autocomplete`
        );
        const data = (await res.json()) as {
          status: number;
          result: string[] | null;
        };
        const suggestions = (data.result ?? []).slice(0, 6);
        setPostcodeSuggestions(suggestions);
        setShowSuggestions(suggestions.length > 0);
        setPostcodeStatus("idle");
      } catch {
        setPostcodeSuggestions([]);
        setShowSuggestions(false);
      }
    }
  }, []); // state setters are stable

  const handlePostcodeChange = (value: string) => {
    setPostcode(value);
    setPostcodeStatus("idle");
    if (postcodeDebounceRef.current) clearTimeout(postcodeDebounceRef.current);
    postcodeDebounceRef.current = setTimeout(() => {
      lookupPostcode(value);
    }, 400);
  };

  const selectSuggestion = async (suggestion: string) => {
    setPostcode(suggestion);
    setShowSuggestions(false);
    setPostcodeSuggestions([]);
    await lookupPostcode(suggestion);
  };

  const lineItems = items
    .map((item) => {
      const product = getProduct(item.slug);
      if (!product) return null;
      return { ...item, product, lineTotal: product.price * item.quantity };
    })
    .filter(Boolean) as Array<{ slug: string; size: string; quantity: number; product: NonNullable<ReturnType<typeof getProduct>>; lineTotal: number }>;

  const subtotal = lineItems.reduce((sum, i) => sum + i.lineTotal, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!stripeRef.current || !cardRef.current) {
      setError("To place your order, please contact us at support@aryo.london and we will process it directly.");
      return;
    }

    if (!lineItems.length) {
      setError("Your cart is empty.");
      return;
    }

    setBusy(true);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          customerDetails: {
            firstName, lastName, email, phone,
            address: { line1: address1, line2: address2, city, postcode, country },
          },
        }),
      });

      const data = (await res.json()) as {
        clientSecret?: string;
        orderId?: string;
        message?: string;
        url?: string;
      };

      // Prototype mode — redirect directly
      if (data.url) {
        clearCart();
        window.location.href = data.url;
        return;
      }

      if (!res.ok || !data.clientSecret) {
        throw new Error(data.message || "Checkout failed.");
      }

      const { paymentIntent, error: stripeError } = await stripeRef.current.confirmCardPayment(
        data.clientSecret,
        { payment_method: { card: cardRef.current } }
      );

      if (stripeError) {
        throw new Error(stripeError.message);
      }

      if (paymentIntent?.status === "succeeded") {
        await fetch("/api/send-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: email,
            customerName: firstName,
            orderId: data.orderId,
            items: lineItems.map((i) => ({
              name: i.product.name,
              color: i.product.color,
              size: i.size,
              quantity: i.quantity,
              price: i.product.price,
              fulfillment: i.product.fulfillment,
            })),
            total: subtotal,
          }),
        }).catch(() => null);

        clearCart();
        router.push(
          `/order-confirmed?name=${encodeURIComponent(firstName)}&email=${encodeURIComponent(email)}&total=${subtotal}&orderId=${data.orderId ?? ""}`
        );
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setBusy(false);
    }
  };

  if (!mounted) return null;

  if (!lineItems.length) {
    return (
      <main className="checkout-page">
        <div className="checkout-empty">
          <p className="eyebrow">Checkout</p>
          <h1>Your bag is empty.</h1>
          <Link className="inline-link" href="/collections/pennicella">
            Browse Pennicella
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="checkout-page">
      <div className="checkout-inner">
        <p className="eyebrow">Checkout</p>
      </div>

      <form className="checkout-layout" onSubmit={handleSubmit}>
        {/* LEFT — Order summary */}
        <div className="checkout-summary">
          <p className="checkout-section-title">Order summary</p>
          <div className="checkout-summary-items">
            {lineItems.map((item) => (
              <div className="checkout-summary-item" key={`${item.slug}-${item.size}`}>
                <div className="checkout-summary-image">
                  <img src={item.product.cardImage} alt={item.product.name} />
                </div>
                <div className="checkout-summary-copy">
                  <strong>{item.product.name} / {item.product.color}</strong>
                  <span>Size {item.size} · Qty {item.quantity}</span>
                  {item.product.fulfillment === "made-to-order" && (
                    <em className="checkout-mto-note">Made to order — approx. 3 weeks</em>
                  )}
                </div>
                <span className="checkout-summary-price">{formatPrice(item.lineTotal)}</span>
              </div>
            ))}
          </div>

          <div className="checkout-summary-totals">
            <div className="checkout-summary-row">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="checkout-summary-row">
              <span>Shipping</span>
              <span>Complimentary</span>
            </div>
            <div className="checkout-summary-row checkout-summary-total">
              <strong>Total</strong>
              <strong>{formatPrice(subtotal)} GBP</strong>
            </div>
          </div>
        </div>

        {/* RIGHT — Customer form */}
        <div className="checkout-form-section">
          <p className="checkout-section-title">Your details</p>

          <div className="checkout-field-row">
            <div className="checkout-field">
              <label className="checkout-label" htmlFor="co-first-name">First name</label>
              <input
                id="co-first-name"
                className="checkout-input"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="checkout-field">
              <label className="checkout-label" htmlFor="co-last-name">Last name</label>
              <input
                id="co-last-name"
                className="checkout-input"
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>

          <div className="checkout-field">
            <label className="checkout-label" htmlFor="co-email">Email address</label>
            <input
              id="co-email"
              className="checkout-input"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="checkout-field">
            <label className="checkout-label" htmlFor="co-phone">Phone number <span className="checkout-optional">(optional)</span></label>
            <input
              id="co-phone"
              className="checkout-input"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <p className="checkout-section-title" style={{ marginTop: "2rem" }}>Shipping address</p>

          <div className="checkout-field">
            <label className="checkout-label" htmlFor="co-address1">Address line 1</label>
            <input
              id="co-address1"
              className="checkout-input"
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
            />
          </div>

          <div className="checkout-field">
            <label className="checkout-label" htmlFor="co-address2">Address line 2</label>
            <input
              id="co-address2"
              className="checkout-input"
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
            />
          </div>

          <div className="checkout-field-row">
            <div className="checkout-field">
              <label className="checkout-label" htmlFor="co-city">City</label>
              <input
                id="co-city"
                className="checkout-input"
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>

            {/* Postcode with lookup */}
            <div
              className="checkout-field"
              ref={postcodeLookupWrapRef}
              style={{ position: "relative" }}
            >
              <label className="checkout-label" htmlFor="co-postcode">
                Postcode
                {postcodeStatus === "loading" && (
                  <span className="postcode-lookup-indicator"> — looking up…</span>
                )}
              </label>
              <input
                id="co-postcode"
                className="checkout-input"
                type="text"
                required
                value={postcode}
                placeholder="e.g. SW1A 2AA"
                autoComplete="postal-code"
                onChange={(e) => handlePostcodeChange(e.target.value)}
                onFocus={() => postcodeSuggestions.length > 0 && setShowSuggestions(true)}
              />

              {showSuggestions && postcodeSuggestions.length > 0 && (
                <ul className="postcode-suggestions" role="listbox" aria-label="Postcode suggestions">
                  {postcodeSuggestions.map((s) => (
                    <li
                      key={s}
                      className="postcode-suggestion-item"
                      role="option"
                      onMouseDown={(e) => {
                        e.preventDefault(); // prevent blur before click
                        void selectSuggestion(s);
                      }}
                    >
                      {s}
                    </li>
                  ))}
                </ul>
              )}

              {postcodeStatus === "not-found" && (
                <p className="postcode-lookup-message">
                  Postcode not found — please enter your address manually.
                </p>
              )}
              {postcodeStatus === "found" && (
                <p className="postcode-lookup-message postcode-lookup-found">
                  Town and country filled automatically.
                </p>
              )}
            </div>
          </div>

          <div className="checkout-field">
            <label className="checkout-label" htmlFor="co-country">Country</label>
            <select
              id="co-country"
              className="checkout-input checkout-select"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="checkout-divider" />

          <p className="checkout-section-title">Payment</p>

          {/* Payment method tabs */}
          <div className="payment-tabs">
            <button
              type="button"
              className={`payment-tab ${paymentMethod === "card" ? "is-active" : ""}`}
              onClick={() => setPaymentMethod("card")}
            >
              Card
            </button>
            {isWalletConnectConfigured && (
              <button
                type="button"
                className={`payment-tab ${paymentMethod === "crypto" ? "is-active" : ""}`}
                onClick={() => setPaymentMethod("crypto")}
              >
                Crypto
              </button>
            )}
          </div>

          {/* Card payment */}
          {paymentMethod === "card" && (
            <>
              {mounted && !stripeReady ? (
                <div className="checkout-notice">
                  <p>
                    Online payment is coming soon. To place your order now, email us at{" "}
                    <a href="mailto:support@aryo.london">support@aryo.london</a> and we will process it directly.
                  </p>
                </div>
              ) : (
                <div className="checkout-stripe-wrap">
                  <div className="checkout-stripe-label">
                    <span>🔒</span>
                    <span>Secure payment powered by Stripe</span>
                  </div>
                  <div className="stripe-card-element" ref={cardMountRef} id="stripe-card-element" />
                </div>
              )}
              {error && <p className="checkout-error">{error}</p>}
              <button
                className="checkout-submit"
                type="submit"
                disabled={busy}
              >
                {busy ? "Processing…" : "Place order"}
              </button>
            </>
          )}

          {/* Crypto payment */}
          {paymentMethod === "crypto" && isWalletConnectConfigured && (
            <CryptoPaymentSection
              orderTotal={subtotal}
              firstName={firstName}
              lastName={lastName}
              email={email}
              items={lineItems.map((i) => ({
                slug: i.slug,
                size: i.size,
                quantity: i.quantity,
                name: i.product.name,
                color: i.product.color,
                price: i.product.price,
                fulfillment: i.product.fulfillment,
              }))}
              onClearCart={clearCart}
            />
          )}
        </div>
      </form>
    </main>
  );
}
