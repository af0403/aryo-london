export const runtime = "edge";

import { NextResponse } from "next/server";

function buildOverrideHtml(toEmail: string, body: string): string {
  const escaped = body
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
              ${escaped}
            </td>
          </tr>
          <tr><td style="padding: 0 48px;"><div style="height: 1px; background: #d8d4cd;"></div></td></tr>
          <tr>
            <td style="padding: 20px 48px 40px;" align="center">
              <p style="margin: 0; font-family: Arial, Helvetica, sans-serif; font-size: 11px; color: #bbb; letter-spacing: 0.06em;">&copy; 2026 ARYO. All rights reserved.</p>
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
  const { searchParams } = new URL(request.url);
  if (searchParams.get("key") !== "aryo-admin-2024") {
    return NextResponse.json({ message: "Unauthorised." }, { status: 401 });
  }

  const resendKey = process.env.RESEND_API_KEY;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!resendKey) {
    return NextResponse.json({ message: "Email not configured." }, { status: 501 });
  }

  const body = (await request.json().catch(() => null)) as {
    id: string;
    to: string;
    subject: string;
    response: string;
  } | null;

  if (!body?.id || !body?.to || !body?.response) {
    return NextResponse.json({ message: "Missing fields." }, { status: 400 });
  }

  const { Resend } = await import("resend");
  const resend = new Resend(resendKey);

  const { error } = await resend.emails.send({
    from: "ARYO <support@aryo.london>",
    to: body.to,
    replyTo: "support@aryo.london",
    subject: body.subject.startsWith("Re:") ? body.subject : `Re: ${body.subject}`,
    html: buildOverrideHtml(body.to, body.response),
  });

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });

  // Mark as overridden in Supabase
  if (supabaseUrl && supabaseServiceKey) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    await supabase
      .from("email_log")
      .update({ overridden: true, override_response: body.response })
      .eq("id", body.id);
  }

  return NextResponse.json({ ok: true });
}
