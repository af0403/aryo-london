"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
export const FooterSignupForm = () => {
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === "sending") return;
    setState("sending");
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, website }),
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.error || "Please try again later.");
      setState("sent");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again later.");
      setState("error");
    }
  }
  if (state === "sent")
    return (
      <p className="footer-signup-thanks" role="status">
        You are on the list.
      </p>
    );
  return (
    <>
      <form className="site-footer-signup-form" onSubmit={submit}>
        <label className="sr-only" htmlFor="footer-email">
          Your Email*
        </label>
        <input
          id="footer-email"
          name="email"
          type="email"
          placeholder="Your Email*"
          autoComplete="email"
          required
          maxLength={254}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="store-honeypot" aria-hidden="true">
          Website
          <input
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
          />
        </label>
        <button type="submit" disabled={state === "sending"}>
          {state === "sending" ? "Signing up…" : "Sign Up"}
        </button>
      </form>
      <p className="store-newsletter-consent">
        By signing up, you agree to receive ARYO updates. See our{" "}
        <Link href="/privacy">Privacy Policy</Link>.
      </p>
      {state === "error" ? (
        <p className="store-form-error" role="alert">
          {error}
        </p>
      ) : null}
    </>
  );
};
