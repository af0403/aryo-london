import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms of use for ARYO London.",
};

export default function TermsPage() {
  return (
    <main className="section">
      <div className="page-intro">
        <p className="eyebrow">Legal</p>
        <h1 className="page-title">Terms of Use</h1>
        <p>
          By accessing and using this website, you accept and agree to be bound by the terms and conditions set out
          below.
        </p>
      </div>
      <div className="info-layout">
        <div className="info-card">
          <strong className="client-services-head">Use of this site</strong>
          <p>
            This website is operated by ARYO London. The content of the pages of this website is for your general
            information and use only. It is subject to change without notice.
          </p>
        </div>
        <div className="info-card">
          <strong className="client-services-head">Intellectual property</strong>
          <p>
            All intellectual property rights in this website and its content, including all text, images, and design
            elements, are owned by or licensed to ARYO London. Unauthorised use is strictly prohibited.
          </p>
        </div>
        <div className="info-card">
          <strong className="client-services-head">Limitation of liability</strong>
          <p>
            ARYO London shall not be liable for any damages arising out of or in connection with the use of this
            website. This limitation applies to the fullest extent permitted by law.
          </p>
        </div>
        <div className="info-card">
          <strong className="client-services-head">Governing law</strong>
          <p>
            These terms are governed by the laws of England and Wales. Any disputes shall be subject to the exclusive
            jurisdiction of the courts of England and Wales.
          </p>
        </div>
      </div>
    </main>
  );
}
