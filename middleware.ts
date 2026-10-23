import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Admin lockdown — key required in query string
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const key = request.nextUrl.searchParams.get("key");
    if (!process.env.ARYO_ADMIN_KEY || key !== process.env.ARYO_ADMIN_KEY) {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4)$).*)",
  ],
};
