import { NextResponse } from "next/server";
import { auth } from "../../../lib/auth";
import { headers } from "next/headers";
import { orderDatabase } from "../../../lib/commerce/orders";
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user;
    if (!user?.email || !user.emailVerified)
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
