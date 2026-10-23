"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
const links = [
  ["/contact", "Contact"],
  ["/shipping", "Delivery"],
  ["/returns", "Returns"],
  ["/size-guide", "Size guide"],
  ["/faqs", "FAQs"],
];
export function ServiceNav() {
  const path = usePathname();
  return (
    <nav className="store-service-nav" aria-label="Client services">
      {links.map(([href, label]) => (
        <Link
          key={href}
          href={href}
          aria-current={path === href ? "page" : undefined}
        >
          {label}
        </Link>
      ))}
    </nav>
  );
}
