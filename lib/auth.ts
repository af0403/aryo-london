import { betterAuth } from "better-auth";
import { commercePool } from "./commerce/neon";
import { Resend } from "resend";
import { ORDER_FROM, SUPPORT_EMAIL, SITE_ORIGIN } from "./commerce/config";
import { escapeHtml } from "./commerce/orders";

async function accountEmail(email: string, url: string, reset = false) {
  const label = reset ? "Reset your password" : "Verify your email";
  const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
    from: ORDER_FROM,
    to: email,
    replyTo: SUPPORT_EMAIL,
    subject: `ARYO — ${label}`,
    text: `${label}\n\n${url}\n\nIf you did not request this, you can ignore this email.\nARYO London`,
    html: `<div style="font:14px/1.7 Arial,sans-serif;color:#111;max-width:540px;margin:auto;padding:40px 24px"><p style="font:40px Georgia,serif;letter-spacing:6px">ARYO</p><h1 style="font-size:24px;font-weight:400">${label}</h1><p><a style="color:#111" href="${escapeHtml(url)}">${label}</a></p><p>If you did not request this, you can ignore this email.</p><p>Client services: ${SUPPORT_EMAIL}</p></div>`,
  });
  if (error) throw new Error("Account email could not be sent.");
}
export const auth = betterAuth({
  appName: "ARYO",
  baseURL: process.env.BETTER_AUTH_URL || SITE_ORIGIN,
  secret: process.env.BETTER_AUTH_SECRET,
  database: process.env.DATABASE_URL ? commercePool() : undefined,
  trustedOrigins: [SITE_ORIGIN, "https://www.aryo.london"],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    minPasswordLength: 10,
    autoSignIn: false,
    sendResetPassword: async ({ user, url }) =>
      accountEmail(user.email, url, true),
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: false,
    expiresIn: 3600,
    sendVerificationEmail: async ({ user, url }) =>
      accountEmail(user.email, url),
  },
  rateLimit: { enabled: true, storage: "database", window: 60, max: 20 },
  session: { expiresIn: 60 * 60 * 24 * 7, updateAge: 60 * 60 * 24 },
});
