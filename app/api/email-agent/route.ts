export const runtime = "edge";

import { NextResponse } from "next/server";

// Resend inbound webhook → POST /api/email-agent
// Configure in Resend dashboard: Domains → aryo.london → Inbound → Webhook URL

type ResendInboundPayload = {
  from: string;
  to: string | string[];
  subject: string;
  text?: string;
  html?: string;
  headers?: Record<string, string>;
};

const SYSTEM_PROMPT = `You are the ARYO customer service team. ARYO is a London luxury clothing brand.

The Pennicella collection includes:
- Structure Jacket: £200, made to order, approximately 3 week lead time, available in Noir and Ivory colourways
- Essential Trouser: £100, limited run of 100, available in Noir and Ivory colourways

Shipping is complimentary worldwide. Returns are accepted within 14 days, unworn, in original condition.

For order queries, ask the customer for their order number if they have not provided it.

Be warm, professional, and concise. Use British English. Do not use exclamation marks. Sign off as:

The ARYO Team
aryo.london`;

function buildAgentReplyHtml(toEmail: string, originalSubject: string, replyBody: string): string {
  const escapedBody = replyBody
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
<body style="margin: 0; padding: 0; background: #e8e5de;">
  <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background: #e8e5de; padding: 48px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" role="presentation" style="background: #f0eeeb; max-width: 600px; width: 100%;">
          <tr>
            <td align="center" style="padding: 48px 48px 32px;">
              <p style="margin: 0 0 8px; font-family: Georgia, 'Times New Roman', serif; font-size: 30px; font-weight: 400; letter-spacing: 0.55em; color: #111; text-transform: uppercase;">ARYO</p>
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 9px; letter-spacing: 0.35em; color: #888; text-transform: uppercase;">Pennicella &nbsp;&middot;&nbsp; AF by ARYO</p>
            </td>
          </tr>
          <tr><td style="padding: 0 48px;"><div style="height: 1px; background: #d8d4cd;"></div></td></tr>
          <tr>
            <td style="padding: 36px 48px 40px; font-family: Arial, Helvetica, sans-serif; font-size: 13px; color: #444; line-height: 1.75;">
              ${escapedBody}
            </td>
          </tr>
          <tr><td style="padding: 0 48px;"><div style="height: 1px; background: #d8d4cd;"></div></td></tr>
          <tr>
            <td style="padding: 20px 48px 40px;" align="center">
              <p style="margin: 0 0 4px; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #bbb; letter-spacing: 0.06em;">&copy; 2026 ARYO. All rights reserved.</p>
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #bbb;">
                This email was sent to <a href="mailto:${toEmail}" style="color: #bbb; text-decoration: underline;">${toEmail}</a>
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

function buildForwardHtml(
  fromEmail: string,
  subject: string,
  originalBody: string,
  aiDraft: string
): string {
  const esc = (s: string) =>
    s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, "<br />");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /></head>
<body style="margin: 0; padding: 24px; font-family: Arial, Helvetica, sans-serif; font-size: 14px; color: #333; background: #f9f9f9;">
  <table cellpadding="0" cellspacing="0" style="max-width: 640px; background: #fff; padding: 28px 32px; border: 1px solid #e0e0e0;">
    <tr><td>
      <p style="margin: 0 0 1rem; font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #999;">ARYO Email Agent — review &amp; forward</p>

      <p style="margin: 0 0 0.3rem;"><strong>From:</strong> <a href="mailto:${fromEmail}">${fromEmail}</a></p>
      <p style="margin: 0 0 1.2rem;"><strong>Subject:</strong> ${esc(subject)}</p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 0 0 1.2rem;" />

      <p style="margin: 0 0 0.5rem; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #999;">Original message</p>
      <p style="margin: 0 0 1.5rem; white-space: pre-wrap; line-height: 1.6; color: #555;">${esc(originalBody)}</p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 0 0 1.2rem;" />

      <p style="margin: 0 0 0.5rem; font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #999;">AI draft sent to customer</p>
      <p style="margin: 0; white-space: pre-wrap; line-height: 1.6; background: #f5f5f5; padding: 12px 16px; border-left: 3px solid #ccc;">${esc(aiDraft)}</p>
    </td></tr>
  </table>
</body>
</html>`;
}

export async function POST(request: Request) {
  const anthropicKey = process.env.ANTHROPIC_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!anthropicKey || !resendKey) {
    return NextResponse.json({ message: "Agent not configured." }, { status: 501 });
  }

  const payload = (await request.json().catch(() => null)) as ResendInboundPayload | null;
  if (!payload?.from || !payload?.subject) {
    return NextResponse.json({ message: "Invalid inbound payload." }, { status: 400 });
  }

  const fromEmail = payload.from;
  const subject = payload.subject;
  const bodyText = payload.text ?? payload.html ?? "(no body)";

  // Don't auto-reply to our own emails — prevents loops
  if (fromEmail.includes("aryo.london")) {
    return NextResponse.json({ ok: true, skipped: "own-domain" });
  }

  // Generate AI response
  const { Anthropic } = await import("@anthropic-ai/sdk");
  const anthropic = new Anthropic({ apiKey: anthropicKey });

  const message = await anthropic.messages.create({
    model: "claude-haiku-4-5",
    max_tokens: 600,
    system: SYSTEM_PROMPT,
    messages: [
      {
        role: "user",
        content: `Customer email from ${fromEmail}:\nSubject: ${subject}\n\n${bodyText}`,
      },
    ],
  });

  const aiReply =
    message.content[0].type === "text"
      ? message.content[0].text
      : "Thank you for getting in touch. We will be in touch shortly.\n\nThe ARYO Team";

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  // Send AI reply to customer
  await resend.emails.send({
    from: "ARYO <support@aryo.london>",
    to: fromEmail,
    replyTo: "support@aryo.london",
    subject: subject.startsWith("Re:") ? subject : `Re: ${subject}`,
    html: buildAgentReplyHtml(fromEmail, subject, aiReply),
  });

  // Forward original + AI draft to Aryo for review
  await resend.emails.send({
    from: "ARYO Agent <orders@aryo.london>",
    to: "aryocyrus@yahoo.co.uk",
    subject: `[Agent sent] Re: ${subject}`,
    html: buildForwardHtml(fromEmail, subject, bodyText, aiReply),
  });

  // Log to Supabase if configured
  if (supabaseUrl && supabaseServiceKey) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    await supabase.from("email_log").insert({
      from_email: fromEmail,
      subject,
      body: bodyText,
      ai_response: aiReply,
    });
  }

  return NextResponse.json({ ok: true });
}
