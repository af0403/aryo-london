"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "../../lib/supabase/client";
import { formatPrice } from "../../lib/format";

type Tab = "signin" | "create";

type Order = {
  id: string;
  created_at: string;
  total_pence: number;
  status: string;
  items: Array<{ name: string; color: string; size: string; quantity: number }>;
};

export default function AccountPage() {
  const [tab, setTab] = useState<Tab>("signin");
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Sign in fields
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Create account fields
  const [firstName, setFirstName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!isSupabaseConfigured) { setLoading(false); return; }
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user || !isSupabaseConfigured) return;
    const supabase = createClient();
    supabase
      .from("customer_orders")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setOrders((data as Order[]) ?? []));
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) { setError("Supabase is not configured yet."); return; }
    setError(null);
    setBusy(true);
    const { error: err } = await createClient().auth.signInWithPassword({
      email: signInEmail,
      password: signInPassword,
    });
    setBusy(false);
    if (err) setError(err.message);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSupabaseConfigured) { setError("Supabase is not configured yet."); return; }
    setError(null);
    if (createPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setBusy(true);
    const { error: err } = await createClient().auth.signUp({
      email: createEmail,
      password: createPassword,
      options: { data: { first_name: firstName } },
    });
    setBusy(false);
    if (err) setError(err.message);
    else setSuccess("Account created. Check your email to confirm, then sign in.");
  };

  const handleForgotPassword = async () => {
    if (!isSupabaseConfigured) { setError("Supabase is not configured yet."); return; }
    if (!signInEmail) {
      setError("Enter your email address above first.");
      return;
    }
    setError(null);
    await createClient().auth.resetPasswordForEmail(signInEmail, {
      redirectTo: `${window.location.origin}/account`,
    });
    setSuccess("Password reset link sent — check your inbox.");
  };

  const handleSignOut = async () => {
    if (isSupabaseConfigured) await createClient().auth.signOut();
    setOrders([]);
    setUser(null);
  };

  if (loading) {
    return (
      <main className="account-page">
        <div className="account-inner" />
      </main>
    );
  }

  if (user) {
    const firstName = (user.user_metadata?.first_name as string) || "";
    const email = user.email ?? "";

    return (
      <main className="account-page">
        <div className="account-inner">
          <p className="eyebrow">Your account</p>
          <h1 className="account-welcome">
            {firstName ? `Welcome back, ${firstName}.` : "Welcome back."}
          </h1>

          <div className="account-meta">
            <span>{email}</span>
          </div>

          <div className="account-section">
            <p className="account-section-title">Order history</p>
            {orders.length === 0 ? (
              <p className="account-orders-empty">No orders yet.</p>
            ) : (
              <div className="account-orders">
                {orders.map((order) => (
                  <div className="account-order-row" key={order.id}>
                    <div className="account-order-meta">
                      <span>{new Date(order.created_at).toLocaleDateString("en-GB")}</span>
                      <span className="account-order-status">{order.status}</span>
                    </div>
                    <strong>{formatPrice(order.total_pence / 100)}</strong>
                    <div className="account-order-items">
                      {(order.items || []).map((item, i) => (
                        <span key={i}>
                          {item.name} / {item.color} / {item.size}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="account-actions">
            <button className="account-signout" type="button" onClick={handleSignOut}>
              Sign out
            </button>
            <Link className="account-link" href="/collections/pennicella">
              Shop Pennicella
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="account-page">
      <div className="account-inner">
        <p className="eyebrow">Your account</p>

        <div className="account-tabs">
          <button
            className={`account-tab-btn ${tab === "signin" ? "is-active" : ""}`}
            type="button"
            onClick={() => { setTab("signin"); setError(null); setSuccess(null); }}
          >
            Sign in
          </button>
          <button
            className={`account-tab-btn ${tab === "create" ? "is-active" : ""}`}
            type="button"
            onClick={() => { setTab("create"); setError(null); setSuccess(null); }}
          >
            Create account
          </button>
        </div>

        {error && <p className="account-error">{error}</p>}
        {success && <p className="account-success">{success}</p>}

        {tab === "signin" ? (
          <form className="account-form" onSubmit={handleSignIn}>
            <div className="account-field">
              <label className="account-label" htmlFor="signin-email">Email address</label>
              <input
                id="signin-email"
                className="account-input"
                type="email"
                required
                autoComplete="email"
                value={signInEmail}
                onChange={(e) => setSignInEmail(e.target.value)}
              />
            </div>
            <div className="account-field">
              <label className="account-label" htmlFor="signin-password">Password</label>
              <input
                id="signin-password"
                className="account-input"
                type="password"
                required
                autoComplete="current-password"
                value={signInPassword}
                onChange={(e) => setSignInPassword(e.target.value)}
              />
            </div>
            <button className="account-submit" type="submit" disabled={busy}>
              {busy ? "Signing in…" : "Sign in"}
            </button>
            <button
              className="account-forgot"
              type="button"
              onClick={handleForgotPassword}
            >
              Forgot password?
            </button>
          </form>
        ) : (
          <form className="account-form" onSubmit={handleCreate}>
            <div className="account-field">
              <label className="account-label" htmlFor="first-name">First name</label>
              <input
                id="first-name"
                className="account-input"
                type="text"
                required
                autoComplete="given-name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="account-field">
              <label className="account-label" htmlFor="create-email">Email address</label>
              <input
                id="create-email"
                className="account-input"
                type="email"
                required
                autoComplete="email"
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
              />
            </div>
            <div className="account-field">
              <label className="account-label" htmlFor="create-password">Password</label>
              <input
                id="create-password"
                className="account-input"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
              />
            </div>
            <div className="account-field">
              <label className="account-label" htmlFor="confirm-password">Confirm password</label>
              <input
                id="confirm-password"
                className="account-input"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button className="account-submit" type="submit" disabled={busy}>
              {busy ? "Creating account…" : "Create account"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
