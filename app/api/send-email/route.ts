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

function buildEmailHtml(req: EmailRequest): string {
  const itemRows = req.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e4de; font-size: 13px; letter-spacing: 0.04em;">
          ${item.name} / ${item.color}<br/>
          <span style="color: #888; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase;">
            Size ${item.size} &middot; Qty ${item.quantity}
            ${item.fulfillment === "made-to-order" ? "&middot; Made to order" : ""}
          </span>
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e8e4de; font-size: 13px; text-align: right;">
          &pound;${item.price * item.quantity}
        </td>
      </tr>`
    )
    .join("");

  const hasMadeToOrder = req.items.some((i) => i.fulfillment === "made-to-order");
  const hasStocked = req.items.some((i) => i.fulfillment === "stocked");

  let dispatchNote = "";
  if (hasMadeToOrder && hasStocked) {
    dispatchNote = `<p style="margin: 0 0 0.75rem; font-size: 13px; color: #555; line-height: 1.6;">Your Structure Jacket is being crafted in London — please allow approximately 3 weeks before dispatch. Your trouser will be dispatched within 3–5 working days.</p>`;
  } else if (hasMadeToOrder) {
    dispatchNote = `<p style="margin: 0 0 0.75rem; font-size: 13px; color: #555; line-height: 1.6;">Your Structure Jacket is being crafted in London. Please allow approximately 3 weeks before dispatch.</p>`;
  } else if (hasStocked) {
    dispatchNote = `<p style="margin: 0 0 0.75rem; font-size: 13px; color: #555; line-height: 1.6;">Your order will be dispatched within 3–5 working days.</p>`;
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
              <p style="margin: 0; font-size: 28px; letter-spacing: 0.5em; font-family: Georgia, serif; font-weight: 500; color: #111;">ARYO</p>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding: 36px 48px;">
              <p style="margin: 0 0 0.5rem; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: #888;">Order confirmed</p>
              <p style="margin: 0 0 1.5rem; font-size: 22px; font-family: Georgia, serif; color: #111; font-weight: 400;">
                ${req.customerName ? `Thank you, ${req.customerName}.` : "Thank you for your order."}
              </p>
              ${dispatchNote}
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 1.5rem;">
                ${itemRows}
                <tr>
                  <td style="padding: 16px 0 0; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase;">Total</td>
                  <td style="padding: 16px 0 0; font-size: 13px; text-align: right; font-weight: 600;">&pound;${req.total} GBP</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-size: 13px; letter-spacing: 0.06em; text-transform: uppercase; color: #888;">Shipping</td>
                  <td style="padding: 8px 0; font-size: 13px; text-align: right; color: #888;">Complimentary</td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding: 24px 48px 36px; border-top: 1px solid #e0dbd4;">
              <p style="margin: 0; font-size: 11px; letter-spacing: 0.14em; text-transform: uppercase; color: #aaa;">
                ARYO London &middot; aryo.london &middot; Pennicella | AF by ARYO
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

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as EmailRequest | null;

  if (!body?.to) {
    return NextResponse.json({ message: "Missing recipient." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ message: "Email not configured — add RESEND_API_KEY to go live." }, { status: 501 });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  const { error } = await resend.emails.send({
    from: "ARYO <orders@aryo.london>",
    to: body.to,
    subject: "Your ARYO order is confirmed",
    html: buildEmailHtml(body),
  });

  if (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
