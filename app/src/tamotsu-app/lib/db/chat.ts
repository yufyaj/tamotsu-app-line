import { Tables } from "@/types/database.types";
import { supabaseDbClient } from "../supabase/supabase"

export const existsActiveChat = async (id: string) => {
  try {
    const { data: dataChatParticipant, error: errorChatParticipant } = await supabaseDbClient()
      .from('chat_participants') 
      .select('*') 
      .eq('user_id', id)
      .order('created_at', {'ascending': false});
    
    if (errorChatParticipant) {
      return true;
    }

    if (dataChatParticipant.length == 0) {
      return false;
    }
    console.log("dataChatParticipant[0].chat_id=>", dataChatParticipant[0].chat_id)
    const { data: dataChat, error: errorChat } = await supabaseDbClient()
      .from('chats') 
      .select('*') 
      .is('canceled_at', null)
      .eq('id', dataChatParticipant[0].chat_id)
      .single(); 

    if (errorChat || dataChat) {
      return true;
    }

    return false;
  } catch (error) {
    return true;
  }
}

export const insertChat = async (chat: Tables<"chats">) => {
  try {
    const supabase = supabaseDbClient()
    const { error } = await supabase.from('chats').insert(chat);

    if (error) {
      return null;
    }
  } catch (errro) {
    return null;
  }
}

export const insertChatParticipants = async (chatParticipant: Tables<"chat_participants">) => {
  try {
    const supabase = supabaseDbClient()
    const { error } = await supabase.from('chat_participants').insert(chatParticipant);

    if (error) {
      return null;
    }
  } catch (errro) {
    return null;
  }
}

type ChatListItem = {
  chat_id: string;
  partner_name: string;
  profile_image_url: string | null;
  last_message: string | null;
  last_message_at: string | null;
}

export const getChatIdByUserId = async (userId: string): Promise<ChatListItem[] | null> => {
  try {
    // Get active chats for the user
    const { data: activeChats, error: chatsError } = await supabaseDbClient()
      .from('chat_participants')
      .select(`
        chat_id,
        chats!inner(canceled_at)
      `)
      .eq('user_id', userId)
      .is('chats.canceled_at', null);

    if (chatsError || !activeChats) return null;

    const chatResults: ChatListItem[] = [];

    // Process each active chat
    for (const chat of activeChats) {
      // Get partner user_id
      const { data: partner, error: partnerError } = await supabaseDbClient()
        .from('chat_participants')
        .select('user_id')
        .eq('chat_id', chat.chat_id)
        .neq('user_id', userId)
        .single();

      if (partnerError || !partner) continue;

      // Get partner's name
      const { data: profile, error: profileError } = await supabaseDbClient()
        .from('user_profiles')
        .select('name, profile_image_url')
        .eq('user_id', partner.user_id)
        .single();

      if (profileError || !profile) continue;

      // Get latest message
      const { data: lastMessage, error: messageError } = await supabaseDbClient()
        .from('messages')
        .select('content, sended_at')
        .eq('chat_id', chat.chat_id)
        .order('sended_at', { ascending: false })
        .limit(1)
        .single();

      chatResults.push({
        chat_id: chat.chat_id,
        partner_name: profile.name,
        profile_image_url: profile!.profile_image_url,
        last_message: (lastMessage == null) ? null : lastMessage.content,
        last_message_at: (lastMessage == null) ? null : lastMessage.sended_at
      });
    }

    // Sort by last_message_at in descending order (newest first)
    chatResults.sort((a, b) => {
      if (!a.last_message_at) return 1;
      if (!b.last_message_at) return -1;
      return new Date(b.last_message_at).getTime() - new Date(a.last_message_at).getTime();
    });

    console.log("chatResults=>", chatResults);
    return chatResults;
  } catch (error) {
    console.error("チャットリスト取得中にエラーが発生:", error);
    return null;
  }
}

// lib/supabase/database.ts に追加
export const getMessages = async (chatId: string) => {
  try {
    const { data, error } = await supabaseDbClient()
      .from('messages')
      .select('*')
      .eq('chat_id', chatId)
      .order('sended_at', { ascending: true })

    if (error) return null
    return data
  } catch (error) {
    return null
  }
}

export const insertMessage = async (message: {
  id: string
  chat_id: string
  content: string
  sender_id: string
  image_url?: string | null
}) => {
  try {
    console.log("message=>", message)
    const { data, error } = await supabaseDbClient()
      .from('messages')
      .insert({
        ...message,
        sended_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) return null
    return data
  } catch (error) {
    return null
  }
}