// app/account/nutritionist/chat/show/[chatId]/page.tsx
"use client"

import { useEffect, useState, useRef } from 'react'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import Image from "next/image"
import { Tables } from "@/types/database.types";
import { io, Socket } from "socket.io-client";

type ChatPartner = {
  name: string
  profile_image_url?: string
}

export default function ChatDetail({ params }: { params: { chatId: string } }) {
  const [messages, setMessages] = useState<Tables<"messages">[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [userId, setUserId] = useState("")
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [partner, setPartner] = useState<ChatPartner | null>(null)
  const messageEndRef = useRef<HTMLDivElement>(null)
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Separate loading state for pagination
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver>();
  const topMessageRef = useRef<HTMLDivElement>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedViewImage, setSelectedViewImage] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        console.log('SOCKET_URL =>', process.env.NEXT_PUBLIC_SOCKET_URL);
        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL);

        // イベントリスナーの設定
        newSocket.on('connect', () => {
          console.log('Connected to socket.io server');
          // 接続成功時にルームに参加
          newSocket?.emit('joinChat', params.chatId);
          console.log('Joining chat room:', params.chatId);
        });

        newSocket.on('message', (messageData: Tables<"messages">) => {
          console.log("Received message:", messageData);
          if (messageData.chat_id === params.chatId) {
            setMessages(prev => [...prev, messageData]);
          }
        });

        newSocket.on('connect_error', (error: Error) => {
          console.error('Socket connection error:', error);
        });

        newSocket.on('disconnect', (reason) => {
          console.log('Disconnected from socket.io server:', reason);
        });

        newSocket.on('error', (error: Error) => {
          console.error('Socket error:', error);
        });

        console.log('Socket =>', newSocket);
        setSocket(newSocket);
      } catch (error) {
        console.error('Socket initialization error:', error);
      }
    })();

    // クリーンアップ関数
    return () => {
      if (socket) {
        console.log('Disconnecting from socket.io server');
        socket.off('connect');
        socket.off('message');
        socket.off('connect_error');
        socket.off('disconnect');
        socket.off('error');
        socket.disconnect();
      }
    }
  }, [params.chatId])

  // チャットの初期化（プロフィールとメッセージの取得）
  useEffect(() => {
    (async () => {
      try {
        // TODO: アカウントのユーザーIDを取得
        // チャット相手の情報を取得
        // await fetch(`/api/account/nutritionist/chat/partner/${params.chatId}`).then(async (res) => {
        //   if (res.ok) {
        //     const data = await res.json()
        //     setPartner(data)
        //   }
        // })

        // ユーザーIDの取得
        const profileRes = await fetch('/api/account/nutritionist/profile');
        if (profileRes.ok) {
          const data = await profileRes.json();
          setUserId(data.user_id);
        }

        // 初期メッセージ取得
        await fetchInitialMessages()
      } catch (error) {
        console.error('Error initializing chat:', error);
      }
    })();
  }, []);

  const handleImageClick = (imageUrl: string) => {
    setSelectedViewImage(imageUrl);
  };

  // handleSubmit関数を修正
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // メッセージのトリミングと空チェック
    const trimmedMessage = newMessage.trim();
    if (!trimmedMessage && !selectedImage) {
      return;
    }

    // FormDataを使用して、テキストと画像の両方を送信
    const formData = new FormData();

    // テキストメッセージがある場合
    if (trimmedMessage) {
      formData.append('content', trimmedMessage);
    }

    // 画像が選択されている場合
    if (selectedImage) {
      formData.append('image', selectedImage);
    }

    try {
      const response = await fetch(`/api/account/nutritionist/chat/messages/${params.chatId}`, {
        method: 'POST',
        body: formData, // Content-Typeヘッダーは自動的に設定される
      });

      if (!response.ok) {
        throw new Error('メッセージの送信に失敗しました');
      }

      const messageData = await response.json();

      // WebSocketを介してメッセージを送信
      socket?.emit('message', messageData);

      // 入力フィールドをクリア
      setNewMessage('');
      setSelectedImage(null);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }


  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
    }
  }

  // 初期メッセージ取得
  const fetchInitialMessages = async () => {
    const res = await fetch (`/api/account/nutritionist/chat/messages/${params.chatId}`);
    
    if (!res.ok) {
      return;
    }
    
    const data = await res.json();
    if (data) {
      await setMessages(data);
      setHasMore(data.length >= 20);
      await messageEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
    setIsLoading(false); // Set loading to false after initial fetch
  };

  // 追加メッセージ取得
  const fetchMoreMessages = async () => {
    if (isLoadingMore || !hasMore || messages.length === 0) return;
    setIsLoadingMore(true);

    const oldestMessageDate = messages[0]?.sended_at;
    const queryParams = {
      limit: '20',
      startFrom: oldestMessageDate,
    }
    const query = new URLSearchParams(queryParams);
    const res = await fetch (`/api/account/nutritionist/chat/messages/${params.chatId}?${query}`);
    
    if (!res.ok) {
      return;
    }
    
    const data = await res.json();
    
    setIsLoadingMore(false);
    if (data && data.length > 0) {
      setMessages(prev => [...data, ...prev]);
      setHasMore(data.length >= 20);
    } else {
      setHasMore(false);
    }
  };

  // Intersection Observer の設定
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        // 初期ローディング中は無視
        if (isLoading) return;
        
        if (entries[0].isIntersecting) {
          fetchMoreMessages();
        }
      },
      { threshold: 1.0 }
    );

    return () => observerRef.current?.disconnect();
  // isLoadingも依存配列に追加
  }, [messages, isLoading]);

  // 監視対象の設定
  useEffect(() => {
    if (topMessageRef.current && observerRef.current) {
      observerRef.current.observe(topMessageRef.current);
    }
  }, [messages]);

  return (
    <>
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
        {isLoading ? (
          <CardContent className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
          </CardContent>
        ) : (
          <CardContent className="flex-1 overflow-y-auto">
            {isLoadingMore && <div className="text-center py-2">Loading more...</div>}
            <div ref={topMessageRef} />
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
                        className="rounded-md cursor-pointer"
                        onClick={() => handleImageClick(message.image_url!)}
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
        )}
        <CardFooter>
          <form onSubmit={handleSubmit} className="w-full flex gap-2">
            <div className="flex flex-col gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-24"
              />
              {selectedImage && (
                <div className="relative w-20 h-20">
                  <Image
                    src={URL.createObjectURL(selectedImage)}
                    alt="Preview"
                    fill
                    className="object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              )}
            </div>
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
            
      {/* 画像モーダル */}
      {selectedViewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setSelectedViewImage(null)}
        >
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Image
              src={selectedViewImage}
              alt="Enlarged image"
              width={1200}
              height={1200}
              className="object-contain max-h-[90vh]"
            />
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-8 h-8"
              onClick={() => setSelectedViewImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  )
}