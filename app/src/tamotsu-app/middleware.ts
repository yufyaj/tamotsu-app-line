import { NextRequest, NextResponse } from "next/server";
import { auth } from "./lib/auth/auth";
import { verifyToken } from "./lib/line/line";
import { getToken } from "next-auth/jwt";

export async function middleware(request: NextRequest) {
  // 有効期限切れの時にリフレッシュする為に呼び出し
  await auth();
  const secret = process.env.NEXTAUTH_SECRET!
  const token = await getToken({ req: {headers: request.headers}, secret, salt: "__Secure-authjs.session-token", secureCookie: true })

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