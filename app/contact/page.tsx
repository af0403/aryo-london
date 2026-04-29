"use client";

import { useState } from "react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "contact", name, email, message }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <main className="section info-page">
      <div className="page-intro">
        <p className="eyebrow">Contact</p>
        <h1 className="page-title">Client services is here for every order question.</h1>
        <p>
          Reach client services directly for order questions, shipping updates, returns, and sizing guidance.
        </p>
      </div>

      <div className="info-layout">
        <article className="info-card">
          <p className="eyebrow">Email</p>
          <h2>Get in touch.</h2>
          <p>
            <a href="mailto:support@aryo.london">support@aryo.london</a>
          </p>
          <p>
            For fastest response, Instagram DM is also available at{" "}
            <a href="https://instagram.com/aryolondon" target="_blank" rel="noreferrer">
              @aryolondon
            </a>
            .
          </p>
        </article>

        <article className="info-card">
          <p className="eyebrow">Support scope</p>
          <h2>What client services covers.</h2>
          <ul className="info-list">
            <li>Order questions</li>
            <li>Shipping updates</li>
            <li>Return requests</li>
            <li>Size and product guidance</li>
          </ul>
        </article>
      </div>

      <div className="contact-form-wrap">
        <p className="checkout-section-title" style={{ marginBottom: "1.5rem" }}>Send a message</p>

        {status === "sent" ? (
          <p className="contact-success">Thank you — we&rsquo;ll be in touch within 24 hours.</p>
        ) : (
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form-row">
              <div className="checkout-field">
                <label className="checkout-label" htmlFor="cf-name">Name</label>
                <input
                  id="cf-name"
                  className="checkout-input"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="checkout-field">
                <label className="checkout-label" htmlFor="cf-email">Email address</label>
                <input
                  id="cf-email"
                  className="checkout-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="checkout-field">
              <label className="checkout-label" htmlFor="cf-message">Message</label>
              <textarea
                id="cf-message"
                className="checkout-input contact-textarea"
                required
                rows={5}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            {status === "error" && (
              <p className="checkout-error">
                Something went wrong — please email{" "}
                <a href="mailto:support@aryo.london">support@aryo.london</a> directly.
              </p>
            )}

            <button
              className="checkout-submit contact-submit"
              type="submit"
              disabled={status === "sending"}
            >
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
