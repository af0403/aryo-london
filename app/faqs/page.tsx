import { ServiceNav } from "../../components/storefront/service-nav";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "FAQs",
  description:
    "Read frequently asked questions about ARYO sizing, made-to-order pieces, returns, and international shipping.",
  path: "/faqs",
});

const FAQS = [
  {
    q: "How do I find my size?",
    a: "A full size guide with measurements is available on our Size Guide page. If you are between sizes, we recommend sizing up. For direct sizing help, message us on Instagram @aryolondon.",
  },
  {
    q: "What is made-to-order?",
    a: "Made-to-order pieces are produced only after your order is placed. This typically adds 2–4 weeks to dispatch. You will be notified by email when your piece is ready.",
  },
  {
    q: "Can I return or exchange an item?",
    a: "We accept returns within 14 days of delivery. Items must be unworn, unwashed, and in original packaging. Please visit our Shipping & Returns page for full details.",
  },
  {
    q: "Do you ship internationally?",
    a: "Yes — we offer complimentary worldwide shipping on all orders.",
  },
  {
    q: "How can I contact client services?",
    a: "Email support@aryo.london for order, delivery, returns and sizing enquiries. Include your order reference where available.",
  },
];

export default function FAQsPage() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: {
        "@type": "Answer",
        text: a,
      },
    })),
  };

  return (
    <main className="section">
      <ServiceNav />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="page-intro">
        <p className="eyebrow">Client Services</p>
        <h1 className="page-title">FAQs</h1>
      </div>
      <div className="info-layout">
        {FAQS.map(({ q, a }) => (
          <details className="info-card store-faq" key={q}>
            <summary className="client-services-head">{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </div>
    </main>
  );
}
