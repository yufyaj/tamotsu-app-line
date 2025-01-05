// app/api/account/nutritionist/chat/messages/[chatId]/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { insertMessage, getMessages } from '@/lib/db/chat'
import { upload } from '@/lib/supabase/storage'
import getMyToken from '@/lib/token/getMyToken'
import { v4 as uuidv4 } from "uuid"
import { selectUser } from '@/lib/db/user'
import { LineClient } from '@/lib/line/client'
import { getChatPartnerSub } from '@/lib/db/chat' // チャット相手の情報を取得する関数を追加
import { ImageMessage, TextMessage } from '@/lib/line/types/line.type'
import { NextApiResponse } from 'next'

export async function GET(
  request: NextRequest,
  { params }: { params: { 
    chatId: string
  } },
) {
  const token = await getMyToken(request)
  if (!token?.sub) return new NextResponse(null, { status: 401 })

  const url = new URL(request.url)
  const limit = Number(url.searchParams.get("limit") ?? 20)
  const startFrom = url.searchParams.get("startFrom") ?? undefined

  const messages = await getMessages(params.chatId, limit ?? 20, startFrom)
  return NextResponse.json(messages)
}

export async function POST(
  request: NextRequest,
  { params }: { params: { chatId: string } },
  response: NextApiResponse
) {
  const token = await getMyToken(request)
  const sub = token?.sub

  if (!sub) {
    return new NextResponse(null, { status: 401 })
  }

  const savedUser = await selectUser(sub)
  if (savedUser === null) {
    return new NextResponse(null, { status: 401 })
  }

  const partnerSub = await getChatPartnerSub(params.chatId, savedUser.id)
  if (!partnerSub) {
    return new NextResponse(
      JSON.stringify({ error: 'Partner information not found' }), 
      { status: 404 }
    )
  }

  const formData = await request.formData()
  const content = formData.get('content') as string | null
  const image = formData.get('image') as File | null

  // 画像とテキストの両方が空の場合はエラー
  if (!content && !image) {
    return new NextResponse(
      JSON.stringify({ error: 'Message content and image cannot both be empty' }), 
      { status: 400 }
    )
  }

  let imageUrl = null
  if (image) {
    try {
      imageUrl = await upload(image)
    } catch (error) {
      console.error('Image upload error:', error)
      return new NextResponse(
        JSON.stringify({ error: 'Failed to upload image' }), 
        { status: 500 }
      )
    }
  }

  // メッセージをデータベースに保存
  const messageData = await insertMessage({
    id: uuidv4(),
    chat_id: params.chatId,
    content: content || '',  // contentがnullの場合は空文字を設定
    image_url: imageUrl,
    sender_id: savedUser.id,
  })

  try {
    const lineClient = new LineClient()
    const messages: (TextMessage | ImageMessage)[] = []

    // テキストメッセージがある場合
    if (content) {
      messages.push({
        type: 'text',
        text: content
      })
    }

    // 画像URLがある場合
    if (imageUrl) {
      messages.push({
        type: 'image',
        originalContentUrl: imageUrl,
        previewImageUrl: imageUrl
      })
    }

    // LINEにメッセージを送信
    if (messages.length > 0) {
      await lineClient.sendMessage(partnerSub, messages)
    }
  } catch (error) {
    console.error('Error sending LINE message:', error)
  }

  return NextResponse.json(messageData)
}
