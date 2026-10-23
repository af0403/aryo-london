import { commercePool } from "../../../lib/commerce/neon";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  if (Number(request.headers.get("content-length") ?? 0) > 4096)
    return NextResponse.json({ error: "Invalid request." }, { status: 413 });
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin)
    return NextResponse.json({ error: "Invalid request." }, { status: 403 });
  let body: { email?: unknown; website?: unknown };
  try {
    const text = await request.text();
    if (text.length > 4096) throw new Error();
    body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }
  if (body.website) return NextResponse.json({ success: true });
  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254)
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 },
    );
  if (!process.env.DATABASE_URL)
    return NextResponse.json(
      { error: "Sign-up is temporarily unavailable. Please try again later." },
      { status: 503 },
    );
  try {
    await commercePool().query(
      `INSERT INTO public.newsletter_subscribers(email,consented_at,source) VALUES ($1,now(),'website') ON CONFLICT(email) DO NOTHING`,
      [email],
    );
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "We couldn't complete your sign-up. Please try again later." },
      { status: 503 },
    );
  }
}
