export const launchConfig = {
  brand: "ARYO",
  collection: "Pennicella | AF by ARYO",
  shipping: "Worldwide shipping.",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@aryo.london",
  supportHref: `mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@aryo.london"}`,
  checkoutMode: process.env.NEXT_PUBLIC_CHECKOUT_MODE || "live",
  integrations: {
    stripeReady: Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY),
    supabaseReady: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    ),
  },
};
