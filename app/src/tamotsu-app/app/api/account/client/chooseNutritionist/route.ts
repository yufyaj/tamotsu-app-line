import { existsActiveChat, insertChat, insertChatParticipants } from "@/lib/db/chat";
import { selectUser } from "@/lib/db/user";
import getMyToken from "@/lib/token/getMyToken";
import { Tables } from "@/types/database.types";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"

export async function POST (request: NextRequest) {
  const token = await getMyToken(request)
  const sub = token?.sub
  const reqBody = await request.json();

  if (!sub) {
    console.log("no sub")
    return new NextResponse(null, {status: 400});
  }

  const savedUser = await selectUser(sub)

  if (!savedUser) {
    console.log("no user")
    return new NextResponse(null, {status: 400});
  }

  const existsChat = await existsActiveChat(savedUser.id)

  if (existsChat) {
    return new NextResponse(null, {status: 400});
  }

  const chatId  = uuidv4()
  const now = new Date(Date.now())
  const chat:Tables<"chats"> = {
    id: chatId,
    canceled_at: null,
    created_at: now.toISOString(),
  }

  const memberIds: string[] = [savedUser.id, reqBody.nutritionist.user_id]

  try {
    await insertChat(chat);

    memberIds.forEach(async (memberId) => {
      const chatParticipant:Tables<"chat_participants"> = {
        chat_id: chatId,
        user_id: memberId,
        created_at: now.toISOString(),
      }
      await insertChatParticipants(chatParticipant)
    })

    return new NextResponse(null, {status: 200});
  } catch (error) {
    console.log("error=>", error)
    return new NextResponse(null, {status: 400});
  }
}