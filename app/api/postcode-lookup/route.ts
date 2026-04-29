export const runtime = "edge";

import { NextResponse } from "next/server";

type GetAddressResult = {
  line_1: string;
  line_2: string;
  line_3: string;
  line_4: string;
  locality: string;
  town_or_city: string;
  county: string;
  country: string;
};

type LookupResponse =
  | { source: "getaddress"; postcode: string; addresses: GetAddressResult[] }
  | { source: "postcodes.io"; postcode: string; city: string }
  | { source: "not-found" }
  | { source: "error" };

export async function GET(request: Request): Promise<NextResponse<LookupResponse>> {
  const { searchParams } = new URL(request.url);
  const raw = searchParams.get("postcode") ?? "";
  const postcode = raw.trim().replace(/\s+/g, " ").toUpperCase();

  if (!postcode) {
    return NextResponse.json({ source: "not-found" });
  }

  const apiKey = process.env.GETADDRESS_API_KEY;

  // Primary: getAddress.io (server-side key — no NEXT_PUBLIC_ needed)
  if (apiKey) {
    try {
      const res = await fetch(
        `https://api.getaddress.io/find/${encodeURIComponent(postcode)}?api-key=${apiKey}&expand=true`,
        { headers: { Accept: "application/json" } }
      );
      if (res.status === 429) {
        return NextResponse.json({ source: "error" });
      }
      if (res.ok) {
        const data = (await res.json()) as {
          postcode?: string;
          addresses?: GetAddressResult[];
        };
        const addresses = data.addresses ?? [];
        if (addresses.length > 0) {
          return NextResponse.json({
            source: "getaddress",
            postcode: data.postcode ?? postcode,
            addresses,
          });
        }
      }
    } catch {
      // fall through to postcodes.io
    }
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
