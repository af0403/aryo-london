"use client";

import Link from "next/link";
import { authClient } from "../lib/auth-client";
import { AccountIcon } from "./site-icons";

export const HeaderAccountButton = () => {
  const { data } = authClient.useSession();
  const user = data?.user;

  const initials = user
    ? (() => {
        const firstName = user.name || "";
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
