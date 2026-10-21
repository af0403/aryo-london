import Link from "next/link";
import { FooterSignupForm } from "../footer-signup-form";
const columns = [
  {
    title: "About ARYO",
    links: [
      ["The House", "/about"],
      ["Story", "/story"],
      ["Campaign", "/campaign"],
      ["Collections", "/collections"],
    ],
  },
  {
    title: "Help",
    links: [
      ["Client Services", "/contact"],
      ["Contact", "/contact"],
      ["Shipping", "/shipping"],
      ["Returns", "/returns"],
      ["Size Guide", "/size-guide"],
      ["FAQs", "/faqs"],
      ["Terms of Use", "/terms"],
      ["Privacy Policy", "/privacy"],
    ],
  },
  {
    title: "Connect",
    links: [["Instagram", "https://instagram.com/aryolondon"]],
  },
];
export function StoreFooter() {
  return (
    <footer className="house-footer">
      <div className="house-footer-grid">
        {columns.map((col) => (
          <div className="house-footer-column" key={col.title}>
            <h2>{col.title}</h2>
            <nav aria-label={col.title}>
              {col.links.map(([label, href]) => (
                <Link
                  href={href}
                  key={label}
                  {...(href.startsWith("http")
                    ? { target: "_blank", rel: "noreferrer" }
                    : {})}
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
        <div className="house-footer-signup">
          <h2>Be the first to access ARYO launches and events</h2>
          <FooterSignupForm />
        </div>
      </div>
      <div className="house-footer-base">
        <span>© {new Date().getFullYear()} ARYO London</span>
        <span>United Kingdom / English / GBP £</span>
      </div>
    </footer>
  );
}
