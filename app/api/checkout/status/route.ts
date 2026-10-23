import { NextResponse } from "next/server";
import { isCommerceEnabled } from "../../../../lib/commerce/availability";
import { orderDatabase } from "../../../../lib/commerce/orders";
export const dynamic = "force-dynamic";
export async function GET() {
  let available = false;
  if (isCommerceEnabled()) {
    try {
      const { error } = await orderDatabase()
        .from("customer_orders")
        .select("id")
        .limit(0);
      available = !error;
    } catch {
      /* Checkout remains unavailable if its order store cannot be reached. */
    }
  }
  return NextResponse.json(
    { available },
    { headers: { "Cache-Control": "no-store" } },
  );
}
