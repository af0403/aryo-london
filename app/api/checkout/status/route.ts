import { NextResponse } from "next/server";
import { isCommerceEnabled } from "../../../../lib/commerce/availability";
export const dynamic = "force-dynamic";
export async function GET() {
  return NextResponse.json(
    { available: isCommerceEnabled() },
    { headers: { "Cache-Control": "no-store" } },
  );
}
