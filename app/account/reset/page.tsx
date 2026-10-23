"use client";
import { useState } from "react";
import Link from "next/link";
import { authClient } from "../../../lib/auth-client";
export default function ResetPassword() {
  const [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [done, setDone] = useState(false);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    try {
      const token = new URLSearchParams(window.location.search).get("token");
      if (!token) throw new Error("Missing reset token");
      const { error } = await authClient.resetPassword({
        newPassword: password,
        token,
      });
      if (error) throw error;
      setDone(true);
    } catch {
      setError(
        "Your password could not be updated. Please try again or request a new reset link.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <main className="account-page">
      <div className="account-inner">
        <h1 className="account-heading">Reset password</h1>
        {done ? (
          <>
            <p>Your password has been updated.</p>
            <Link href="/account">Return to your account</Link>
          </>
        ) : (
          <form className="account-form" onSubmit={submit}>
            <label className="checkout-label" htmlFor="new-password">
              New password
            </label>
            <input
              id="new-password"
              className="checkout-input"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <label className="checkout-label" htmlFor="confirm-password">
              Confirm password
            </label>
            <input
              id="confirm-password"
              className="checkout-input"
              type="password"
              autoComplete="new-password"
              minLength={10}
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />
            {error && (
              <p role="alert" className="checkout-error">
                {error}
              </p>
            )}
            <button className="checkout-submit" disabled={busy}>
              {busy ? "Updating…" : "Update password"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
