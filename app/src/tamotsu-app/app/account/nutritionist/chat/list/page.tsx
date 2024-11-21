"use client"

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

type ChatListItem = {
  chat_id: string;
  partner_name: string;
  profile_image_url?: string;
  last_message?: string;
  last_message_at?: string;
}

export default function ChatList() {
  const [chats, setChats] = useState<ChatListItem[]>([])
  const router = useRouter()

  useEffect(() => {
    fetch("/api/account/nutritionist/chat/list").then(async (res: Response) => {
      try {
        const chats = await res.json()
        console.log(chats)
        setChats(chats)
      } catch (error) {
        console.log(error)
      }
    })
  }, [])

  const handleChatClick = (chatId: string) => {
    router.push(`/account/nutritionist/chat/show/${chatId}`)
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>チャット一覧</CardTitle>
      </CardHeader>
      <CardContent>
        {chats.map(chat => (
          <div
            key={chat.chat_id}
            className="flex items-center space-x-4 p-4 border-b cursor-pointer"
            onClick={() => handleChatClick(chat.chat_id)}
          >
            <Avatar>
              <AvatarImage src={chat.profile_image_url} alt={chat.partner_name} />
              <AvatarFallback>{chat.partner_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-semibold">{chat.partner_name}</h3>
              <p className="text-sm text-gray-500">{chat.last_message}</p>
            </div>
            <div className="text-sm text-gray-400">
              {chat.last_message_at && new Date(chat.last_message_at).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}