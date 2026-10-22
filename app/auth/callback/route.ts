import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
export async function GET(request: Request) {
  const url = new URL(request.url),
    code = url.searchParams.get("code"),
    requested = url.searchParams.get("next");
  const next = requested === "/account/reset" ? requested : "/account";
  if (code) {
    const { error } = await (
      await createClient()
    ).auth.exchangeCodeForSession(code);
    if (!error) return NextResponse.redirect(new URL(next, url.origin));
  }
  return NextResponse.redirect(new URL("/account?auth_error=1", url.origin));
}
