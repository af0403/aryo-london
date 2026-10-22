import { createHmac, timingSafeEqual } from "node:crypto";

function signingKey() {
  const key =
    process.env.CHECKOUT_SIGNING_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.STRIPE_SECRET_KEY;
  if (!key || key.includes("placeholder"))
    throw new Error("Order verification is unavailable.");
  return key;
}
export function signToken(
  value: Record<string, unknown>,
  purpose: string,
  seconds = 2592000,
) {
  const body = Buffer.from(
    JSON.stringify({ ...value, exp: Math.floor(Date.now() / 1000) + seconds }),
  ).toString("base64url");
  return `${body}.${createHmac("sha256", signingKey()).update(`${purpose}:${body}`).digest("base64url")}`;
}
export function readToken<T>(token: string, purpose: string): T {
  if (token.length > 16000) throw new Error("Invalid order link.");
  const [body, signature, extra] = token.split(".");
  if (!body || !signature || extra) throw new Error("Invalid order link.");
  const expected = createHmac("sha256", signingKey())
    .update(`${purpose}:${body}`)
    .digest();
  const provided = Buffer.from(signature, "base64url");
  if (
    provided.length !== expected.length ||
    !timingSafeEqual(provided, expected)
  )
    throw new Error("Invalid order link.");
  const data = JSON.parse(Buffer.from(body, "base64url").toString());
  if (!Number.isFinite(data.exp) || data.exp < Date.now() / 1000)
    throw new Error(
      "This order link has expired. Please contact client services.",
    );
  return data as T;
}
export async function readCheckoutBody(request: Request) {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    throw new Error("Please submit from the ARYO website.");
  const text = await request.text();
  if (text.length > 24000) throw new Error("Request is too large.");
  return JSON.parse(text);
}
export type CustomerDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address: {
    line1: string;
    line2?: string;
    city: string;
    postcode: string;
    country: string;
  };
};
export function validateCustomer(input: unknown): CustomerDetails {
  if (!input || typeof input !== "object")
    throw new Error("Please complete your contact and delivery details.");
  const data = input as CustomerDetails;
  for (const field of [
    data.firstName,
    data.lastName,
    data.email,
    data.address?.line1,
    data.address?.city,
    data.address?.postcode,
    data.address?.country,
  ]) {
    if (typeof field !== "string" || !field.trim() || field.length > 200)
      throw new Error("Please complete your contact and delivery details.");
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    throw new Error("Please enter a valid email address.");
  if (data.address.country === "Other")
    throw new Error("Please enter your delivery country.");
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    email: data.email.trim().toLowerCase(),
    phone: typeof data.phone === "string" ? data.phone.slice(0, 40) : "",
    address: {
      line1: data.address.line1.trim(),
      line2:
        typeof data.address.line2 === "string"
          ? data.address.line2.slice(0, 200)
          : "",
      city: data.address.city.trim(),
      postcode: data.address.postcode.trim(),
      country: data.address.country.trim(),
    },
  };
}
