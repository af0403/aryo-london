import type { ReactNode } from "react";

import { createNoIndexMetadata } from "../../lib/seo";

export const metadata = createNoIndexMetadata({
  title: "Checkout",
  description: "Private ARYO checkout flow.",
  path: "/checkout",
});

export default function CheckoutLayout({ children }: { children: ReactNode }) {
  return children;
}
