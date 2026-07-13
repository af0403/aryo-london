export const runtime = "edge";

import { NextResponse } from "next/server";

type LookupResponse =
  | { source: "postcodes.io"; postcode: string; city: string }
  | { source: "not-found" };

export async function GET(request: Request): Promise<NextResponse<LookupResponse>> {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("postcode") ?? "";
  const postcode = raw.trim().replace(/\s+/g, " ").toUpperCase();

  if (!postcode) {
    return NextResponse.json({ source: "not-found" });
  }

  // Fallback: postcodes.io for city/district only
  try {
    const res = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(postcode)}`
    );
    const data = (await res.json()) as {
      status: number;
      result: { postcode: string; post_town: string | null; admin_district: string | null } | null;
    };
    if (data.status === 200 && data.result) {
      const r = data.result;
      const rawCity = r.post_town ?? r.admin_district ?? "";
      const city = rawCity
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(" ");
      return NextResponse.json({ source: "postcodes.io", postcode: r.postcode, city });
    }
  } catch {
    // fall through
  }

  return NextResponse.json({ source: "not-found" });
}
