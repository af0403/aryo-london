import { ServiceNav } from "../../components/storefront/service-nav";
import { createPageMetadata } from "../../lib/seo";

export const metadata = createPageMetadata({
  title: "Privacy Policy",
  description:
    "Read the ARYO London privacy policy covering data collection, use, and cookies.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <main className="section">
      <ServiceNav />
      <div className="page-intro">
        <p className="eyebrow">Legal</p>
        <h1 className="page-title">Privacy Policy</h1>
        <p>
          ARYO London is committed to protecting your personal data. This policy
          explains how we collect, use, and safeguard your information when you
          visit our website or make a purchase.
        </p>
      </div>
      <div className="info-layout">
        <div className="info-card">
          <strong className="client-services-head">Data we collect</strong>
          <p>
            We collect information you provide directly to us — such as your
            name, email address, shipping address, and payment details when you
            place an order or sign up for our newsletter.
          </p>
        </div>
        <div className="info-card">
          <strong className="client-services-head">How we use your data</strong>
          <p>
            Your data is used to process orders, communicate with you about your
            purchases, and — if you have opted in — to send you updates about
            new collections and events.
          </p>
        </div>
        <div className="info-card">
          <strong className="client-services-head">Data sharing</strong>
          <p>
            We do not sell your personal data. We share data only with service
            providers necessary to fulfil your order (e.g. payment processors,
            delivery partners) and, if you accept analytics cookies, with
            Google, which provides our site analytics.
          </p>
        </div>
        <div className="info-card">
          <strong className="client-services-head">Your rights</strong>
          <p>
            You have the right to access, correct, or delete your personal data
            at any time. To exercise these rights, please contact us via the
            form on our website.
          </p>
        </div>
        <div className="info-card">
          <strong className="client-services-head">Cookies</strong>
          <p>
            Essential cookies and browser storage keep this site working. They
            hold your bag, saved pieces and recently viewed items on your
            device, and our payment provider uses them at checkout to prevent
            fraud. With your acceptance, Google Analytics sets cookies that
            count visits, pages viewed, how you arrived, your type of device,
            your approximate location and how pages are used, such as
            scrolling and links followed. Two actions are also counted: adding
            to the bag and going to checkout. Reject them and they are not
            set. Change your choice at any time under Cookie settings, at the
            foot of every page. No advertising cookies are used.
          </p>
        </div>
      </div>
    </main>
  );
}
