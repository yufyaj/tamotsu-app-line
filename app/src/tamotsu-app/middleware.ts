import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/line/line";
import getMyToken from "./lib/token/getMyToken";
import { JWT } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  const token = await getMyToken(request) as unknown as JWT | null;
  if (!token || !token.accessToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (!await verifyToken(token.accessToken! as string)) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/user')) {
    // TODO: ここはハンドリングする
  }
  if (request.nextUrl.pathname.startsWith('/nutritionist')) {
    // TODO: ここはハンドリングする
  }
}

export const config = {
  matcher: ['/user/:path*', '/nutritionist/:path*'],
}