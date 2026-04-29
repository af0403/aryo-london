export const runtime = "edge";

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
  const firstName = req.customerName ? req.customerName.split(" ")[0] : "";

  const itemRows = req.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 16px 0; border-bottom: 1px solid #e0dbd4; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #111; letter-spacing: 0.02em;">
            ${item.name}
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #e0dbd4; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #555; letter-spacing: 0.02em;">
            ${item.color}
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #e0dbd4; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #555; text-align: center;">
            ${item.size}
          </td>
          <td style="padding: 16px 0; border-bottom: 1px solid #e0dbd4; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #111; text-align: right;">
            &pound;${(item.price * item.quantity).toFixed(2)}
          </td>
        </tr>`
    )
    .join("");

  const hasJacket = req.items.some(
    (i) => i.fulfillment === "made-to-order" || i.name.toLowerCase().includes("jacket")
  );
  const hasTrouser = req.items.some(
    (i) => i.fulfillment !== "made-to-order" || i.name.toLowerCase().includes("trouser")
  );

  let dispatchNote = "";
  if (hasJacket && hasTrouser) {
    dispatchNote = `
      <p style="margin: 0 0 12px; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #555; line-height: 1.75;">
        Your Structure Jacket is crafted individually after each order is placed. Current lead time is approximately 3 weeks. You will receive a shipping confirmation with tracking details once your piece is on its way.
      </p>
      <p style="margin: 0 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #555; line-height: 1.75;">
        Your trouser will be dispatched separately within 3–5 working days.
      </p>`;
  } else if (hasJacket) {
    dispatchNote = `
      <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #555; line-height: 1.75;">
        Your Structure Jacket is crafted individually after each order is placed. Current lead time is approximately 3 weeks. You will receive a shipping confirmation with tracking details once your piece is on its way.
      </p>`;
  } else {
    dispatchNote = `
      <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #555; line-height: 1.75;">
        Your order will be dispatched within 3–5 working days. You will receive a shipping confirmation with tracking details once dispatched.
      </p>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Your ARYO order is confirmed</title>
</head>
<body style="margin: 0; padding: 0; background: #e8e5de;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #e8e5de; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background: #f0eeeb; max-width: 600px; width: 100%;">

          <!-- ── Header ── -->
          <tr>
            <td align="center" style="padding: 48px 48px 32px;">
              <p style="margin: 0 0 8px; font-family: Georgia, 'Times New Roman', serif; font-size: 30px; font-weight: 400; letter-spacing: 0.55em; color: #111; text-transform: uppercase;">ARYO</p>
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 9px; font-weight: 400; letter-spacing: 0.35em; color: #888; text-transform: uppercase;">Pennicella &nbsp;&middot;&nbsp; AF by ARYO</p>
            </td>
          </tr>

          <!-- rule -->
          <tr>
            <td style="padding: 0 48px;">
              <div style="height: 1px; background: #d8d4cd;"></div>
            </td>
          </tr>

          <!-- ── Opening ── -->
          <tr>
            <td style="padding: 40px 48px 0;">
              <p style="margin: 0 0 6px; font-family: Arial, Helvetica, sans-serif; font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: #999;">Order confirmed</p>
              <p style="margin: 0 0 20px; font-family: Georgia, 'Times New Roman', serif; font-size: 24px; font-weight: 400; color: #111; line-height: 1.35;">
                ${firstName ? `Thank you, ${firstName}.` : "Thank you for your order."}
              </p>
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #555; line-height: 1.75;">
                Your order has been received and is being prepared with care.
              </p>
            </td>
          </tr>

          <!-- ── Order summary table ── -->
          <tr>
            <td style="padding: 32px 48px 0;">
              <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
                <!-- column headers -->
                <tr>
                  <td style="padding: 0 0 10px; font-family: Arial, Helvetica, sans-serif; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; border-bottom: 1px solid #d8d4cd;">Item</td>
                  <td style="padding: 0 0 10px; font-family: Arial, Helvetica, sans-serif; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; border-bottom: 1px solid #d8d4cd;">Colour</td>
                  <td style="padding: 0 0 10px; font-family: Arial, Helvetica, sans-serif; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; text-align: center; border-bottom: 1px solid #d8d4cd;">Size</td>
                  <td style="padding: 0 0 10px; font-family: Arial, Helvetica, sans-serif; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; color: #999; text-align: right; border-bottom: 1px solid #d8d4cd;">Price</td>
                </tr>
                ${itemRows}
                <!-- Shipping row -->
                <tr>
                  <td colspan="3" style="padding: 14px 0 6px; font-family: Arial, Helvetica, sans-serif; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #999;">Shipping</td>
                  <td style="padding: 14px 0 6px; font-family: Arial, Helvetica, sans-serif; font-size: 12px; text-align: right; color: #999; font-style: italic;">Complimentary</td>
                </tr>
                <!-- Total row -->
                <tr>
                  <td colspan="3" style="padding: 12px 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; font-weight: 700; color: #111; border-top: 1px solid #d8d4cd;">Total</td>
                  <td style="padding: 12px 0 0; font-family: Arial, Helvetica, sans-serif; font-size: 14px; text-align: right; font-weight: 700; color: #111; border-top: 1px solid #d8d4cd;">&pound;${req.total.toFixed(2)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- ── Dispatch note ── -->
          <tr>
            <td style="padding: 32px 48px 0;">
              <div style="background: #eae7e0; border-left: 2px solid #c8c3ba; padding: 16px 20px;">
                ${dispatchNote}
              </div>
            </td>
          </tr>

          <!-- ── Closing ── -->
          <tr>
            <td style="padding: 36px 48px 0;">
              <p style="margin: 0 0 4px; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #555; line-height: 1.75;">
                For any questions, contact us at <a href="mailto:support@aryo.london" style="color: #111; text-decoration: underline;">support@aryo.london</a>
              </p>
              <p style="margin: 20px 0 4px; font-family: Georgia, 'Times New Roman', serif; font-size: 14px; color: #111;">The ARYO Team</p>
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 12px; color: #888;">
                <a href="https://aryo.london" style="color: #888; text-decoration: none;">aryo.london</a>
              </p>
            </td>
          </tr>

          <!-- rule -->
          <tr>
            <td style="padding: 36px 48px 0;">
              <div style="height: 1px; background: #d8d4cd;"></div>
            </td>
          </tr>

          <!-- ── Footer ── -->
          <tr>
            <td style="padding: 20px 48px 40px;" align="center">
              <p style="margin: 0 0 4px; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #bbb; letter-spacing: 0.06em;">&copy; 2026 ARYO. All rights reserved.</p>
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #bbb;">
                This email was sent to <a href="mailto:${req.to}" style="color: #bbb; text-decoration: underline;">${req.to}</a>
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
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin: 0; padding: 24px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333; background: #f9f9f9;">
  <table cellpadding="0" cellspacing="0" style="max-width: 560px; background: #fff; padding: 28px 32px; border: 1px solid #e0e0e0;">
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

  const orderReq = body as EmailRequest;
  if (!orderReq.to) {
    return NextResponse.json({ message: "Missing recipient." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "ARYO <orders@aryo.london>",
    to: orderReq.to,
    replyTo: "support@aryo.london",
    subject: "Your ARYO order is confirmed — Pennicella | AF by ARYO",
    html: buildOrderEmailHtml(orderReq),
  });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
