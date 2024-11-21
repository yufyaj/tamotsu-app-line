// app/api/account/nutritionist/chat/messages/[chatId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { insertMessage, getMessages, selectUser } from '@/lib/supabase/database'
import { upload } from '@/lib/supabase/storage'
import getMyToken from '@/lib/token/getMyToken'
import { v4 as uuidv4 } from "uuid";

export async function GET(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const token = await getMyToken(request)
  if (!token?.sub) return new NextResponse(null, { status: 401 })

  const messages = await getMessages(params.chatId)
  return NextResponse.json(messages)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } }
) {
  const token = await getMyToken(request)

  if (!token?.sub) return new NextResponse(null, { status: 401 })

  const sub = token?.sub

  const savedUser = await selectUser(sub)
  if (savedUser === null) {
    return new NextResponse(null)
  }

  const formData = await request.formData()
  const content = formData.get('content') as string
  const image = formData.get('image') as File

  let imageUrl = null
  if (image) {
    imageUrl = await upload(image)
  }

  const message = await insertMessage({
    id: uuidv4(),
    chat_id: params.chatId,
    content,
    image_url: imageUrl,
    sender_id: savedUser.id,
  })

  return NextResponse.json(message)
}