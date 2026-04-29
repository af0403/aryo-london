export const runtime = "edge";

// To receive support emails in your inbox:
// Resend dashboard → Domains → aryo.london → Inbound → set forwarding to aryocyrus@yahoo.co.uk

import { NextResponse } from "next/server";

type OrderItem = {
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  fulfillment: string;
};

type EmailRequest = {
  to: string;
  customerName: string;
  orderId?: string;
  items: OrderItem[];
  total: number;
};

type ContactRequest = {
  type: "contact";
  name: string;
  email: string;
  message: string;
};

function buildOrderEmailHtml(req: EmailRequest): string {
  const itemRows = req.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 14px 0; border-bottom: 1px solid #e8e4de; font-size: 13px; letter-spacing: 0.04em; color: #111;">
          ${item.name} / ${item.color}<br/>
          <span style="color: #999; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">
            Size ${item.size} &middot; Qty ${item.quantity}
            ${item.fulfillment === "made-to-order" ? "&middot; Made to order" : ""}
          </span>
        </td>
        <td style="padding: 14px 0; border-bottom: 1px solid #e8e4de; font-size: 13px; text-align: right; color: #111;">
          &pound;${(item.price * item.quantity).toFixed(2)}
        </td>
      </tr>`
    )
    .join("");

  const hasMadeToOrder = req.items.some((i) => i.fulfillment === "made-to-order");
  const hasStocked = req.items.some((i) => i.fulfillment !== "made-to-order");

  let fulfillmentNote = "";
  if (hasMadeToOrder && hasStocked) {
    fulfillmentNote = `
      <p style="margin: 0 0 0.6rem; font-size: 13px; color: #555; line-height: 1.7;">Your Structure Jacket is being handcrafted in London — please allow approximately 3 weeks before dispatch. Your trouser will be dispatched within 3–5 working days.</p>`;
  } else if (hasMadeToOrder) {
    fulfillmentNote = `
      <p style="margin: 0 0 0.6rem; font-size: 13px; color: #555; line-height: 1.7;">Your Structure Jacket is being handcrafted in London. Estimated lead time: 3 weeks.</p>`;
  } else {
    fulfillmentNote = `
      <p style="margin: 0 0 0.6rem; font-size: 13px; color: #555; line-height: 1.7;">Your order will be dispatched within 3–5 working days.</p>`;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin: 0; padding: 0; background: #f2efe8; font-family: sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: #f2efe8; padding: 48px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background: #f0eeeb; max-width: 560px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="padding: 40px 48px 28px; border-bottom: 1px solid #e0dbd4;">
              <p style="margin: 0; font-size: 26px; letter-spacing: 0.5em; font-family: Georgia, serif; font-weight: 500; color: #111;">ARYO</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 36px 48px 28px;">
              <p style="margin: 0 0 0.4rem; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #999;">Order confirmed</p>
              <p style="margin: 0 0 1.5rem; font-size: 22px; font-family: Georgia, serif; color: #111; font-weight: 400; line-height: 1.3;">
                ${req.customerName ? `Thank you, ${req.customerName}.` : "Thank you for your order."}
              </p>

              ${fulfillmentNote}
              <p style="margin: 0 0 1.8rem; font-size: 13px; color: #555; line-height: 1.7;">You will receive a shipping confirmation with tracking details once your order has been dispatched.</p>

              <!-- Order table -->
              <table width="100%" cellpadding="0" cellspacing="0">
                ${itemRows}
                <tr>
                  <td style="padding: 14px 0 6px; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #888;">Shipping</td>
                  <td style="padding: 14px 0 6px; font-size: 12px; text-align: right; color: #888;">Complimentary</td>
                </tr>
                <tr>
                  <td style="padding: 10px 0 0; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; color: #111; border-top: 1px solid #e0dbd4;">Total</td>
                  <td style="padding: 10px 0 0; font-size: 14px; text-align: right; font-weight: 600; color: #111; border-top: 1px solid #e0dbd4;">&pound;${req.total.toFixed(2)} GBP</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Sign-off -->
          <tr>
            <td style="padding: 0 48px 32px;">
              <p style="margin: 0; font-size: 13px; color: #555; line-height: 1.7;">The ARYO Team</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 20px 48px 32px; border-top: 1px solid #e0dbd4;">
              <p style="margin: 0 0 6px; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #bbb;">
                ARYO London &middot; Pennicella | AF by ARYO
              </p>
              <p style="margin: 0; font-size: 11px; color: #bbb;">
                Questions? <a href="mailto:support@aryo.london" style="color: #888; text-decoration: underline;">support@aryo.london</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function buildContactEmailHtml(req: ContactRequest): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin: 0; padding: 24px; font-family: sans-serif; font-size: 14px; color: #333; background: #f9f9f9;">
  <table style="max-width: 560px; background: #fff; padding: 28px 32px; border: 1px solid #e0e0e0;">
    <tr><td>
      <p style="margin: 0 0 1rem; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #999;">ARYO Contact Form</p>
      <p style="margin: 0 0 0.4rem;"><strong>Name:</strong> ${req.name}</p>
      <p style="margin: 0 0 0.4rem;"><strong>Email:</strong> <a href="mailto:${req.email}">${req.email}</a></p>
      <hr style="border: none; border-top: 1px solid #eee; margin: 1rem 0;" />
      <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${req.message}</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as (EmailRequest | ContactRequest) | null;
  if (!body) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "Email not configured." }, { status: 501 });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  // Contact form submission
  if ("type" in body && body.type === "contact") {
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ message: "Missing fields." }, { status: 400 });
    }
    const { error } = await resend.emails.send({
      from: "ARYO <orders@aryo.london>",
      to: "support@aryo.london",
      replyTo: body.email,
      subject: `Contact: ${body.name}`,
      html: buildContactEmailHtml(body),
    });
    if (error) return NextResponse.json({ message: error.message }, { status: 500 });
    return NextResponse.json({ ok: true });
  }

  // Order confirmation
  const orderReq = body as EmailRequest;
  if (!orderReq.to) {
    return NextResponse.json({ message: "Missing recipient." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "ARYO <orders@aryo.london>",
    to: orderReq.to,
    subject: "Your ARYO order is confirmed — Pennicella | AF by ARYO",
    html: buildOrderEmailHtml(orderReq),
  });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
