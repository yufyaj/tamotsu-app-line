import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/line/line";
import getMyToken from "./lib/token/getMyToken";
import { selectUser } from "./lib/db/user";

export async function middleware(request: NextRequest) {
  // セッショントークンの検証
  const token = await getMyToken(request)
  console.log("token=>", token)
  if (!token?.sub) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // LINEアクセストークンの検証
  const lineToken = token.accessToken as string
  if (!lineToken || !await verifyToken(lineToken)) {
    // トークンが無効な場合はログアウト処理
    return NextResponse.redirect(new URL('/', request.url))
  }

  const userData = await selectUser(token.sub)
  const existsUser = !!userData
  const isClient = userData?.role === 'user'
  const isNutritionist = userData?.role === 'nutritionist'

  // アカウントタイプに基づくアクセス制御
  if (request.nextUrl.pathname.startsWith('/account/client')) {
    controlUserPath(request, existsUser, isClient)
  }

  if (request.nextUrl.pathname.startsWith('/account/nutritionist')) {
    controlNutritionistPath(request, existsUser, isNutritionist)
  }
}

export const config = {
  matcher: '/account/:path*',
}

// ユーザー制御
function controlUserPath(request: NextRequest, existsUser: boolean, isClient: boolean) {
  // ユーザーが存在しない場合は、プロフィール登録画面への接続OK
  if (request.nextUrl.pathname === '/account/client/profile') {
    if (!existsUser) {
      return
    }
  }

  if (!isClient) {
    return NextResponse.redirect(new URL('/account/nutritionist', request.url))
  }
}

// 栄養士制御
function controlNutritionistPath(request: NextRequest, existsUser: boolean, isNutritionist: boolean) {
  // ユーザーが存在しない場合は、プロフィール登録画面への接続OK
  if (request.nextUrl.pathname === '/account/nutritionist/profile') {
    if (!existsUser) {
      return
    }
  }

  if (!isNutritionist) {
    return NextResponse.redirect(new URL('/account/client', request.url))
  }
}