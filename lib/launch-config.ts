export const launchConfig = {
  brand: "ARYO",
  collection: "Pennicella | AF by ARYO",
  shipping: "Worldwide shipping.",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "Support email landing shortly",
  supportHref: process.env.NEXT_PUBLIC_SUPPORT_EMAIL
    ? `mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`
    : "https://instagram.com/aryolondon",
  checkoutMode: process.env.NEXT_PUBLIC_CHECKOUT_MODE || "prototype",
  integrations: {
    stripeReady: false,
    supabaseReady: Boolean(
      process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  },
};
