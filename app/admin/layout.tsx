import type { ReactNode } from "react";

import { createNoIndexMetadata } from "../../lib/seo";

export const metadata = createNoIndexMetadata({
  title: "Admin",
  description: "Private ARYO operations area.",
  path: "/admin",
});

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
