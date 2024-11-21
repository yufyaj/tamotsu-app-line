import { getChatIdByUserId, selectUser } from '@/lib/supabase/database'
import getMyToken from '@/lib/token/getMyToken'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const token = await getMyToken(request)
    const sub = token?.sub

    if (!sub) {
      return new NextResponse(null)
    }

    const savedUser = await selectUser(sub)
    if (savedUser === null) {
      return new NextResponse(null)
    }

    const chatList = await getChatIdByUserId(savedUser.id) // awaitを追加
    console.log("chatList=>", chatList)
    return new NextResponse(JSON.stringify(chatList))
  } catch (error) {
    console.error("Error in GET handler:", error)
    return new NextResponse(null, { status: 500 })
  }
}