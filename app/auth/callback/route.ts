import { NextResponse } from "next/server";
// Supabase links issued before the migration can no longer establish a session.
export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/account?auth_error=1", request.url));
}
