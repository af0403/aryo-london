import type { ReactNode } from "react";

import { createNoIndexMetadata } from "../../lib/seo";

export const metadata = createNoIndexMetadata({
  title: "Account",
  description: "Private ARYO customer account area.",
  path: "/account",
});

export default function AccountLayout({ children }: { children: ReactNode }) {
  return children;
}
