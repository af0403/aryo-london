"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient, isSupabaseConfigured } from "../lib/supabase/client";
import { AccountIcon } from "./site-icons";

export const HeaderAccountButton = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured) return;
    const supabase = createClient();

    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const initials = user
    ? (() => {
        const firstName = (user.user_metadata?.first_name as string) || "";
        const email = user.email ?? "";
        if (firstName) return firstName[0].toUpperCase();
        return email[0]?.toUpperCase() ?? "A";
      })()
    : null;

  return (
    <Link className="icon-button" href="/account" aria-label="Account">
      {initials ? (
        <span className="header-initials-circle">{initials}</span>
      ) : (
        <AccountIcon className="site-icon" />
      )}
    </Link>
  );
};
