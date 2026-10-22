import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { orderDatabase } from "../../../lib/commerce/orders";
export async function GET() {
  try {
    const {
      data: { user },
    } = await (await createClient()).auth.getUser();
    if (!user?.email || !user.email_confirmed_at)
      return new Response(null, { status: 401 });
    const { data, error } = await orderDatabase()
      .from("customer_orders")
      .select("id,created_at,total_pence,status,items")
      .eq("customer_email", user.email.toLowerCase())
      .in("status", ["paid", "fulfilled", "refunded"])
      .order("created_at", { ascending: false })
      .limit(100);
    if (error) throw error;
    return NextResponse.json(
      { orders: data },
      { headers: { "Cache-Control": "private, no-store" } },
    );
  } catch {
    return NextResponse.json(
      { message: "Order history is temporarily unavailable." },
      { status: 503 },
    );
  }
}
