import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about ARYO London.",
};

const FAQS = [
  {
    q: "How do I find my size?",
    a: "A full size guide with measurements is available on our Size Guide page. If you are between sizes, we recommend sizing up. You can also email us at support@aryo.london.",
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
    a: "Email us directly at support@aryo.london. We aim to respond within one business day.",
  },
];

export default function FAQsPage() {
  return (
    <main className="section">
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
