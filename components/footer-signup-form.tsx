"use client";

import { useState } from "react";

export const FooterSignupForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (!email.includes("@")) return;
    setSubmitted(true);
  };

  if (submitted) {
    return <p className="footer-signup-thanks">You are on the list.</p>;
  }

  return (
    <div className="site-footer-signup-form">
      <label className="sr-only" htmlFor="footer-email">
        Your Email*
      </label>
      <input
        id="footer-email"
        name="email"
        type="email"
        placeholder="Your Email*"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <button type="button" onClick={handleSubmit}>
        Sign Up
      </button>
    </div>
  );
};
