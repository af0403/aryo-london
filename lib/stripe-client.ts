import { loadStripe } from "@stripe/stripe-js";
import type { Stripe } from "@stripe/stripe-js";

// Evaluate at module load time — guarantees NEXT_PUBLIC_ substitution
// happens when the module is first imported, not inside a callback.
// This is the pattern recommended by Stripe's own documentation.
const key = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? "";

export const stripeEnabled =
  key.startsWith("pk_test_") || key.startsWith("pk_live_");

export const stripePromise: Promise<Stripe | null> = stripeEnabled
  ? loadStripe(key)
  : Promise.resolve(null);
