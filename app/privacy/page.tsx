import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for ARYO London.",
};

export default function PrivacyPage() {
  return (
    <main className="section">
      <div className="page-intro">
        <p className="eyebrow">Legal</p>
        <h1 className="page-title">Privacy Policy</h1>
        <p>
          ARYO London is committed to protecting your personal data. This policy explains how we collect, use, and
          safeguard your information when you visit our website or make a purchase.
        </p>
      </div>
      <div className="info-layout">
        <div className="info-card">
          <strong className="client-services-head">Data we collect</strong>
          <p>
            We collect information you provide directly to us — such as your name, email address, shipping address,
            and payment details when you place an order or sign up for our newsletter.
          </p>
        </div>
        <div className="info-card">
          <strong className="client-services-head">How we use your data</strong>
          <p>
            Your data is used to process orders, communicate with you about your purchases, and — if you have opted
            in — to send you updates about new collections and events.
          </p>
        </div>
        <div className="info-card">
          <strong className="client-services-head">Data sharing</strong>
          <p>
            We do not sell your personal data. We share data only with service providers necessary to fulfil your
            order (e.g. payment processors, delivery partners).
          </p>
        </div>
        <div className="info-card">
          <strong className="client-services-head">Your rights</strong>
          <p>
            You have the right to access, correct, or delete your personal data at any time. To exercise these
            rights, please contact us via the form on our website.
          </p>
        </div>
        <div className="info-card">
          <strong className="client-services-head">Cookies</strong>
          <p>
            We use essential cookies to operate this site. No third-party advertising cookies are used without your
            explicit consent.
          </p>
        </div>
      </div>
    </main>
  );
}
