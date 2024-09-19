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

export const selectUserProfile = async(sub: string): Promise<Tables<"user_profiles"> | null> => {
  try {
    const { data, error } = await supabaseDbClient()
      .from('user_profiles') 
      .select('*') 
      .eq('user_id', sub) 
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