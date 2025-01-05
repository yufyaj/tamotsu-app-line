// app/api/line/webhook/route.ts
import { getChatIdByClientUserId, insertMessage } from "@/lib/db/chat"
import { selectUser } from "@/lib/db/user"
import { NextRequest, NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { upload } from '@/lib/supabase/storage'
import { ClientConfig, messagingApi } from "@line/bot-sdk";

type LineMessage = {
  destination: string
  events: {
    type: string
    message: {
      type: string
      id: string
      text: string
    }
    timestamp: number
    source: {
      type: string
      userId: string
    }
    replyToken: string
    mode: string
  }[]
}

const clientConfig: ClientConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
};
const client = new messagingApi.MessagingApiBlobClient(clientConfig);

export async function POST(request: NextRequest) {
  try {
    // リクエストボディの取得
    const body: LineMessage = await request.json()
    
    // 受信したメッセージの内容をログ出力
    console.log("LINE Webhook received:")
    console.log("Destination:", body.destination)
    
    body.events.forEach(async (event, index) => {
      console.log(`Event ${index + 1}:`)
      console.log("- Type:", event.type)
      console.log("- Message:", event.message)
      console.log("- Timestamp:", new Date(event.timestamp))
      console.log("- Source:", event.source)
      console.log("- Reply Token:", event.replyToken)
    
      const sub = event.source.userId

      if (!sub) {
        return; // 次のイベントへ
      }
    
      const savedUser = await selectUser(sub)
      if (savedUser === null) {
        console.log("User not found")
        return; // 次のイベントへ
      }

      // チャット相手の情報を取得
      const chatId = await getChatIdByClientUserId(savedUser.id)
      if (chatId === null) {
        return; // 次のイベントへ
      }

      if (event.message.type == 'text') {
        const content = event.message.text
        const messageData = {
          id: uuidv4(),
          chat_id: chatId,
          content,
          image_url: null,
          sender_id: savedUser.id,
        }
        // メッセージをデータベースに保存
        const insertedMessageData = await insertMessage(messageData)

        // メッセージデータをPOSTリクエストで送信
        await fetch('http://websocket:4000/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(insertedMessageData),
        });
      }
      if (event.message.type == 'image') {
        const imageContent = await client.getMessageContent(event.message.id)
        const chunks: Uint8Array[] = [];
        for await (const chunk of imageContent) {
          chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        console.log('Image content:', buffer)
        // 画像データをBlobに変換
        const blob = new Blob([buffer], { type: 'image/jpeg' })
        const file = new File([blob], `${event.message.id}.jpg`, { type: 'image/jpeg' })
        
        // Supabaseにアップロード
        const imageUrl = await upload(file)

        const messageData = {
          id: uuidv4(),
          chat_id: chatId,
          content: '',
          image_url: imageUrl,
          sender_id: savedUser.id,
        }
        
        const insertedMessageData = await insertMessage(messageData)
        
        await fetch('http://websocket:4000/message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(insertedMessageData),
        });
      }
    })

    // LINEサーバーには200 OKを返す
    return new NextResponse("OK", { status: 200 })

  } catch (error) {
    console.error("Error processing webhook:", error)
    return new NextResponse("Internal Server Error", { status: 500 })
  }
}