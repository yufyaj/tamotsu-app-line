// app/account/nutritionist/chat/show/[chatId]/page.tsx
"use client"

import { useEffect, useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"

type Message = {
  id: string
  content: string
  sender_id: string
  image_url?: string
  sended_at: string
}

type ChatPartner = {
  name: string
  profile_image_url?: string
}

export default function ChatDetail({ params }: { params: { chatId: string } }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [userId, setUserId] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [partner, setPartner] = useState<ChatPartner | null>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // チャット相手の情報を取得
    fetch(`/api/account/nutritionist/chat/partner/${params.chatId}`).then(async (res) => {
      if (res.ok) {
        const data = await res.json()
        setPartner(data)
      }
    })

    // メッセージ履歴を取得
    fetch(`/api/account/nutritionist/chat/messages/${params.chatId}`).then(async (res) => {
      if (res.ok) {
        const data = await res.json()
        setMessages(data)
      }
    })

    // アカウントのユーザーIDを取得
    fetch(`/api/account/nutritionist/profile`).then(async (res) => {
      if (res.ok) {
        const data = await res.json()
        setUserId(data.user_id)
        console.log("userId=>", data)
      }
    })
  }, [params.chatId])

  // 新しいメッセージが追加されたら自動スクロール
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const formData = new FormData()
    formData.append('content', newMessage)
    if (selectedImage) {
      formData.append('image', selectedImage)
    }

    const res = await fetch(`/api/account/nutritionist/chat/messages/${params.chatId}`, {
      method: 'POST',
      body: formData
    })

    if (res.ok) {
      setNewMessage("")
      setSelectedImage(null)
      // メッセージ一覧を更新
      const data = await res.json()
      setMessages([...messages, data])
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto h-[80vh] flex flex-col">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage src={partner?.profile_image_url} alt={partner?.name} />
            <AvatarFallback>{partner?.name?.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <CardTitle>{partner?.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender_id === userId ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[70%] ${message.sender_id === userId ? 'bg-primary text-primary-foreground' : 'bg-muted'} rounded-lg p-3`}>
              {message.image_url && (
                <div className="mb-2">
                  <Image
                    src={message.image_url}
                    alt="Sent image"
                    width={200}
                    height={200}
                    className="rounded-md"
                  />
                </div>
              )}
              <p>{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {new Date(message.sended_at).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
        <div ref={messageEndRef} />
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="w-full flex gap-2">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-24"
          />
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="メッセージを入力..."
            className="flex-1"
          />
          <Button type="submit">送信</Button>
        </form>
      </CardFooter>
    </Card>
  )
}