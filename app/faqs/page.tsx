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
    a: "Message us directly on Instagram @aryolondon. We aim to respond as quickly as possible.",
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
          <div className="info-card" key={q}>
            <strong className="client-services-head">{q}</strong>
            <p>{a}</p>
          </div>
        ))}
      </div>
    </main>
  );
}
