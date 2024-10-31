import { Tables } from "@/types/database.types";
import { supabaseDbClient } from "./supabase"

export const selectUser = async(sub: string): Promise<Tables<"users"> | null> => {
  try {
    const { data, error } = await supabaseDbClient()
      .from('users') 
      .select('*') 
      .eq('sub', sub) 
      .single(); 

    if (error) {
      return null;
    }

    return data; 
  } catch (error) {
    return null; // エラー時はnullを返す
  }
}

export const selectUserProfile = async(id: string): Promise<Tables<"user_profiles"> | null> => {
  try {
    const { data, error } = await supabaseDbClient()
      .from('user_profiles') 
      .select('*') 
      .eq('user_id', id) 
      .single(); 

    if (error) {
      return null;
    }

    return data; 
  } catch (error) {
    return null; // エラー時はnullを返す
  }
}

export const selectNutritionistProfileList = async(query: string, page: number): Promise<Tables<"nutritionist_profiles">[] | null> => {
  try {
    const from = page * 10
    console.log("from:", from, ", to:", from + 9)
    const { data, error } = await supabaseDbClient()
      .from('nutritionist_profiles') 
      .select('*') 
      .or(`name.like.%${query}%, specialty.like.%${query}%, bio.like.%${query}%`)
      .range(from, from + 9)
      .order('name');

    if (error) {
      return null;
    }

    return data; 
  } catch (error) {
    return null; // エラー時はnullを返す
  }
}

export const selectNutritionistProfile = async(id: string): Promise<Tables<"nutritionist_profiles"> | null> => {
  try {
    const { data, error } = await supabaseDbClient()
      .from('nutritionist_profiles') 
      .select('*') 
      .eq('user_id', id) 
      .single(); 

    if (error) {
      return null;
    }

    return data; 
  } catch (error) {
    return null; // エラー時はnullを返す
  }
}

export const insertUser = async (user: Tables<"users">) => {
  try {
    const supabase = supabaseDbClient()
    const { error } = await supabase.from('users').insert(user);

    if (error) {
      return null;
    }
  } catch (errro) {
    return null;
  }
}

export const upsertUserProfile = async (userProfile: Tables<"user_profiles">) => {
  try {
    const supabase = supabaseDbClient()
    const { error } = await supabase.from('user_profiles').upsert(userProfile);

    if (error) {
      return null;
    }
  } catch (errro) {
    return null;
  }
}

export const upsertNutritionistProfile = async (nutritionistProfile: Tables<"nutritionist_profiles">) => {
  try {
    const supabase = supabaseDbClient()
    const { error } = await supabase.from('nutritionist_profiles').upsert(nutritionistProfile);

    if (error) {
      return null;
    }
  } catch (error) {
    return null;
  }
}

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
      .eq('canceled_at', null)
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