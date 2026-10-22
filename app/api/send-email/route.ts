import { NextResponse } from "next/server";
import { Resend } from "resend";
import { ORDER_FROM, SUPPORT_EMAIL } from "../../../lib/commerce/config";
import { escapeHtml } from "../../../lib/commerce/orders";
import { readCheckoutBody } from "../../../lib/commerce/security";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = await readCheckoutBody(request);
    // Payment confirmations are created only by the verified order service.
    if (body?.type !== "contact")
      return NextResponse.json(
        { message: "Payment verification is required." },
        { status: 403 },
      );
    const { name, email, message } = body;
    if (
      typeof name !== "string" ||
      !name.trim() ||
      name.length > 120 ||
      typeof email !== "string" ||
      email.length > 254 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      typeof message !== "string" ||
      !message.trim() ||
      message.length > 6000
    )
      return NextResponse.json(
        { message: "Please complete the name, email and message fields." },
        { status: 400 },
      );
    if (body.website) return NextResponse.json({ ok: true });
    if (!process.env.RESEND_API_KEY)
      return NextResponse.json(
        { message: "Client services is temporarily unavailable." },
        { status: 503 },
      );
    const inbox =
      process.env.ARYO_CONTACT_FALLBACK_EMAIL?.trim() || SUPPORT_EMAIL;
    const e = escapeHtml;
    const { error } = await new Resend(process.env.RESEND_API_KEY).emails.send({
      from: ORDER_FROM,
      to: inbox,
      replyTo: email,
      subject: `ARYO client services — ${name.replace(/[\r\n]/g, "")}`,
      text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      html: `<html><body style="font:14px/1.7 Arial,sans-serif;color:#111;background:#f9f8f6;padding:32px"><h1 style="font:36px Georgia,serif;letter-spacing:5px">ARYO</h1><h2 style="font-size:18px;font-weight:400">Client services enquiry</h2><p>${e(name)}<br>${e(email)}</p><p style="white-space:pre-wrap;border-top:1px solid #ddd;padding-top:24px">${e(message)}</p></body></html>`,
    });
    if (error)
      return NextResponse.json(
        {
          message:
            "Your message could not be delivered. Please email client services directly.",
        },
        { status: 503 },
      );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { message: "Invalid contact request." },
      { status: 400 },
    );
  }
}
