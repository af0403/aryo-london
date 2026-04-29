export const runtime = "edge";

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  if (searchParams.get("key") !== "aryo-admin-2024") {
    return NextResponse.json({ message: "Unauthorised." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json({ message: "Supabase not configured." }, { status: 501 });
  }

  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseServiceKey);

  const { data, error } = await supabase
    .from("email_log")
    .select("*")
    .order("sent_at", { ascending: false })
    .limit(20);

  if (error) return NextResponse.json({ message: error.message }, { status: 500 });
  return NextResponse.json({ logs: data });
}
